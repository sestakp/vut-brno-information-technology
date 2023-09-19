using ApiGateway.Controllers;
using ApiGateway.Models;
using Common.Extensions;
using Microsoft.Extensions.Configuration;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);
builder.AddSpecificCors();
builder.AddSwagger("API Gateway");

builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot();

var app = builder.Build();
app.UseCors("AllowSpecificOrigins");
app.UseOcelot().Wait();
#if DEBUG
app.UseSwagger();
app.UseSwaggerUI();
#endif

app.Run();
