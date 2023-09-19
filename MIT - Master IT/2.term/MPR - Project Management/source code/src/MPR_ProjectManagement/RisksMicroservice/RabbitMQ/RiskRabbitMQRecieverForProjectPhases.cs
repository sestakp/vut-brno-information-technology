using Common.Configuration;
using Common.Models;
using Common.RabbitMQ;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RabbitMQ.Client;

namespace RisksMicroservice.RabbitMQ
{
    public class RiskRabbitMQRecieverForProjectPhases : RabbitMQReciever<Risk>
    {
        public RiskRabbitMQRecieverForProjectPhases(IOptions<RabbitMQConfiguration> rabbitMqOptions, IModel channel, IMongoCollection<Risk> riskCollection, ILogger<RabbitMQReciever<Risk>> logger) : base(rabbitMqOptions, channel, riskCollection, logger)
        {
        }

        public override void HandleMessage(string phaseId)
        {
            Collection.DeleteMany(GetProjectFilter(phaseId));
        }

        private static FilterDefinition<Risk> GetProjectFilter(string phaseId) =>
            Builders<Risk>.Filter.Eq(r => r.PhaseId, phaseId);
    }
}
