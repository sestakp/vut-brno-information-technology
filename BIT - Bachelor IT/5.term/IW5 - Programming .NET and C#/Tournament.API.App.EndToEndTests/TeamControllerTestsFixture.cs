using System.Reflection;
using Microsoft.Extensions.Configuration;
using Tournament.API.App.Controllers;
using Tournament.API.BL.Facades.Factories;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Tests;
using Tournament.API.DAL.Database.Factories;
using Tournament.API.DAL.Database.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Factories;
using Tournament.API.DAL.UnitOfWork.Factories;

namespace Tournament.API.App.EndToEndTests
{
    public class TeamControllerTestsFixture : FacadeBaseTestsFixture
    {
        public TeamControllerTestsFixture()
        {
            var controllerAssemblyName = typeof(TeamController).Assembly.FullName;

            var Configuration = new ConfigurationBuilder()
                .AddUserSecrets(Assembly.Load(controllerAssemblyName))
                .Build();

            string constring = Configuration["AzureDatabase"];


            var dbContextFactory = new SqlServerDbContextFactory(constring);
            var repositoryAbstractFactory = new RepositoryAbstractFactory();
            var unitOfWorkFactory = new UnitOfWorkFactory(repositoryAbstractFactory, dbContextFactory);
            FacadeAbstractFactory = new FacadeAbstractFactory(unitOfWorkFactory, Mapper, WebHostEnvironmentMock.Object);
        }

        public new FacadeAbstractFactory FacadeAbstractFactory { get; set; }
        
    }
}
