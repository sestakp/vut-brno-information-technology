using System.Text;
using Common.Extensions;
using Common.HealthChecks;
using Common.Models.Interfaces;
using Common.Requirements;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Prometheus;

namespace Common.Pipelines
{
    public class BuilderPipeline<T> where T : IMongoItem
    {
        public virtual WebApplicationBuilder Build(string[] args) 
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.AddSpecificCors();


            builder.AddSwagger(typeof(T).Name);

            builder.AddDatabaseSettings();

            builder.AddRabbitMQSettings();

            builder.AddConnectionFactoryForRabbit();
            builder.AddRabbitConnection();
            builder.AddRabbitChannel();

            builder.AddMongoClient();
            
            builder.AddMongoDatabase();
            
            builder.AddMongoCollection<T>();

            builder.AddRabbitMQProducer();

            builder.Services.AddHttpClient();
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddAuthorization();

            builder.Services.AddHealthChecks()
                .AddCheck<MongoDbHealthCheck>("MongoDBConnectionCheck")
                .AddCheck<RabbitMQHealthCheck>("RabbitMQConnectionCheck")
                .ForwardToPrometheus();

            builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey("XCAP05H6LoKvbRRa/QkqLNMI7cOHguaRyHzyg7n5qEkGjQmtBhz4SzYh4Fqwjyi3KJHlSXKPwVu2+bXr6CtpgQ=="u8.ToArray())
                    };
                });

            builder.Services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConsole();
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("JwtAuthorizationPolicy", policy =>
                    policy.Requirements.Add(new JwtAuthorizationRequirement(builder.Services.BuildServiceProvider().GetRequiredService<ILogger<JwtAuthorizationRequirement>>())));
            });
            builder.Services.AddSingleton<IAuthorizationHandler, JwtAuthorizationRequirement>();

            return builder;
        }
    }
}
