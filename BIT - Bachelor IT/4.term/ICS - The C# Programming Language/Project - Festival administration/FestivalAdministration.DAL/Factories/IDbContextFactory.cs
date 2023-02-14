namespace FestivalAdministration.DAL.Factories
{
    public interface IDbContextFactory
    {
        FestivalAdministrationDbContext CreateDbContext();
    }
}