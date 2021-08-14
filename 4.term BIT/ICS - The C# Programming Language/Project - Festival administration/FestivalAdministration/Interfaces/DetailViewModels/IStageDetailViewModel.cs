using FestivalAdministration.BL.Models;
using System.Windows.Input;

namespace FestivalAdministration.Interfaces.DetailViewModels
{
    public interface IStageDetailViewModel : IDetailViewModel<StageDetailModel>
    {
        ICommand UploadImage { get; }
    }
}