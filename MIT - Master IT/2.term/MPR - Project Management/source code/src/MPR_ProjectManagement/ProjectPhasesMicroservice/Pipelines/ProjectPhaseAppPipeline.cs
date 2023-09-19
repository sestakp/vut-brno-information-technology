using Common.Pipelines;
using Common.RabbitMQ;
using ProjectPhasesMicroservice.RabbitMQ;

namespace ProjectPhasesMicroservice.Pipelines
{
    public class ProjectPhaseAppPipeline : AppPipeline
    {
        public override WebApplication Build(WebApplicationBuilder builder)
        {
            var app =  base.Build(builder);

            app.Services.GetRequiredService<ProjectPhaseRabbitMQRecieverForProjects>().ReceiveFromExchange(RabbitMQNames.ProjectExchange);
            return app;
        }
    }
}
