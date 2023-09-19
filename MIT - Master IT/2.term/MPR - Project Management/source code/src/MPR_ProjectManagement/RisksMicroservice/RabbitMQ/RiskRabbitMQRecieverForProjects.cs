using Common.Configuration;
using Common.Models;
using Common.RabbitMQ;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RabbitMQ.Client;

namespace RisksMicroservice.RabbitMQ
{
    public class RiskRabbitMQRecieverForProjects : RabbitMQReciever<Risk>
    {
        public RiskRabbitMQRecieverForProjects(IOptions<RabbitMQConfiguration> rabbitMqOptions, IModel channel,IMongoCollection<Risk> riskCollection, ILogger<RabbitMQReciever<Risk>> logger) : base(rabbitMqOptions, channel, riskCollection, logger)
        {
        }

        public override void HandleMessage(string projectId)
        {
            Collection.DeleteMany(GetProjectFilter(projectId));
        }

        private static FilterDefinition<Risk> GetProjectFilter(string projectId) =>
            Builders<Risk>.Filter.Eq(r => r.ProjectId, projectId);
    }
}
