using Common.Pipelines;
using Common.RabbitMQ;
using ProjectsMicroservice.RabbitMQ;

namespace ProjectsMicroservice.Pipelines
{
    public class ProjectsAppPipeline : AppPipeline
    {
        public override WebApplication Build(WebApplicationBuilder builder)
        {
            var app = base.Build(builder);
            app.Services.GetRequiredService<ProjectRabbitMQRecieverForEmployees>().ReceiveFromExchange(RabbitMQNames.EmployeeExchange);
            return app;
        }
    }
}
