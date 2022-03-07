using System.Configuration;
using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

using Microsoft.IdentityModel.Protocols;
using Tournament.API.App.Extensions;
using Tournament.API.BL.Installers;
using Tournament.API.DAL.Installers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(options =>
        options
            .WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});


builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Tournament.API.App", Version = "v1" });
});


string constring = builder.Configuration.GetConnectionString("AzureDatabase");

if (string.IsNullOrEmpty(constring))
{
    constring = builder.Configuration["AzureDatabase"];
}


builder.Services.AddDalInstaller<DalInstaller>(constring);
builder.Services.AddInstaller<BlInstaller>();

builder.Services.AddAutoMapper(typeof(DalInstaller), typeof(BlInstaller));


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("v1/swagger.json", "Tournament.API.App v1"));
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
        ctx.Context.Response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, multipart/form-data, text/plain");
    }
});


app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}