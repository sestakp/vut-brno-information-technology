using System;
using FestivalAdministration.DAL.Factories;

namespace FestivalAdministration.DAL.Tests
{
    public class FestivalAdministrationDbContextSetupFixture : IDisposable
    {
        public FestivalAdministrationDbContextSetupFixture(string testDbName)
        {
            DbContextFactory = new InMemoryDbContextFactory(testDbName);
        }

        public InMemoryDbContextFactory DbContextFactory { get; }


        public void Dispose()
        {
            TearDownDatabase();
        }

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
    }
}