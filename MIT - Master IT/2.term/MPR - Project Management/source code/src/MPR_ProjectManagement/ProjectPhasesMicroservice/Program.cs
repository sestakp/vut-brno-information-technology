using Amazon.Auth.AccessControlPolicy;
using Common.Models;
using Common.Pipelines;
using Common.RabbitMQ;
using Microsoft.AspNetCore.Authorization;
using ProjectPhasesMicroservice.Controllers;
using ProjectPhasesMicroservice.Pipelines;
using ProjectPhasesMicroservice.RabbitMQ;

var builder = new ProjectPhaseBuilderPipeline().Build(args);

var app = new ProjectPhaseAppPipeline().Build(builder);


// Set up API
app.MapGet("/phases", [Authorize(Policy = "JwtAuthorizationPolicy")] (ProjectPhaseController controller) => controller.Get());
app.MapGet("/phases/getByProjectId/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectPhaseController controller) => controller.GetPhasesByProjectId(id));
app.MapGet("/phases/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectPhaseController controller) => controller.Get(id));
app.MapPost("/phases", [Authorize(Policy = "JwtAuthorizationPolicy")] (ProjectPhase phase, ProjectPhaseController controller) => controller.Post(phase));
app.MapPut("/phases", [Authorize(Policy = "JwtAuthorizationPolicy")] (ProjectPhase phase, ProjectPhaseController controller) => controller.Put(phase));
app.MapDelete("/phases/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectPhaseController controller) => controller.Delete(id));

app.Run();