using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Tournament.API.App.Controllers;
using Tournament.API.App.Extensions;
using Tournament.API.BL.Installers;
using Tournament.API.DAL.Installers;

namespace Tournament.API.App.EndToEndTests
{
    public class TournamentApiApplicationFactory : WebApplicationFactory<Program>
    {
      

        protected override IHost CreateHost(IHostBuilder builder)
        {

            builder.ConfigureServices(collection =>
            {
                var controllerAssemblyName = typeof(TeamController).Assembly.FullName;
                collection.AddMvc().AddApplicationPart(Assembly.Load(controllerAssemblyName));
            });
            return base.CreateHost(builder);
        }
    }
}
