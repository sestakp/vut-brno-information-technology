using Common.Pipelines;
using Common.RabbitMQ;
using RisksMicroservice.RabbitMQ;

namespace RisksMicroservice.Pipelines
{
    public class RiskAppPipeline : AppPipeline
    {
        public override WebApplication Build(WebApplicationBuilder builder)
        {
            var app =  base.Build(builder);
            app.Services.GetRequiredService<RiskRabbitMQRecieverForProjects>()
                .ReceiveFromExchange(RabbitMQNames.ProjectExchange, "_projects");
            app.Services.GetRequiredService<RiskRabbitMQRecieverForProjectPhases>()
                .ReceiveFromExchange(RabbitMQNames.ProjectPhaseExchange, "_project_phases");
            return app;
        }
    }
}
