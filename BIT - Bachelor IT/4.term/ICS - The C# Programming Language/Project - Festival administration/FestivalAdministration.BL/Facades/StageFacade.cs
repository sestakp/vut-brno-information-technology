using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Models;
using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.BL.Facades
{
    public class StageFacade : FacadeBase<StageDetailModel, StageListModel, StageEntity>, IStageFacade
    {
        public StageFacade(IUnitOfWork unitOfWork) : base(unitOfWork, unitOfWork.StageRepository)
        {
        }
    }
}