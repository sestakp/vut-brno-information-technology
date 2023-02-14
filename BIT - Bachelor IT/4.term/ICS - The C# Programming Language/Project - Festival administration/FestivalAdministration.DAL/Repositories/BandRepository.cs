using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.Repositories
{
    public class BandRepository : RepositoryBase<BandEntity>, IBandRepository
    {
        public BandRepository(FestivalAdministrationDbContext context) : base(context)
        {
        }
    }
}