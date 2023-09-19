using System.IdentityModel.Tokens.Jwt;
using Common.Models;
using Common.Pipelines;
using EmployeesMicroservice.Controllers;
using EmployeesMicroservice.Facades;
using MongoDB.Driver;
using sib_api_v3_sdk.Client;

namespace EmployeesMicroservice.Pipelines
{
    public class EmployeesBuilderPipeline : BuilderPipeline<Employee>
    {

        public override WebApplicationBuilder Build(string[] args)
        {
            var builder = base.Build(args);

            Configuration.Default.ApiKey.Add("api-key", "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");
            builder.Services.AddSingleton<EmailFacade>();
            builder.Services.AddSingleton<PasswordGenerationFacade>();
            builder.Services.AddSingleton<JwtSecurityTokenHandler>();
            builder.Services.AddSingleton<JwtTokenFacade>();
            builder.Services.AddScoped<EmployeeController>();
            builder.Services.AddScoped(sp =>
            {
                var db = sp.GetRequiredService<IMongoDatabase>();
                var collection = db.GetCollection<UserLoggingAtemptModel>("UserLoggingAtempt");
                var createdAtIndex = new IndexKeysDefinitionBuilder<UserLoggingAtemptModel>().Ascending(x => x.CreatedAt);
                var indexOptions = new CreateIndexOptions { ExpireAfter = TimeSpan.FromHours(1) };
                collection.Indexes.CreateOne(new CreateIndexModel<UserLoggingAtemptModel>(createdAtIndex, indexOptions));
                return collection;
            });
            return builder;
        }





    }
}
