using Amazon.Auth.AccessControlPolicy;
using Common.Models;
using Common.Pipelines;
using Microsoft.AspNetCore.Authorization;
using RiskTemplatesMicroservice.Controllers;

var builder = new BuilderPipeline<RiskTemplate>().Build(args);
builder.Services.AddScoped<RiskTemplateController>();

var app = new AppPipeline().Build(builder);


app.MapGet("/riskTemplates", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskTemplateController controller) => controller.Get());
app.MapGet("/riskTemplates/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, RiskTemplateController controller) => controller.Get(id));
app.MapPost("/riskTemplates", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskTemplate riskTemplate, RiskTemplateController controller) => controller.Post(riskTemplate));
app.MapPut("/riskTemplates", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskTemplate riskTemplate, RiskTemplateController controller) => controller.Put(riskTemplate));
app.MapDelete("/riskTemplates/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, RiskTemplateController controller) => controller.Delete(id));

app.Run();