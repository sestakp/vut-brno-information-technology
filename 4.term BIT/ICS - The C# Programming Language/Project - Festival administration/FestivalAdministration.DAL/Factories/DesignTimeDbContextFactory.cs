using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FestivalAdministration.DAL.Factories
{
    internal class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<FestivalAdministrationDbContext>
    {
        public FestivalAdministrationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FestivalAdministrationDbContext>();
            optionsBuilder.UseSqlServer(
                "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog = FestivalAdministration;MultipleActiveResultSets = True;Integrated Security = True; ");
            return new FestivalAdministrationDbContext(optionsBuilder.Options);
        }
    }
}