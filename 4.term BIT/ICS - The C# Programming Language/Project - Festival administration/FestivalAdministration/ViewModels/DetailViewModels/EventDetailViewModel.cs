using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Messages;
using FestivalAdministration.BL.Models;
using FestivalAdministration.Commands;
using FestivalAdministration.Extensions;
using FestivalAdministration.Interfaces.DetailViewModels;
using FestivalAdministration.Services;
using FestivalAdministration.Services.MessageDialog;
using Mapster;

namespace FestivalAdministration.ViewModels.DetailViewModels
{
    internal class EventDetailViewModel : ViewModelBase, IEventDetailViewModel
    {
        private readonly IBandFacade _bandFacade;
        private readonly IEventFacade _eventFacade;
        private readonly IMediator _mediator;
        private readonly IStageFacade _stageFacade;
        private readonly IMessageDialogService _messageDialogService;

        public EventDetailViewModel(
            IEventFacade eventFacade,
            IMediator mediator,
            IBandFacade bandFacade,
            IStageFacade stageFacade,
            IMessageDialogService messageDialogService)
        {
            _eventFacade = eventFacade;
            _mediator = mediator;
            _bandFacade = bandFacade;
            _stageFacade = stageFacade;
            _messageDialogService = messageDialogService;

            UpdateCommand = new RelayCommand(UpdateEventExecute, CanUpdateEvent);
            DeleteCommand = new RelayCommand(DeleteEventExecute, CanDeleteBand);

            Bands.AddRange(_bandFacade.GetAll());
            Stages.AddRange(_stageFacade.GetAll());
        }


        public ObservableCollection<BandListModel> Bands { get; set; } = new();
        public ObservableCollection<StageListModel> Stages { get; set; } = new();

        public ICommand DeleteCommand { get; }
        public ICommand UpdateCommand { get; }
        public EventDetailModel Model { get; set; }

        public int StageComboBoxIndex { get; set; }
        public int BandComboBoxIndex { get; set; }

        public string ListItemDisplay 
        {
            get
            {
                if (Model?.Band?.Name != null && Model?.Stage?.Name != null)
                {
                    return string.Format(Model?.Band?.Name + ",\n" + Model?.Stage?.Name);
                }
                else
                {
                    return "*";
                }
            }
        }

        public void Load(Guid id)
        {
            Model = _eventFacade.GetById(id) ?? new EventDetailModel();

            (Model.Stage, StageComboBoxIndex) = _stageFacade.GetByIdWithIndex(Model.StageId);
            (Model.Band, BandComboBoxIndex) = _bandFacade.GetByIdWithIndex(Model.BandId);
        }

        private bool CanDeleteBand()
        {
            return Model?.Id != Guid.Empty;
        }
        
        private void DeleteEventExecute()
        {
            var delete = _messageDialogService.Show(
                $"Delete",
                $"Do you want to delete this event?.",
                MessageDialogButtonConfiguration.YesNo,
                MessageDialogResult.No);

            if (delete == MessageDialogResult.No) return;

            try
            {
                _eventFacade.Delete(Model);
            }
            catch
            {
                var _ = _messageDialogService.Show(
                    $"Deleting of event failed!",
                    "Deleting failed",
                    MessageDialogButtonConfiguration.OK,
                    MessageDialogResult.OK);
                return;
            }
            _mediator.Send(new DeleteMessage<EventDetailModel>());
        }

        private bool CanUpdateEvent()
        {

            return Model.Band != null &&
                   Model.Stage != null &&
                   Model.Band.Id != Guid.Empty &&
                   Model.Stage.Id != Guid.Empty;
        }
        private void UpdateEventExecute()
        {
            var backupStage = Model.Stage;
            var backupBand = Model.Band;

            Model.BandId = Model.Band.Id;
            Model.StageId = Model.Stage.Id;
            Model.Stage = null;
            Model.Band = null;
            var guid  = _eventFacade.Update(Model);

            if (guid == Guid.Empty)
            {
                var _ = _messageDialogService.Show(
                    $"Saving of event failed!",
                    "Probably intervals of current stage or band is overlapping.",
                    MessageDialogButtonConfiguration.OK,
                    MessageDialogResult.OK);

                Model.Stage = backupStage;
                Model.Band = backupBand;
                return;
            }
            _mediator.Send(new UpdateMessage<EventDetailModel>());
        }
    }
}