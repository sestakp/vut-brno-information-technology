using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Common.HealthChecks
{
    internal class MongoDbHealthCheck : IHealthCheck
    {
        private readonly IMongoDatabase _database;
        public MongoDbHealthCheck(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {

            var healthCheckResultHealthy = await CheckMongoDbConnectionAsync();


            return healthCheckResultHealthy ? 
                HealthCheckResult.Healthy("MongoDB health check success") : 
                HealthCheckResult.Unhealthy("MongoDB health check failure");

            
        }

        private async Task<bool> CheckMongoDbConnectionAsync()
        {
            try
            {
                await _database.RunCommandAsync((Command<BsonDocument>)"{ping:1}");
            }

            catch (Exception)
            {
                return false;
            }

            return true;
        }
    }
}
