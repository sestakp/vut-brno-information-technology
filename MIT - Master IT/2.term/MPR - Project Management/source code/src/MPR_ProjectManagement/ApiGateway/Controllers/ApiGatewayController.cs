using ApiGateway.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ApiGateway.Controllers
{
    public class ApiGatewayController
    {

        private readonly MicroserviceConfiguration _config;
        private readonly HttpClient _httpClient;
        public ApiGatewayController(IOptions<MicroserviceConfiguration> config, HttpClient httpClient)
        {
            _httpClient = httpClient;
            _config = config.Value;
        }

        public async Task MapRequest(HttpContext context, HttpMethod method)
        {
            var path = context.Request.RouteValues["path"]?.ToString();
            // determine which microservice to route to based on the path
            string microserviceUrl;
            if (path == null)
            {
                context.Response.StatusCode = 404;
                return;
            }
            else if (path.StartsWith("projects"))
            {
                microserviceUrl = _config.Projects;
            }
            else if (path.StartsWith("employees"))
            {
                microserviceUrl = _config.Employees;
            }
            else if (path.StartsWith("risks"))
            {
                microserviceUrl = _config.Risks;
            }
            else if (path.StartsWith("riskTemplates"))
            {
                microserviceUrl = _config.RiskTemplates;
            }
            else if (path.StartsWith("opportunities"))
            {
                microserviceUrl = _config.Opportunities;
            }
            else if (path.StartsWith("phases"))
            {
                microserviceUrl = _config.Phases;
            }
            else
            {
                context.Response.StatusCode = 404;
                return;
            }

            // create a new HTTP request to the microservice


            var request = new HttpRequestMessage(method, $"{microserviceUrl}/{path}");
            
            // copy headers from the original request to the new request
            foreach (var header in context.Request.Headers)
            {
                request.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }

            // send the request to the microservice and copy the response back to the original response
            using var response = await _httpClient.SendAsync(request);
            foreach (var header in response.Headers)
            {
                context.Response.Headers.TryAdd(header.Key, header.Value.ToArray());
            }

            context.Response.ContentType = response.Content.Headers.ContentType?.ToString() ?? "";
            context.Response.StatusCode = (int)response.StatusCode;
            string content = await response.Content.ReadAsStringAsync();

            Console.Write($"Content returned from microservice is {content}");

            await response.Content.CopyToAsync(context.Response.Body);

        }
        

    }
}

