using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Tournament.API.DAL.Database.Factories
{
    class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TournamentDbContext>
    {
        public TournamentDbContext CreateDbContext(string[] args)
        {   
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<DesignTimeDbContextFactory>(optional: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TournamentDbContext>();

            //optionsBuilder.UseSqlServer(configuration.GetConnectionString("AzureDatabase") ?? configuration["AzureDatabase"]);
            optionsBuilder.UseSqlServer("Data Source=tcp:sqldb-iw5-2021-team0010.database.windows.net,1433;Initial Catalog=db-iw5-2021-team0010;User Id=developer@sqldb-iw5-2021-team0010;Password=JdDtYXuuC&r6_UZ6G$r#4T%yk");
            return new TournamentDbContext(optionsBuilder.Options);
        }
    }
}
