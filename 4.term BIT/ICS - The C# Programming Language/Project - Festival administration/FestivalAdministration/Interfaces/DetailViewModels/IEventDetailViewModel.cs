using FestivalAdministration.BL.Models;

namespace FestivalAdministration.Interfaces.DetailViewModels
{
    public interface IEventDetailViewModel : IDetailViewModel<EventDetailModel>
    {
        string ListItemDisplay { get; }
    }
}