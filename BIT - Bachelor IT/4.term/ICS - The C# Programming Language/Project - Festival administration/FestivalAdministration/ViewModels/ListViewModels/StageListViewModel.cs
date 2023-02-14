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
    public class StageListViewModel : ViewModelBase, IStageListViewModel
    {
        private readonly IMediator _mediator;
        private readonly IStageFacade _stageFacade;


        public StageListViewModel(IMediator mediator, IStageFacade StageFacade)
        {
            _mediator = mediator;
            _stageFacade = StageFacade;
            StageNew = new RelayCommand(StageNewExecute);
            StageSelected = new RelayCommand<StageListModel>(StageSelectedExecute);
            mediator.Register<UpdateMessage<StageDetailModel>>(StageUpdateOrDeleteExecute);
            mediator.Register<DeleteMessage<StageDetailModel>>(StageUpdateOrDeleteExecute);
            Stages.AddRange(_stageFacade.GetAll());
        }

        public ObservableCollection<StageListModel> Stages { get; set; } = new();

        public ICommand StageSelected { get; }
        public ICommand StageNew { get; }


        public override void Load()
        {
            Stages.Clear();
            var stages = _stageFacade.GetAll();
            Stages.AddRange(stages);
        }

        private void StageNewExecute()
        {
            _mediator.Send(new NewMessage<StageDetailModel>());
        }

        private void StageSelectedExecute(StageListModel stage)
        {
            _mediator.Send(new SelectedMessage<StageDetailModel> { Id = stage.Id });
        }

        private void StageUpdateOrDeleteExecute(IMessage _)
        {
            Load();
        }
    }
}