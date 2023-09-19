using Microsoft.AspNetCore.Builder;
using Prometheus;

namespace Common.Pipelines
{
    public class AppPipeline
    {
        public virtual WebApplication Build(WebApplicationBuilder builder)
        {
            var app = builder.Build();
            // Configure the HTTP request pipeline.
#if !DEBUG
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
#endif  
            app.UseCors("AllowSpecificOrigins");
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseHttpMetrics();
            app.MapHealthChecks("/health");
#if DEBUG
            app.UseSwagger();
            app.UseSwaggerUI();
#endif
            app.UseAuthorization();
            app.UseMetricServer();
            return app;
        }
    }
}
