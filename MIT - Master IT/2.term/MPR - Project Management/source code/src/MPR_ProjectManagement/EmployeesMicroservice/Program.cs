using Common.Controllers;
using Common.Controllers.Interfaces;
using Common.Models;
using Common.Pipelines;
using EmployeesMicroservice.Controllers;
using EmployeesMicroservice.Facades;
using EmployeesMicroservice.Models;
using EmployeesMicroservice.Pipelines;
using System.IdentityModel.Tokens.Jwt;
using Common.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Amazon.Auth.AccessControlPolicy;
using Common.Enums;
using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;

var builder = new EmployeesBuilderPipeline().Build(args);
var app = new EmployeesAppPipeline().Build(builder);


var collection = app.Services.GetRequiredService<IMongoCollection<Employee>>();
if (collection.CountDocuments(FilterDefinition<Employee>.Empty) == 0)
{
    var hasher = new PasswordHasher<Employee>();
    var employee = new Employee
    {
        Id = "admin@test.com",
        Name = "admin",
        Role = RoleEnum.Administrator
    };

    employee.PasswordHash = hasher.HashPassword(employee, "123456");
    collection.InsertOne(employee);
}


app.MapPost("/employees/register", [Authorize(Policy = "JwtAuthorizationPolicy")] (RegisterFormModel m, EmployeeController controller) => controller.Register(m));
app.MapPost("/employees/login", (LoginFormModel m, EmployeeController controller) => controller.Login(m));
app.MapPost("/employees/verify", (VerifyModel m, EmployeeController controller) => controller.VerifyToken(m));
app.MapPost("/employees/changePassword", [Authorize(Policy = "JwtAuthorizationPolicy")] (ChangePasswordFormModel m, EmployeeController controller) => controller.ChangePassword(m));
app.MapGet("/employees", [Authorize(Policy = "JwtAuthorizationPolicy")] (EmployeeController controller) => controller.Get());
app.MapGet("/employees/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, EmployeeController controller) => controller.Get(id));
app.MapDelete("/employees/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, EmployeeController controller) => controller.Delete(id));
app.MapPut("/employees", [Authorize(Policy = "JwtAuthorizationPolicy")] (Employee employee, EmployeeController controller) => controller.Put(employee));
app.MapGet("/employees/getAllManagers", [Authorize(Policy = "JwtAuthorizationPolicy")] (EmployeeController controller) => controller.GetAllManagers());

app.Run();