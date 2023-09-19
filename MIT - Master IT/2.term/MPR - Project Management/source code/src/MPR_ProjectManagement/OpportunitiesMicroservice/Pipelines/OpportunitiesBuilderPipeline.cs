using Common.Models;
using Common.Pipelines;
using OpportunitiesMicroservice.Controllers;
using OpportunitiesMicroservice.RabbitMQ;

namespace OpportunitiesMicroservice.Pipelines
{
    public class OpportunitiesBuilderPipeline : BuilderPipeline<Opportunity>
    {
        public override WebApplicationBuilder Build(string[] args)
        {
            var builder =  base.Build(args);

            builder.Services.AddScoped<OpportunityController>();
            builder.Services.AddSingleton<OpportunityRabbitMQRecieverForProjects>();

            return builder;
        }
    }
}
