using Common.Controllers;
using Common.Models;
using MongoDB.Driver;

namespace RiskTemplatesMicroservice.Controllers
{
    public class RiskTemplateController : Controller<RiskTemplate>
    {
        public RiskTemplateController(IMongoCollection<RiskTemplate> collection, ILogger<Controller<RiskTemplate>> logger, HttpClient client, IHttpContextAccessor contextAccessor) : base(collection, logger, client,contextAccessor)
        {

            CheckIfItsNotAdministrator("Risk template");
        }
    }
}
