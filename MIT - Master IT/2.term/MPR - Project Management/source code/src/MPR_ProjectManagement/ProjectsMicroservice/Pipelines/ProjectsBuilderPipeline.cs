using Common.Models;
using Common.Pipelines;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using ProjectsMicroservice.Controllers;
using ProjectsMicroservice.RabbitMQ;
using System.IdentityModel.Tokens.Jwt;

namespace ProjectsMicroservice.Pipelines
{
    public class ProjectsBuilderPipeline : BuilderPipeline<Project>
    {
        public override WebApplicationBuilder Build(string[] args)
        {
            var builder = base.Build(args);

            builder.Services.AddScoped(sp =>
            {
                var db = sp.GetRequiredService<IMongoDatabase>();
                return db.GetCollection<Participate>("Participate");
            });

            builder.Services.AddSingleton<ProjectRabbitMQRecieverForEmployees>();
            builder.Services.AddScoped<ProjectController>();

            return builder;
        }
    }
}
