using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Common.Models;

namespace Common.Requirements
{
    public class JwtAuthorizationRequirement : IAuthorizationRequirement, IAuthorizationHandler
    {
        private readonly ILogger<JwtAuthorizationRequirement> _logger;

        public JwtAuthorizationRequirement(ILogger<JwtAuthorizationRequirement> logger)
        {
            _logger = logger;
        }

        public Task HandleAsync(AuthorizationHandlerContext context)
        {
            var httpContext = (context.Resource as DefaultHttpContext)?.HttpContext;
            if (httpContext == null)
            {
                _logger.LogError("httpContext is null");
                context.Fail();
                return Task.CompletedTask;
            }

            var rawToken = httpContext.Request.Headers["Authorization"];

            if (rawToken.Count < 1)
            {
                _logger.LogWarning("Token not included");
                context.Fail();
                return Task.CompletedTask;
            }

            var rawTokenSplitted = rawToken[0]?.Split(" ");
            if (rawTokenSplitted != null && rawTokenSplitted.Length < 2)
            {
                _logger.LogWarning("Wrong token format");
                context.Fail();
                return Task.CompletedTask;
            }

            var token = rawTokenSplitted?[1];

            if (token == null)
            {
                _logger.LogWarning("Token is null");
            }

            _logger.LogDebug($"Token read on authorization: {token}");

            var requestUri = "http://build-pool:32786/employees/verify";
            var model = new VerifyModel { Token = token };
            var json = JsonSerializer.Serialize(model);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var httpClient = new HttpClient();
            var response = httpClient.PostAsync(requestUri, content).Result;
            _logger.LogDebug($"Authorization Response status code: {response.StatusCode}");

            if (response.IsSuccessStatusCode)
            {
                var verifyResult = response.Content.ReadFromJsonAsync<VerifyResult>().Result;
                if (verifyResult != null && verifyResult.Email != "")
                {
                    _logger.LogDebug($"Authorization read email: {verifyResult.Email}");
                    httpContext.Items["email"] = verifyResult.Email;
                    httpContext.Items["role"] = verifyResult.Role;
                    context.Succeed(this);
                    return Task.CompletedTask;
                }
            }

            httpContext.Items["email"] = "";
            httpContext.Items["role"] = "";
            context.Fail();
            return Task.CompletedTask;
        }
    }
}