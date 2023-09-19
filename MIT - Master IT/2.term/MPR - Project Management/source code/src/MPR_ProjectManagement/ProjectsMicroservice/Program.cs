using Amazon.Auth.AccessControlPolicy;
using Common.Configuration;
using Common.Models;
using Common.Pipelines;
using Common.RabbitMQ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProjectsMicroservice.Controllers;
using ProjectsMicroservice.Pipelines;
using ProjectsMicroservice.RabbitMQ;

var builder = new ProjectsBuilderPipeline().Build(args);

var app = new ProjectsAppPipeline().Build(builder);

// Set up API
app.MapGet("/projects", [Authorize(Policy = "JwtAuthorizationPolicy")] (ProjectController controller) => controller.Get());
app.MapGet("/projects/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectController controller) => controller.Get(id));
app.MapGet("/projects/GetByProjectManager/{projectManagerId}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string projectManagerId, ProjectController controller) => controller.GetByProjectManager(projectManagerId));
app.MapPost("/projects", [Authorize(Policy = "JwtAuthorizationPolicy")] (Project project, ProjectController controller) => controller.Post(project));
app.MapPut("/projects", [Authorize(Policy = "JwtAuthorizationPolicy")] (Project project, ProjectController controller) => controller.Put(project));
app.MapDelete("/projects/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectController controller) => controller.Delete(id));
app.MapPost("/projects/assignEmployee", [Authorize(Policy = "JwtAuthorizationPolicy")] (Participate participate, ProjectController controller) => controller.AssignEmployeeToProject(participate));
app.MapGet("/projects/EmployeeParticipate/{projectId}/{employeeId}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string projectId, string employeeId, ProjectController controller) => controller.EmployeeParticipate(projectId, employeeId));
app.MapDelete("/projects/assignEmployee/{projectId}/{employeeId}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string projectId, string employeeId, ProjectController controller) => controller.DeleteEmployeeFromProject(projectId, employeeId));
app.MapGet("/projects/getParticipants/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, ProjectController controller) => controller.GetProjectParticipants(id));

// Start the application
app.Run();