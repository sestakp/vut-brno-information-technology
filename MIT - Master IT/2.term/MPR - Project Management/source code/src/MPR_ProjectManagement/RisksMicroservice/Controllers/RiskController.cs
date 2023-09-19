using Common.Controllers;
using Common.Models;
using MongoDB.Driver;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;

namespace RisksMicroservice.Controllers
{
    public class RiskController : Controller<Risk>
    {
        public RiskController(IMongoCollection<Risk> collection, HttpClient client, ILogger<Controller<Risk>> logger, IHttpContextAccessor contextAccessor) : base(collection, logger, client, contextAccessor)
        {
            CheckIfItsNotAdministrator("Risk");
        }

        public override string Post(Risk item)
        {
            CheckValues(item);
            return base.Post(item);
        }

        public override ReplaceOneResult Put(Risk item)
        {
            CheckValues(item);
            return base.Put(item);
        }

        public override DeleteResult Delete(string id)
        {
            var risk = Get(id);
            CheckValues(risk);
            return base.Delete(id);
        }

        public IList<string> GetUsedCategories()
        {
            return Collection.Distinct<string>("Category", Builders<Risk>.Filter.Empty).ToList();
        }

        public IList<string> GetUsedCauses()
        {
            return Collection.Distinct<string>("Cause", Builders<Risk>.Filter.Empty).ToList();
        }

        public IList<string> GetUsedVulnerabilities()
        {
            var vList = Collection.Find(Builders<Risk>.Filter.Empty).Project(r => r.Vulnerabilities).ToList();
            return vList.Aggregate((i,j) => i.Union(j).ToList());
        }

        public IEnumerable<Risk> GetRisksByProjectId(string id)
        {
            return Collection.Find(Builders<Risk>.Filter.Eq(p => p.ProjectId, id)).ToEnumerable();
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
        private async Task<Employee?> GetEmployeeAsync(string id)
        {
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"http://build-pool:32786/employees/{id}");
            if (response.IsSuccessStatusCode)
            {
                Logger.LogInformation($"Get employee response status code {response.StatusCode}");
                Logger.LogInformation($"Get employee response content {await response.Content.ReadAsStringAsync()}");
                return await response.Content.ReadFromJsonAsync<Employee>();
            }
            else
            {
                Logger.LogError($"GetEmployeeAsync response status code {response.StatusCode}");
                return null;
            }

        }
        private async Task<ProjectPhase?> GetPhaseAsync(string id)
        {
            if (id.IsNullOrEmpty()) return null;
            var token = _contextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _httpClient.GetAsync($"http://build-pool:32781/phases/{id}");
            if (response.IsSuccessStatusCode)
            {
                Logger.LogInformation($"Get ProjectPhase response status code {response.StatusCode}");
                Logger.LogInformation($"Get ProjectPhase response content {await response.Content.ReadAsStringAsync()}");
                return await response.Content.ReadFromJsonAsync<ProjectPhase>();
            }
            else
            {
                Logger.LogError($"GetPhaseAsync response status code {response.StatusCode}");
                return null;
            }

        }

        private void CheckValues(Risk item)
        {
            var t1 = GetProjectAsync(item.ProjectId);
            var t2 = GetEmployeeAsync(item.OwnerId);
            var t3 = GetPhaseAsync(item.PhaseId);
            var tasks = new List<Task>() { t1, t2, t3 };
            var t = Task.WhenAll(tasks);
            t.Wait();
            
            if (t.Status != TaskStatus.RanToCompletion)
            {
                Logger.Log(LogLevel.Information, $"Risk Tasks failed");
                throw new Exception("Tasks failed");
            }
            if (t1.Result is null)
            {
                CheckIfItsSuperManagerOrProjectManager("Post riks", t1.Result.ProjectManager);
                Logger.Log(LogLevel.Information, $"Invalid Risk.ProjectId {item.ProjectId}");
                throw new Exception("Invalid ProjectId");
            }
            if (t2.Result is null)
            {
                Logger.Log(LogLevel.Information, $"Invalid Risk.OwnerId {item.OwnerId}");
                throw new Exception("Invalid OwnerId");
            }
            if ( ! item.PhaseId.IsNullOrEmpty())
            {
                if (t3.Result == null)
                {
                    Logger.Log(LogLevel.Information, $"Invalid Risk.PhaseId {item.PhaseId}");
                    throw new Exception("Invalid PhaseId");
                }
            }
            
        }
    }
}
