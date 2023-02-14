using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Messages;
using FestivalAdministration.BL.Models;
using FestivalAdministration.Commands;
using FestivalAdministration.Extensions;
using FestivalAdministration.Interfaces.ListViewModels;
using FestivalAdministration.Services;
using System.Collections.ObjectModel;
using System.Windows.Input;

namespace FestivalAdministration.ViewModels.ListViewModels
{
    public class BandListViewModel : ViewModelBase, IBandListViewModel
    {
        private readonly IBandFacade _bandFacade;
        private readonly IMediator _mediator;


        public BandListViewModel(IMediator mediator, IBandFacade bandFacade)
        {
            _mediator = mediator;
            _bandFacade = bandFacade;
            BandNew = new RelayCommand(BandNewExecute);
            BandSelected = new RelayCommand<BandListModel>(BandSelectedExecute);
            mediator.Register<UpdateMessage<BandDetailModel>>(BandUpdateOrDeleteExecute);
            mediator.Register<DeleteMessage<BandDetailModel>>(BandUpdateOrDeleteExecute);
            Bands.AddRange(_bandFacade.GetAll());
        }

        public ObservableCollection<BandListModel> Bands { get; set; } = new();

        public ICommand BandSelected { get; }
        public ICommand BandNew { get; }


        public override void Load()
        {
            Bands.Clear();
            var bands = _bandFacade.GetAll();
            Bands.AddRange(bands);
        }

        private void BandNewExecute()
        {
            _mediator.Send(new NewMessage<BandDetailModel>());
        }

        private void BandSelectedExecute(BandListModel band)
        {
            _mediator.Send(new SelectedMessage<BandDetailModel> { Id = band.Id });
        }

        private void BandUpdateOrDeleteExecute(IMessage _)
        {
            Load();
        }
    }
}