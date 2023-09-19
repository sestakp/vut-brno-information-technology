using Common.Controllers;
using Common.Models;
using MongoDB.Driver;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace OpportunitiesMicroservice.Controllers
{
    public class OpportunityController : Controller<Opportunity>
    {
        public OpportunityController(IMongoCollection<Opportunity> collection, HttpClient client, ILogger<Controller<Opportunity>> logger, IHttpContextAccessor contextAccessor) : base(collection, logger, client, contextAccessor)
        {
            CheckIfItsNotAdministrator("Opportunities");
        }

        public override string Post(Opportunity item)
        {
            CheckValues(item);
            return base.Post(item);
        }

        public override ReplaceOneResult Put(Opportunity item)
        {
            CheckValues(item);
            return base.Put(item);
        }

        public IEnumerable<Opportunity> GetOpportunitiesByProjectId(string id)
        {
            return Collection.Find(Builders<Opportunity>.Filter.Eq(p => p.ProjectId, id)).ToEnumerable();
        }

        private async Task<Project?> GetProjectAsync(string id)
        {
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"http://build-pool:32782/projects/{id}");
            if (response.IsSuccessStatusCode)
            {
                Logger.LogInformation($"Get project response status code {response.StatusCode}");
                var content = await response.Content.ReadAsStringAsync();
                Logger.LogInformation($"Get project response content {content}");
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var project = JsonSerializer.Deserialize<Project>(content, options);
                return project;
            }
            
            Logger.LogError($"GetProjectAsync response status code {response.StatusCode}");
            return null;
            

        }

        private void CheckValues(Opportunity item)
        {
            var project = GetProjectAsync(item.ProjectId).Result;
            if (project == null)
            {
                Logger.Log(LogLevel.Information, $"Invalid Opportunity.ProjectId {item.ProjectId}");
                throw new Exception("Invalid ProjectId");
            }
        }
    }
}
