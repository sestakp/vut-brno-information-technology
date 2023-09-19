using System.ComponentModel.DataAnnotations;
using System.Linq;
using Amazon.SecurityToken.Model;
using Common.Controllers;
using Common.Enums;
using Common.Models;
using Common.RabbitMQ;
using EmployeesMicroservice.Facades;
using EmployeesMicroservice.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EmployeesMicroservice.Controllers;

public class EmployeeController : Controller<Employee>
{
    private readonly EmailFacade _emailFacade;
    private readonly JwtTokenFacade _jwtTokenFacade;
    private readonly PasswordGenerationFacade _passwordGenerationFacade;
    private readonly IMongoCollection<UserLoggingAtemptModel> _userLoggingAtemptCollection; 
    private readonly RabbitMQProducer _producer;

    public EmployeeController(IMongoCollection<Employee> collection, PasswordGenerationFacade passwordGenerationFacade,
        EmailFacade emailFacade, JwtTokenFacade jwtTokenFacade,
        IMongoCollection<UserLoggingAtemptModel> userLoggingAtemptCollection, RabbitMQProducer producer, ILogger<Controller<Employee>> logger, HttpClient client, IHttpContextAccessor contextAccessor) : base(collection, logger, client, contextAccessor)
    {
        _passwordGenerationFacade = passwordGenerationFacade;
        _emailFacade = emailFacade;
        _jwtTokenFacade = jwtTokenFacade;
        _userLoggingAtemptCollection = userLoggingAtemptCollection;
        _producer = producer;
    }


    public string Register(RegisterFormModel model)
    {
        CheckIfItsAdministrator("Registration ");

        Logger.Log(LogLevel.Information, $"Registration of new user: {model}");

        Validator.ValidateObject(model, new ValidationContext(model), true);

        var password = _passwordGenerationFacade.GetRandomAlphanumericString(16);
        var hasher = new PasswordHasher<Employee>();

        if (model.Role < 0 || model.Role > 2)
        {
            throw new ArgumentException("Invalid user role, role can be {0,1,2}");
        }

        var employee = new Employee
        {
            Id = model.Email,
            Name = model.Name,
            Role = (RoleEnum)Enum.ToObject(typeof(RoleEnum), model.Role)
        };

        employee.PasswordHash = hasher.HashPassword(employee, password);
        Collection.InsertOne(employee);
        _emailFacade.SendEmail(model, password);


        Logger.Log(LogLevel.Information, $"User inserted into database: {employee.Email}");

        return employee.Id;
    }

    public IEnumerable<Employee> GetAllManagers()
    {
        Logger.LogInformation("Getting all managers");
        return base.Get().Where(e => e.Role != RoleEnum.Administrator).Select(e => {
            e.PasswordHash = String.Empty;
            return e;
        });
    }


    public ReplaceOneResult ChangePassword(ChangePasswordFormModel model)
    {
        Logger.Log(LogLevel.Information, $"Changing password for: {model.Email}");

        var email = _contextAccessor.HttpContext?.Items["email"]?.ToString();

        if (email == null)
        {
            Logger.LogCritical("Cannot get email from httpContext items['email']");
        }

        if (email != model.Email && Collection.Find(GetFilter(email)).FirstOrDefault()?.Role != RoleEnum.SuperManager)
        {
            Logger.Log(LogLevel.Information, $"User {email} cannot change password of user {model.Email}");
            throw new Exception("Access denied");
        }

        Validator.ValidateObject(model, new ValidationContext(model), true);

        var user = Collection.Find(GetFilter(model.Email)).FirstOrDefault();

        if (user != null)
        {
            var hasher = new PasswordHasher<Employee>();

            if (hasher.VerifyHashedPassword(user, user.PasswordHash, model.OldPassword)
                == PasswordVerificationResult.Success)
            {
                user.PasswordHash = hasher.HashPassword(user, model.NewPassword);

                return Collection.ReplaceOne(GetFilter(user.Id), user);
            }
        }

        Logger.Log(LogLevel.Error, $"Invalid user for change password: {model.Email}");

        throw new InvalidAuthorizationMessageException("Invalid");
    }

    public string Login(LoginFormModel model)
    {
        var user = Collection.Find(GetFilter(model.Email)).FirstOrDefault();

        var ipAddress = _contextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
        Logger.LogInformation($"Logging from ip address {ipAddress}");

        if (user != null)
        {
            var hasher = new PasswordHasher<Employee>();

            var employee = new Employee
            {
                Id = user.Email,
                Name = user.Name,
                Role = user.Role
            };

            if (hasher.VerifyHashedPassword(employee, user.PasswordHash, model.Password)
                == PasswordVerificationResult.Success)
            {
                var filter = Builders<UserLoggingAtemptModel>.Filter.Eq(x => x.IpAddress, ipAddress);
                var count = _userLoggingAtemptCollection.CountDocuments(filter);

                if (count > 4)
                {
                    Logger.Log(LogLevel.Error, $"Too many login attempts: {model.Email}");
                    throw new InvalidOperationException("Too many login attempts, rest for 1 hour.");
                }


                Logger.Log(LogLevel.Information, $"Generating token for: {model.Email}");
                return _jwtTokenFacade.GenerateToken(employee.Email, employee.Role);
            }

            var userLoggingAtemptModel = new UserLoggingAtemptModel
            {
                IpAddress = ipAddress,
                CreatedAt = DateTime.Now
            };

            _userLoggingAtemptCollection.InsertOne(userLoggingAtemptModel);
        }

        Logger.Log(LogLevel.Information, $"Login invalid user: {model.Email}");
        throw new InvalidAuthorizationMessageException("Invalid");
    }


    public IResult VerifyToken(VerifyModel model)
    {
        
        var verifyResult = _jwtTokenFacade.ValidateToken(model.Token);

        if (verifyResult.Email != "")
        {
            var employee = Collection.Find(GetFilter(verifyResult.Email)).FirstOrDefault();

            if (employee != null && verifyResult.Email.Equals(employee.Email))
            {
                Logger.Log(LogLevel.Information, $"Verify successful for email: {verifyResult.Email}");
                return Results.Ok(verifyResult);
            }

            Logger.Log(LogLevel.Warning, $"Verify token user unauthorized: {verifyResult.Email}");
            return Results.Unauthorized();
        }

        Logger.Log(LogLevel.Error, $"Verify token cannot parse email from token");
        return Results.Unauthorized();
    }

    public override DeleteResult Delete(string id)
    {
        Logger.Log(LogLevel.Information, $"Deleting user with id: {id}");
        CheckIfItsAdministrator("Delete employee");
        var result = base.Delete(id);
        _producer.SendMessage(id);
        return result;
    }

    public override IEnumerable<Employee> Get()
    {
        CheckIfItsAdministrator("Get all employees");
        var employees = base.Get();
        return employees.Select(e => { 
            e.PasswordHash = String.Empty;
            return e;
        });
    }

    public override Employee Get(string id)
    {
        var employee =  base.Get(id);
        employee.PasswordHash = String.Empty;
        return employee;
    }

    public override ReplaceOneResult Put(Employee item)
    {
        CheckIfItsAdministrator($"Update employee {item.ToJson()}");

        var employee = base.Get(item.Id);
        item.PasswordHash = employee.PasswordHash;
        return base.Put(item);
    }




}