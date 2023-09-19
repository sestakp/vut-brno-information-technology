using Common.Controllers;
using Common.Models;
using Common.Models.Interfaces;
using Common.RabbitMQ;
using MongoDB.Driver;
using System.Net.Http;
using System.Net.Http.Headers;

namespace ProjectPhasesMicroservice.Controllers
{
    public class ProjectPhaseController : Controller<ProjectPhase>
    {
        private readonly RabbitMQProducer _producer;
        public ProjectPhaseController(IMongoCollection<ProjectPhase> collection, HttpClient client, ILogger<Controller<ProjectPhase>> logger, RabbitMQProducer producer, IHttpContextAccessor contextAccessor) : base(collection, logger, client, contextAccessor)
        {
            _producer = producer;

            CheckIfItsNotAdministrator("Project phase");
        }

        public override string Post(ProjectPhase item)
        {
            CheckValues(item);
            return base.Post(item);
        }

        public override ReplaceOneResult Put(ProjectPhase item)
        {
            CheckValues(item);
            return base.Put(item);
        }
        

        public IEnumerable<ProjectPhase> GetPhasesByProjectId(string id)
        {
            return Collection.Find(Builders<ProjectPhase>.Filter.Eq(p => p.ProjectId, id)).ToEnumerable();
        }

        private async Task<Project?> GetProjectAsync(string id)
        {
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"http://build-pool:32782/projects/{id}");
            if (response.IsSuccessStatusCode)
            {
                Logger.LogInformation($"Get project response status code {response.StatusCode}");
                Logger.LogInformation($"Get project response content {await response.Content.ReadAsStringAsync()}");
                return await response.Content.ReadFromJsonAsync<Project>();
            }
            else
            {
                Logger.LogError($"GetProjectAsync response status code {response.StatusCode}");
                return null;
            }

        }

        private void CheckValues(ProjectPhase item)
        {
            var project = GetProjectAsync(item.ProjectId).Result;
            if (project == null)
            {
                Logger.Log(LogLevel.Information, $"Invalid ProjectPhase.ProjectId {item.ProjectId}");
                throw new Exception("Invalid ProjectId");
            }
            if (project.StartDate > item.StartDate)
            {
                Logger.Log(LogLevel.Information, $"Invalid ProjectPhase.StartDate {item.StartDate}");
                throw new Exception("Invalid StartDate");
            }
            if (project.EndDate != null && project.EndDate < item.EndDate)
            {
                Logger.Log(LogLevel.Information, $"Invalid ProjectPhase.EndDate {item.EndDate}");
                throw new Exception("Invalid EndDate");
            }

            CheckIfItsSuperManagerOrProjectManager("Project phases", project.ProjectManager);
            var phases = GetPhasesByProjectId(item.ProjectId);
            if (phases.Any(p => p.StartDate < item.StartDate && p.EndDate > item.EndDate))
            {
                Logger.Log(LogLevel.Information, $"Invalid dates {item.StartDate} {item.EndDate}");
                throw new Exception("Invalid dates");
            }
        }

        public override DeleteResult Delete(string id)
        {
            Logger.Log(LogLevel.Information, $"Deleting user with id: {id}");
            var projectPhase = Get(id);
            var project = GetProjectAsync(projectPhase.ProjectId).Result;
            CheckIfItsSuperManagerOrProjectManager("Project phases", project?.ProjectManager);
            var result = base.Delete(id);
            _producer.SendMessage(id);
            return result;
        }
    }
}
