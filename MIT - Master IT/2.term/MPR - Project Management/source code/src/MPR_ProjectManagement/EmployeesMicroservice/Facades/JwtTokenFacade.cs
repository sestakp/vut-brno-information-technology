using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Common.Enums;
using Common.Models;
using EmployeesMicroservice.Models;
using Microsoft.IdentityModel.Tokens;

namespace EmployeesMicroservice.Facades
{
    // https://www.red-gate.com/simple-talk/development/dotnet-development/jwt-authentication-microservices-net/
    public class JwtTokenFacade
    {
        private readonly SymmetricSecurityKey _securityKey;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;
        private readonly ILogger<JwtTokenFacade> _logger;
        public JwtTokenFacade(JwtSecurityTokenHandler jwtSecurityTokenHandler, ILogger<JwtTokenFacade> logger)
        {
            _jwtSecurityTokenHandler = jwtSecurityTokenHandler;
            _logger = logger;
            var key = "XCAP05H6LoKvbRRa/QkqLNMI7cOHguaRyHzyg7n5qEkGjQmtBhz4SzYh4Fqwjyi3KJHlSXKPwVu2+bXr6CtpgQ==";
            _securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
        }

        public VerifyResult ValidateToken(string token)
        {

            _logger.Log(LogLevel.Information, $"Validating token");
            var parameters = new TokenValidationParameters()
            {
                RequireExpirationTime = true,
                ValidateIssuer = false,
                ValidateAudience = false,
                IssuerSigningKey = _securityKey,
                ValidateIssuerSigningKey = true,
            };

            try
            {
                _jwtSecurityTokenHandler.ValidateToken(token, parameters, out SecurityToken _);
            }
            catch
            {
                _logger.Log(LogLevel.Error, "Validation error");
                return null;
            }

            var securityToken = _jwtSecurityTokenHandler.ReadJwtToken(token);

            if (securityToken == null)
            {
                _logger.Log(LogLevel.Error, "Invalid token");
                return null;
            }

            var email = securityToken.Payload.FirstOrDefault(x => x.Key == "email").Value?.ToString();
            var role = securityToken.Payload.FirstOrDefault(x => x.Key == "role").Value?.ToString();


            _logger.Log(LogLevel.Information, $"Email from token is {email}");
            _logger.Log(LogLevel.Information, $"Role from token is {role}");

            if (email == default)
            {
                _logger.Log(LogLevel.Error, "Email claim is missing");
                return null;
            }

            if (role == default)
            {
                _logger.Log(LogLevel.Error, "Role claim is missing");
                return null;
            }

            var verifyResult = new VerifyResult
            {
                Email = email,
                Role = (RoleEnum)Enum.Parse(typeof(RoleEnum), role)
            };

            return verifyResult;
        }

        public string GenerateToken(string email, RoleEnum role)
        {

            _logger.Log(LogLevel.Information, $"Generating token for email: {email}");
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim("email", email),
                    new Claim("role", role.ToString()),

                }),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            JwtSecurityToken token = _jwtSecurityTokenHandler.CreateJwtSecurityToken(descriptor);
            return _jwtSecurityTokenHandler.WriteToken(token);
        }
    }
}
