using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Tournament.API.DAL.Database.Factories.Interfaces;

namespace Tournament.API.DAL.Database.Factories
{
    public class SqlServerDbContextFactory : IDbContextFactory
    {
        private readonly string _conString;

        public SqlServerDbContextFactory(string conString)
        {
            _conString = conString;
        }


        public TournamentDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<TournamentDbContext>();
            optionsBuilder.UseSqlServer(_conString, options => options.EnableRetryOnFailure());
            optionsBuilder.EnableSensitiveDataLogging();
            return new TournamentDbContext(optionsBuilder.Options);
        }
    }
}
