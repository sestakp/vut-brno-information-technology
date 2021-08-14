using System.Linq;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Models;
using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.BL.Facades
{
    public class EventFacade : FacadeBase<EventDetailModel, EventListModel, EventEntity>, IEventFacade
    {
        public EventFacade(IUnitOfWork unitOfWork) : base(unitOfWork, unitOfWork.EventRepository)
        {
        }
    }
}