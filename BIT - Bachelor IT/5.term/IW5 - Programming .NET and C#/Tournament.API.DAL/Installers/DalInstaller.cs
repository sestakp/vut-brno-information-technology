using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Design;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Database.Factories;
using Tournament.API.DAL.Database.Factories.Interfaces;

namespace Tournament.API.DAL.Installers
{
    public class DalInstaller : IDALInstaller
    {
        public void Install(IServiceCollection serviceCollection, string connectionString)
        {
            serviceCollection.AddDbContext<TournamentDbContext>(
                options => options.UseSqlServer(connectionString));

            serviceCollection.AddScoped<IDbContextFactory>(provider =>
                new SqlServerDbContextFactory(connectionString));



            serviceCollection.Scan(s =>
                s.FromAssemblyOf<DalInstaller>()

                    .AddClasses(classes => classes.AssignableTo(typeof(IFactory)))
                    .AsSelfWithInterfaces()
                    .WithScopedLifetime()


                    .AddClasses(classes => classes.AssignableTo(typeof(IUnitOfWorkFactory)))
                    .AsSelfWithInterfaces()
                    .WithTransientLifetime()


                    .AddClasses(classes => classes.AssignableTo(typeof(IRepository<>)))
                    .AsSelfWithInterfaces()
                    .WithScopedLifetime()

                    .AddClasses(classes => classes.AssignableTo(typeof(IUnitOfWork)))
                .AsSelfWithInterfaces()
                .WithScopedLifetime()

                .AddClasses(classes => classes.AssignableTo(typeof(IRepositoryAbstractFactory)))
                .AsSelfWithInterfaces()
                .WithScopedLifetime()
            );
        }
    }
}
