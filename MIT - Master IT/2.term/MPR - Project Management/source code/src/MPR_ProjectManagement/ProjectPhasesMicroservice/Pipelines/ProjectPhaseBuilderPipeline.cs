using Common.Models;
using Common.Pipelines;
using ProjectPhasesMicroservice.Controllers;
using ProjectPhasesMicroservice.RabbitMQ;

namespace ProjectPhasesMicroservice.Pipelines
{
    public class ProjectPhaseBuilderPipeline : BuilderPipeline<ProjectPhase>
    {
        public override WebApplicationBuilder Build(string[] args)
        {
            var builder =  base.Build(args);
            builder.Services.AddScoped<ProjectPhaseController>();
            builder.Services.AddSingleton<ProjectPhaseRabbitMQRecieverForProjects>();
            return builder;
            
        }
    }
}
