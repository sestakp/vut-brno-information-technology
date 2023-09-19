using Amazon.Auth.AccessControlPolicy;
using Common.Models;
using Microsoft.AspNetCore.Authorization;
using RisksMicroservice.Controllers;
using RisksMicroservice.Pipelines;

var builder = new RiskBuilderPipeline().Build(args);

var app = new RiskAppPipeline().Build(builder);

// Set up API
app.MapGet("/risks", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskController controller) => controller.Get());
app.MapGet("/risks/getByProjectId/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, RiskController controller) => controller.GetRisksByProjectId(id));
app.MapGet("/risks/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, RiskController controller) => controller.Get(id));
app.MapPost("/risks", [Authorize(Policy = "JwtAuthorizationPolicy")] (Risk risk, RiskController controller) => controller.Post(risk));
app.MapPut("/risks", [Authorize(Policy = "JwtAuthorizationPolicy")] (Risk risk, RiskController controller) => controller.Put(risk));
app.MapDelete("/risks/{id}", [Authorize(Policy = "JwtAuthorizationPolicy")] (string id, RiskController controller) => controller.Delete(id));

app.MapGet("/risks/categories", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskController controller) => controller.GetUsedCategories());
app.MapGet("/risks/causes", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskController controller) => controller.GetUsedCauses());
app.MapGet("/risks/vulnerabilities", [Authorize(Policy = "JwtAuthorizationPolicy")] (RiskController controller) => controller.GetUsedVulnerabilities());

app.Run();
