using Common.Models;
using EmployeesMicroservice.Models;
using Newtonsoft.Json.Linq;
using sib_api_v3_sdk.Api;
using sib_api_v3_sdk.Client;
using sib_api_v3_sdk.Model;
using System.Diagnostics;
using System.Runtime.InteropServices.JavaScript;

namespace EmployeesMicroservice.Facades
{
    public class EmailFacade
    {
        private readonly ILogger<EmailFacade> _logger;
        public EmailFacade(ILogger<EmailFacade> logger)
        {
            _logger = logger;
        }
        public void SendEmail(RegisterFormModel employee, string password)
        {

            var apiInstance = new TransactionalEmailsApi();
            var smtpEmailTo = new SendSmtpEmailTo(employee.Email, employee.Name);
            var to = new List<SendSmtpEmailTo> { smtpEmailTo };

            var email = new SendSmtpEmail
            {
                To = to,
                TemplateId = 1,
                Params = new Dictionary<string, object> { { "name", employee.Name }, { "password", password }, {"date", DateTime.Now.ToString("dd. MM. yyyy")} },
            };

            apiInstance.SendTransacEmail(email);
            _logger.Log(LogLevel.Information, $"Sending email to: {employee.Email}");
        }
    }
}
