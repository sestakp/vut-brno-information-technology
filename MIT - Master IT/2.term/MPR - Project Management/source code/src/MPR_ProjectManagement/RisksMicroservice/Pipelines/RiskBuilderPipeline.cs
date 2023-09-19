using Common.Models;
using Common.Pipelines;
using RisksMicroservice.Controllers;
using RisksMicroservice.RabbitMQ;

namespace RisksMicroservice.Pipelines
{
    public class RiskBuilderPipeline : BuilderPipeline<Risk>
    {
        public override WebApplicationBuilder Build(string[] args)
        {
            var builder =  base.Build(args);
            builder.Services.AddScoped<RiskController>();
            builder.Services.AddSingleton<RiskRabbitMQRecieverForProjects>();
            builder.Services.AddSingleton<RiskRabbitMQRecieverForProjectPhases>();
            return builder;
        }
    }
}
