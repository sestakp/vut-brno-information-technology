using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.Messages;
using FestivalAdministration.BL.Models;
using FestivalAdministration.Commands;
using FestivalAdministration.Interfaces;
using FestivalAdministration.Interfaces.DetailViewModels;
using FestivalAdministration.Interfaces.ListViewModels;
using FestivalAdministration.Services;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Input;

namespace FestivalAdministration.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        //Bands
        private readonly IFactory<IBandDetailViewModel> _bandDetailViewModelFactory;

        //Events
        private readonly IFactory<IEventDetailViewModel> _eventDetailViewModelFactory;

        //Stages
        private readonly IFactory<IStageDetailViewModel> _stageDetailViewModelFactory;

        private readonly IMediator _mediator;

        public MainViewModel(IMediator mediator,
            IBandListViewModel bandListViewModel,
            IFactory<IBandDetailViewModel> bandDetailViewModelFactory,
            IStageListViewModel stageListViewModel,
            IFactory<IStageDetailViewModel> stageDetailViewModelFactory,
            IEventListViewModel eventListViewModel,
            IFactory<IEventDetailViewModel> eventDetailViewModelFactory,
            IProgramViewModel programViewModel)
        {
            _mediator = mediator;
            BandListViewModel = bandListViewModel;
            _bandDetailViewModelFactory = bandDetailViewModelFactory;
            BandDetailViewModel = _bandDetailViewModelFactory.Create();
            CloseBandDetailTabCommand = new RelayCommand(CloseBandDetailTabCommandExecute);

            mediator.Register<BL.Messages.NewMessage<BandDetailModel>>(OnBandNewMessage);
            mediator.Register<DeleteMessage<BandDetailModel>>(UnselectBand);
            mediator.Register<BL.Messages.UpdateMessage<BandDetailModel>>(UnselectBand);
            mediator.Register<BL.Messages.SelectedMessage<BandDetailModel>>(SelectBand_msg);


            _stageDetailViewModelFactory = stageDetailViewModelFactory;
            StageListViewModel = stageListViewModel;
            StageDetailViewModel = _stageDetailViewModelFactory.Create();
            CloseStageDetailTabCommand = new RelayCommand(CloseStageDetailTabCommandExecute);

            mediator.Register<BL.Messages.NewMessage<StageDetailModel>>(OnStageNewMessage);
            mediator.Register<DeleteMessage<StageDetailModel>>(UnselectStage);
            mediator.Register<BL.Messages.UpdateMessage<StageDetailModel>>(UnselectStage);
            mediator.Register<BL.Messages.SelectedMessage<StageDetailModel>>(SelectStage_msg);


            _eventDetailViewModelFactory = eventDetailViewModelFactory;
            ProgramViewModel = programViewModel;
            EventListViewModel = eventListViewModel;
            EventDetailViewModel = _eventDetailViewModelFactory.Create();
            CloseEventDetailTabCommand = new RelayCommand(CloseEventDetailTabCommandExecute);

            mediator.Register<BL.Messages.NewMessage<EventDetailModel>>(OnEventNewMessage);
            mediator.Register<DeleteMessage<EventDetailModel>>(UnselectEvent);
            mediator.Register<BL.Messages.UpdateMessage<EventDetailModel>>(UnselectEvent);
            mediator.Register<BL.Messages.SelectedMessage<EventDetailModel>>(SelectEvent_msg);


            CloseApp = new RelayCommand(CloseAppExecute);
            MinimizeApp = new RelayCommand(MinimizeAppExecute);
            ResizeApp = new RelayCommand(ResizeAppExecute);
            DragMove = new RelayCommand(DragMoveExecute);
        }

        public ICommand CloseApp { get; }
        public ICommand MinimizeApp { get; }
        public ICommand ResizeApp { get; }
        public ICommand DragMove { get; }
        public ICommand CloseBandDetailTabCommand { get; }

        public ICommand ProgramTab { get; }

        public IProgramViewModel ProgramViewModel { get; }
        public IBandListViewModel BandListViewModel { get; }
        public IBandDetailViewModel BandDetailViewModel { get; }
        public IBandDetailViewModel SelectedBandDetailViewModel { get; set; }
        public ObservableCollection<IBandDetailViewModel> BandDetailViewModels { get; set; } = new();
        public ICommand CloseStageDetailTabCommand { get; }
        public IStageListViewModel StageListViewModel { get; }
        public IStageDetailViewModel StageDetailViewModel { get; }
        public IStageDetailViewModel SelectedStageDetailViewModel { get; set; }
        public ObservableCollection<IStageDetailViewModel> StageDetailViewModels { get; set; } = new();
        public ICommand CloseEventDetailTabCommand { get; }
        public IEventListViewModel EventListViewModel { get; }
        public IEventDetailViewModel EventDetailViewModel { get; }
        public IEventDetailViewModel SelectedEventDetailViewModel { get; set; }
        public ObservableCollection<IEventDetailViewModel> EventDetailViewModels { get; set; } = new();


        private void ProgramTabExecute()
        {

        }
        private void SelectBand_msg(BL.Messages.SelectedMessage<BandDetailModel> obj)
        {
            SelectBand(obj.Id);
        }

        private void UnselectBand(IMessage obj)
        {
            CloseBandDetailTabCommandExecute();
        }

        private void OnBandNewMessage(BL.Messages.NewMessage<BandDetailModel> _)
        {
            SelectBand(Guid.Empty);
        }

        private void SelectBand(Guid id)
        {
            if (BandDetailViewModels.Any(v => v.Model.Id == id))
                SelectedBandDetailViewModel = BandDetailViewModels.FirstOrDefault(v => v.Model.Id == id);
            else
            {
                var bandDetailViewModel = BandDetailViewModels.SingleOrDefault(vm => vm.Model.Id == id);
                if (bandDetailViewModel == null)
                {
                    bandDetailViewModel = _bandDetailViewModelFactory.Create();
                    BandDetailViewModels.Add(bandDetailViewModel);
                    bandDetailViewModel.Load(id);
                }
                SelectedBandDetailViewModel = bandDetailViewModel;
            }
        }

        private void CloseBandDetailTabCommandExecute()
        {
            BandDetailViewModels.Remove(SelectedBandDetailViewModel);
            SelectedBandDetailViewModel = BandDetailViewModels.FirstOrDefault();
        }


        private void SelectStage_msg(BL.Messages.SelectedMessage<StageDetailModel> obj)
        {
            SelectStage(obj.Id);
        }

        private void UnselectStage(IMessage obj)
        {
            CloseStageDetailTabCommandExecute();
        }

        private void OnStageNewMessage(BL.Messages.NewMessage<StageDetailModel> _)
        {
            SelectStage(Guid.Empty);
        }

        private void SelectStage(Guid id)
        {
            if (StageDetailViewModels.Any(v => v.Model.Id == id))
                SelectedStageDetailViewModel = StageDetailViewModels.FirstOrDefault(v => v.Model.Id == id);
            else
            {
                var detailViewModel = StageDetailViewModels.SingleOrDefault(vm => vm.Model.Id == id);
                if (detailViewModel == null)
                {
                    detailViewModel = _stageDetailViewModelFactory.Create();
                    StageDetailViewModels.Add(detailViewModel);
                    detailViewModel.Load(id);
                }
                SelectedStageDetailViewModel = detailViewModel;
            }
        }

        private void CloseStageDetailTabCommandExecute()
        {
            StageDetailViewModels.Remove(SelectedStageDetailViewModel);
            SelectedStageDetailViewModel = StageDetailViewModels.FirstOrDefault();
        }

        private void SelectEvent_msg(BL.Messages.SelectedMessage<EventDetailModel> obj)
        {
            SelectEvent(obj.Id);
        }

        private void UnselectEvent(IMessage obj)
        {
            CloseEventDetailTabCommandExecute();
        }

        private void OnEventNewMessage(BL.Messages.NewMessage<EventDetailModel> _)
        {
            SelectEvent(Guid.Empty);
        }

        private void SelectEvent(Guid id)
        {
            if (EventDetailViewModels.Any(v => v.Model.Id == id))
                SelectedEventDetailViewModel = EventDetailViewModels.FirstOrDefault(v => v.Model.Id == id);
            else
            {
                var detailViewModel = EventDetailViewModels.SingleOrDefault(vm => vm.Model.Id == id);
                if (detailViewModel == null)
                {
                    detailViewModel = _eventDetailViewModelFactory.Create();
                    EventDetailViewModels.Add(detailViewModel);
                    detailViewModel.Load(id);
                }
                SelectedEventDetailViewModel = detailViewModel;
            }
        }

        private void CloseEventDetailTabCommandExecute()
        {
            EventDetailViewModels.Remove(SelectedEventDetailViewModel);
            SelectedEventDetailViewModel = EventDetailViewModels.FirstOrDefault();
        }


        private void DragMoveExecute(object param)
        {
            try
            {
                (param as Window)?.DragMove();
            }
            catch
            {
                //Hack but its works :-)
                //Remove exception when is clicked by right click
            }
        }

        private void ResizeAppExecute(object param)
        {
            if (param is Window windowParam)
                windowParam.WindowState = windowParam.WindowState == WindowState.Maximized
                    ? WindowState.Normal
                    : WindowState.Maximized;
        }

        private void CloseAppExecute()
        {
            Application.Current.Shutdown();
        }

        private void MinimizeAppExecute(object param)
        {
            if (param is Window windowParam) windowParam.WindowState = WindowState.Minimized;
        }
    }
}