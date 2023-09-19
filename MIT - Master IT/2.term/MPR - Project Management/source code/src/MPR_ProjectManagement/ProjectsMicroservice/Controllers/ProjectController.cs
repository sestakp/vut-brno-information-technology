using Common.Controllers;
using Common.Models;
using Common.RabbitMQ;
using MongoDB.Driver;
using OpenTelemetry.Trace;
using System.Net.Http;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.IdGenerators;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.Text;
using Common.Enums;
using System.Net.Http.Headers;
using System.Data;
using MongoDB.Bson;

namespace ProjectsMicroservice.Controllers
{
    public class ProjectController : Controller<Project>
    {
        private readonly RabbitMQProducer _producer;
        private readonly IMongoCollection<Participate> _participateCollection;

        public ProjectController(IMongoCollection<Project> projectCollection, RabbitMQProducer producer, IMongoCollection<Participate> participateCollection, HttpClient httpClient, ILogger<Controller<Project>> logger, IHttpContextAccessor contextAccessor) : base(projectCollection, logger, httpClient,contextAccessor)
        {
            this._producer = producer;
            _participateCollection = participateCollection;

            CheckIfItsNotAdministrator("Project");
        }

        public override IEnumerable<Project> Get()
        {
            CheckIfItsSuperManager("All projects");
            return base.Get();
        }

        public override Project Get(string id)
        {

            var project = base.Get(id);
            var email = _contextAccessor.HttpContext?.Items["email"]?.ToString();

            if (email == null)
            {
                Logger.LogCritical("Cannot get email from httpContext items['email']");
            }

            var participate = _participateCollection.CountDocuments(GetParticipateFilter(id,email));
            if (participate > 0)
            {
                return project;
            }

            CheckIfItsSuperManagerOrProjectManager("Get project by id",project.ProjectManager);
            return project;
        }

        public override string Post(Project item)
        {
            CheckValues(item);
            return base.Post(item);
        }

        public override ReplaceOneResult Put(Project item)
        {
            CheckValues(item);
            var project = Get(item.Id);
            CheckIfItsSuperManagerOrProjectManager("Update project", project.ProjectManager);
            return base.Put(item);
        }


        public override DeleteResult Delete(string id)
        {
            var project = Get(id);
            CheckIfItsSuperManagerOrProjectManager("Update project", project.ProjectManager);
            var result = base.Delete(id);
            _participateCollection.DeleteMany(Builders<Participate>.Filter.Eq(p => p.ProjectId, id));
            _producer.SendMessage(id);
            return result;
        }
        

        public string AssignEmployeeToProject(Participate participate)
        {
            var employee = GetEmployeeAsync(participate.EmployeeId).Result;
            if (employee?.Role == RoleEnum.Administrator)
            {
                throw new ArgumentException("Cannot assign admin to project");
            }

            var project = Get(participate.ProjectId);
            CheckIfItsSuperManagerOrProjectManager("Assign project participant", project.ProjectManager);
            _participateCollection.InsertOne(participate);
            return participate.Id;
        }

        public DeleteResult DeleteEmployeeFromProject(string projectId, string employeeId)
        {
            var project = Get(projectId);
            CheckIfItsSuperManagerOrProjectManager("Delete project participant", project.ProjectManager);
            return _participateCollection.DeleteOne(GetParticipateFilter(projectId, employeeId));
        }
        protected static FilterDefinition<Participate> GetParticipateFilter(string projectId, string employeeId) =>
            Builders<Participate>.Filter.Eq(p => p.EmployeeId, employeeId) & Builders<Participate>.Filter.Eq(p => p.ProjectId, projectId);

        public bool EmployeeParticipate(string projectId, string employeeId)
        {
            return _participateCollection.CountDocuments(Builders<Participate>.Filter.Eq(p => p.ProjectId, projectId) &
                                        Builders<Participate>.Filter.Eq(p => p.EmployeeId, employeeId)) == 1;
        }

        public IEnumerable<Project> GetByProjectManager(string projectManagerId)
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

            var projectIds = _participateCollection.Find(Builders<Participate>.Filter.Eq(p => p.EmployeeId, projectManagerId)).Project(p => p.ProjectId).ToEnumerable().Distinct();
            
            return Collection.Find(Builders<Project>.Filter.In(x=>x.Id, projectIds)).ToEnumerable();
        }

        public async Task<IEnumerable<Employee?>> GetProjectParticipants(string id)
        {
            Logger.LogInformation("GetProjectParticipants");
            var employeeIds = _participateCollection.Find(Builders<Participate>.Filter.Eq(p => p.ProjectId, id))
                .Project(p => p.EmployeeId)
                .ToEnumerable()
                .Distinct();

            Logger.LogInformation("Employee ids ");

            var tasks = new List<Task<Employee?>>();
            foreach (var employeeId in employeeIds)
            {
                Logger.LogInformation($"id: {employeeId} ");
                var task = GetEmployeeAsync(employeeId);
                tasks.Add(task);
            }

            // read the response content as a list of Employee objects

            var employees = await Task.WhenAll(tasks);

            return employees.Where(e => e != null);
        }

        private async Task<Employee?> GetEmployeeAsync(string id)
        {
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.GetAsync($"http://build-pool:32786/employees/{id}");
            if (response.IsSuccessStatusCode)
            {
                Logger.LogInformation($"Get employee response status code {response.StatusCode}");
                Logger.LogInformation($"Get employee response content {response.Content}");
                return await response.Content.ReadFromJsonAsync<Employee>();
            }
            else
            {
                Logger.LogError($"GetEmployeeAsync response status code {response.StatusCode}");
                return null;
            }
            
        }

        private void CheckValues(Project item)
        {
            var employee = GetEmployeeAsync(item.ProjectManager).Result;
            if (employee == null)
            {
                Logger.Log(LogLevel.Information, $"Invalid Project.ProjectManager {item.ProjectManager}");
                throw new Exception("Invalid ProjectManager");
            }
        }
        

    }
}
