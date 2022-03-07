using System;
using Tournament.API.DAL.Database.Factories;
using Tournament.API.DAL.Database.Factories.Interfaces;
using Tournament.API.DAL.Tests.Factories;

namespace Tournament.API.DAL.Tests
{
    public class TournamentDbContextSetupFixture : IDisposable
    {
        public TournamentDbContextSetupFixture(string testDbName)
        {
            DbContextFactory = new InMemoryDbContextFactory(testDbName);
        }

        public IDbContextFactory DbContextFactory { get; }

        public void PrepareDatabase()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            dbContext.Database.EnsureCreated();
        }
        public void TearDownDatabase()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            dbContext.Database.EnsureDeleted();
        }

        public void Dispose()
        {
            TearDownDatabase();
        }
    }
}
