using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.Repositories
{
    public class StageRepository : RepositoryBase<StageEntity>, IStageRepository
    {
        public StageRepository(FestivalAdministrationDbContext context) : base(context)
        {
        }
    }
}