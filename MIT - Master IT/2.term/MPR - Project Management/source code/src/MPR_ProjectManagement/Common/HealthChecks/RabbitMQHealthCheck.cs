using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using RabbitMQ.Client;

namespace Common.HealthChecks
{
    internal class RabbitMQHealthCheck : IHealthCheck
    {
        private readonly IConnection _connection;

        public RabbitMQHealthCheck(IConnection connection)
        {
            _connection = connection;
        }


        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            if(_connection.IsOpen){
                return HealthCheckResult.Healthy("RabbitMQ health check success");
            }
            
            return HealthCheckResult.Unhealthy("RabbitMQ health check failure");
            

            
        }
    }
}
