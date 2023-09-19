using System.Net.Http.Json;
using Amazon.Runtime.Internal.Util;
using MongoDB.Driver;
using Common.Models.Interfaces;
using Common.Controllers.Interfaces;
using Microsoft.Extensions.Logging;
using Common.Enums;
using Microsoft.AspNetCore.Http;
using Common.Models;
using MongoDB.Bson;

namespace Common.Controllers
{
    public class Controller<T> : IController<T> where T : IMongoItem
    {
        protected readonly IMongoCollection<T> Collection;
        protected readonly ILogger<Controller<T>> Logger;
        protected readonly HttpClient _httpClient;
        protected readonly IHttpContextAccessor _contextAccessor;
        public Controller(IMongoCollection<T> collection, ILogger<Controller<T>> logger, HttpClient httpClient, IHttpContextAccessor contextAccessor)
        {
            this.Collection = collection;
            Logger = logger;
            _httpClient = httpClient;
            _contextAccessor = contextAccessor;
        }

        public virtual IEnumerable<T> Get()
        {
            Logger.Log(LogLevel.Information, "Getting all records");
            return Collection.Find(Builders<T>.Filter.Empty).ToEnumerable();
        }

        public virtual T Get(string id)
        {
            Logger.Log(LogLevel.Information, $"Get record by id {id}");
            return Collection.Find(GetFilter(id)).FirstOrDefault();
        }
         
        public virtual string Post(T item)
        {
            Logger.LogInformation($"Post item: {item}");
            Collection.InsertOne(item);
            return item.Id;
        }

        public virtual ReplaceOneResult Put(T item)
        {
            Logger.Log(LogLevel.Information, $"Put item: {item}");
            return Collection.ReplaceOne(GetFilter(item.Id), item);
            
        }

        public virtual DeleteResult Delete(string id)
        {
            Logger.Log(LogLevel.Information, $"Delete item by id: {id}");
            return Collection.DeleteOne(GetFilter(id));
        }

        protected static FilterDefinition<T> GetFilter(string id) =>
            Builders<T>.Filter.Eq(p => p.Id, id);


        protected void CheckIfItsSuperManagerOrProjectManager(string message, string projectManagerId)
        {
            var role = _contextAccessor.HttpContext?.Items["role"]?.ToString();
            var email = _contextAccessor.HttpContext?.Items["email"]?.ToString();

            if (role == null)
            {
                Logger.LogCritical("Cannot get role from httpContext items['role']");
            }

            if (email == null)
            {
                Logger.LogCritical("Cannot get email from httpContext items['email']");
            }

            var parsedRole = (RoleEnum)Enum.Parse(typeof(RoleEnum), role);

            if (parsedRole != RoleEnum.SuperManager && !projectManagerId.Equals(email))
            {
                Logger.LogError(message + " available only for managers.");
                throw new UnauthorizedAccessException(message + " available only for managers.");
            }
        }

        protected void CheckIfItsSuperManager(string message)
        {
            var role = _contextAccessor.HttpContext?.Items["role"]?.ToString();

            if (role == null)
            {
                Logger.LogCritical("Cannot get role from httpContext items['role']");
            }

            var parsedRole = (RoleEnum)Enum.Parse(typeof(RoleEnum), role);

            if (parsedRole != RoleEnum.SuperManager)
            {
                Logger.LogError(message + " available only for administrators.");
                throw new UnauthorizedAccessException(message + " available only for administrators.");
            }
        }


        protected void CheckIfItsAdministrator(string message)
        {
            var role = _contextAccessor.HttpContext?.Items["role"]?.ToString();

            if (role == null)
            {
                Logger.LogCritical("Cannot get role from httpContext items['role']");
            }

            var parsedRole = (RoleEnum)Enum.Parse(typeof(RoleEnum), role);

            if (parsedRole != RoleEnum.Administrator)
            {
                Logger.LogError(message + " available only for administrators.");
                throw new UnauthorizedAccessException(message + " available only for administrators.");
            }
        }

        protected void CheckIfItsNotAdministrator(string message)
        {
            var role = _contextAccessor.HttpContext?.Items["role"]?.ToString();

            if (role == null)
            {
                Logger.LogCritical("Cannot get role from httpContext items['role']");
            }

            var parsedRole = (RoleEnum)Enum.Parse(typeof(RoleEnum), role);

            if (parsedRole == RoleEnum.Administrator)
            {
                Logger.LogError(message + " available only for managers.");
                throw new UnauthorizedAccessException(message + " available only for managers.");
            }
        }
    }
}
