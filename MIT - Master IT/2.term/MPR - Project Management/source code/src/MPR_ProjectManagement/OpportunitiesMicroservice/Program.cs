using Amazon.Auth.AccessControlPolicy;
using Common.Models;
using Common.Pipelines;
using Common.RabbitMQ;
using Microsoft.AspNetCore.Authorization;
using OpportunitiesMicroservice.Controllers;
using OpportunitiesMicroservice.Pipelines;
using OpportunitiesMicroservice.RabbitMQ;

var builder = new OpportunitiesBuilderPipeline().Build(args);

var app = new OpportunitiesAppPipeline().Build(builder);


// Set up API
app.MapGet("/opportunities", [Authorize(Policy = "JwtAuthorizationPolicy")] (OpportunityController controller) => controller.Get());
app.MapGet("/opportunities/getByProjectId/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, OpportunityController controller) => controller.GetOpportunitiesByProjectId(id));
app.MapGet("/opportunities/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, OpportunityController controller) => controller.Get(id));
app.MapPost("/opportunities", [Authorize(Policy = "JwtAuthorizationPolicy")] (Opportunity opportunity, OpportunityController controller) => controller.Post(opportunity));
app.MapPut("/opportunities", [Authorize(Policy = "JwtAuthorizationPolicy")] (Opportunity opportunity, OpportunityController controller) => controller.Put(opportunity));
app.MapDelete("/opportunities/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, OpportunityController controller) => controller.Delete(id));

app.Run();
