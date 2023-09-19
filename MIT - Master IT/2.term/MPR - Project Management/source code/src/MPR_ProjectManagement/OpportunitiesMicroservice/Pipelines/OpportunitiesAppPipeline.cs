using Common.Pipelines;
using Common.RabbitMQ;
using OpportunitiesMicroservice.RabbitMQ;

namespace OpportunitiesMicroservice.Pipelines
{
    public class OpportunitiesAppPipeline : AppPipeline
    {
        public override WebApplication Build(WebApplicationBuilder builder)
        {
            var app =  base.Build(builder);

            app.Services.GetRequiredService<OpportunityRabbitMQRecieverForProjects>().ReceiveFromExchange(RabbitMQNames.ProjectExchange);
            return app;
        }
    }
}
