using Microsoft.EntityFrameworkCore;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Database.Factories.Interfaces;

namespace Tournament.API.DAL.Tests.Factories
{
    public class InMemoryDbContextFactory : IDbContextFactory
    {
        private readonly string _testDbName;

        public InMemoryDbContextFactory(string testDbName)
        {
            _testDbName = testDbName;
        }
        public TournamentDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<TournamentDbContext>();
            optionsBuilder.UseInMemoryDatabase(_testDbName);

            return new TournamentDbContext(optionsBuilder.Options);
        }
    }
}
