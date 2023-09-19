using Common.Configuration;
using Common.Models;
using Common.RabbitMQ;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RabbitMQ.Client;

namespace ProjectsMicroservice.RabbitMQ
{
    public class ProjectRabbitMQRecieverForEmployees : RabbitMQReciever<Project>
    {
        private readonly IMongoCollection<Participate> _participateCollection;
        private readonly RabbitMQProducer _producer;
        public ProjectRabbitMQRecieverForEmployees(IOptions<RabbitMQConfiguration> rabbitMqOptions, IModel channel, IMongoCollection<Project> projectCollection, IMongoCollection<Participate> participateCollection, RabbitMQProducer producer, ILogger<RabbitMQReciever<Project>> logger) : base(rabbitMqOptions, channel, projectCollection, logger)
        {
            _participateCollection = participateCollection;
            _producer = producer;
        }

        public override void HandleMessage(string employeeId)
        {
            var projects = Collection.Find(GetEmployeeFilterForProject(employeeId)).ToEnumerable();

            foreach (var project in projects)
            {
                _producer.SendMessage(project.Id);
                Collection.DeleteOneAsync(GetProjectById(project.Id));
            }
            
            _participateCollection.DeleteManyAsync(GetEmployeeFilterForParticipate((employeeId)));
        }

        private static FilterDefinition<Project> GetEmployeeFilterForProject(string employeeId) =>
            Builders<Project>.Filter.Eq(p => p.ProjectManager, employeeId);

        private static FilterDefinition<Participate> GetEmployeeFilterForParticipate(string employeeId) =>
            Builders<Participate>.Filter.Eq(p => p.EmployeeId, employeeId);

        private static FilterDefinition<Project> GetProjectById(string id) =>
            Builders<Project>.Filter.Eq(p => p.Id, id);
    }
}
