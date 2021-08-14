using Microsoft.EntityFrameworkCore;

namespace FestivalAdministration.DAL.Factories
{
    public class InMemoryDbContextFactory : IDbContextFactory
    {
        private readonly string _testDbName;

        public InMemoryDbContextFactory(string testDbName)
        {
            _testDbName = testDbName;
        }

        public FestivalAdministrationDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<FestivalAdministrationDbContext>();
            optionsBuilder.UseInMemoryDatabase(_testDbName);

            return new FestivalAdministrationDbContext(optionsBuilder.Options);
        }
    }
}