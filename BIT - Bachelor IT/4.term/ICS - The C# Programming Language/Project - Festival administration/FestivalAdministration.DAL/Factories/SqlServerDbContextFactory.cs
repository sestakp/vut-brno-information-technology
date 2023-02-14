using Microsoft.EntityFrameworkCore;

namespace FestivalAdministration.DAL.Factories
{
    public class SqlServerDbContextFactory : IDbContextFactory
    {
        private readonly string _conString;

        public SqlServerDbContextFactory(string conString)
        {
            _conString = conString;
        }

        public FestivalAdministrationDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<FestivalAdministrationDbContext>();
            optionsBuilder.UseSqlServer(_conString);
            return new FestivalAdministrationDbContext(optionsBuilder.Options);
        }
    }
}