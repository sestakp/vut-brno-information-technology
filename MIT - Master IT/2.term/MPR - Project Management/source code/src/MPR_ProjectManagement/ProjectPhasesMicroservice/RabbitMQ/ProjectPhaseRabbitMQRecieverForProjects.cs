using Common.Configuration;
using Common.Models;
using Common.RabbitMQ;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RabbitMQ.Client;

namespace ProjectPhasesMicroservice.RabbitMQ
{
    public class ProjectPhaseRabbitMQRecieverForProjects : RabbitMQReciever<ProjectPhase>
    {
        public ProjectPhaseRabbitMQRecieverForProjects(IOptions<RabbitMQConfiguration> rabbitMqOptions, IModel channel, IMongoCollection<ProjectPhase> projectPhaseCollection, ILogger<RabbitMQReciever<ProjectPhase>> logger) : base(rabbitMqOptions, channel, projectPhaseCollection, logger)
        {
        }

        public override void HandleMessage(string projectId)
        {
            Collection.DeleteMany(GetProjectFilter(projectId));
        }

        private static FilterDefinition<ProjectPhase> GetProjectFilter(string projectId) =>
            Builders<ProjectPhase>.Filter.Eq(r => r.ProjectId, projectId);
    }
}
