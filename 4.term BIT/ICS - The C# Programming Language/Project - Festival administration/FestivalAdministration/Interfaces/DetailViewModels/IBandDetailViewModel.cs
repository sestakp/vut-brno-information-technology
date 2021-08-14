using FestivalAdministration.BL.Models;
using System.Windows.Input;

namespace FestivalAdministration.Interfaces.DetailViewModels
{
    public interface IBandDetailViewModel : IDetailViewModel<BandDetailModel>
    {
        ICommand DeleteCommand { get; }
        ICommand UpdateCommand { get; }
        ICommand UploadImage { get; }
    }
}