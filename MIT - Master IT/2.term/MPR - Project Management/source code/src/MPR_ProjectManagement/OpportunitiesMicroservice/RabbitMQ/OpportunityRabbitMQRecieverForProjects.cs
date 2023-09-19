using Common.Configuration;
using Common.Models;
using Common.RabbitMQ;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RabbitMQ.Client;

namespace OpportunitiesMicroservice.RabbitMQ
{
    public class OpportunityRabbitMQRecieverForProjects : RabbitMQReciever<Opportunity>
    {
        public OpportunityRabbitMQRecieverForProjects(IOptions<RabbitMQConfiguration> rabbitMqOptions, IModel channel, IMongoCollection<Opportunity> opportunityCollection, ILogger<RabbitMQReciever<Opportunity>> logger) : base(rabbitMqOptions, channel, opportunityCollection, logger)
        {
        }

        public override void HandleMessage(string projectId)
        {
            Collection.DeleteMany(GetProjectFilter(projectId));
        }

        private static FilterDefinition<Opportunity> GetProjectFilter(string projectId) =>
            Builders<Opportunity>.Filter.Eq(r => r.ProjectId, projectId);
    }
}
