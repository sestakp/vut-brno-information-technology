using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.Messages;
using FestivalAdministration.BL.Models;
using FestivalAdministration.Commands;
using FestivalAdministration.Interfaces.DetailViewModels;
using FestivalAdministration.Services;
using FestivalAdministration.Services.MessageDialog;
using Microsoft.Win32;
using Nemesis.Essentials.Design;
using System;
using System.Windows.Input;

namespace FestivalAdministration.ViewModels.DetailViewModels
{
    internal class BandDetailViewModel : ViewModelBase, IBandDetailViewModel
    {
        private readonly IBandFacade _eventFacade;
        private readonly IMediator _mediator;
        private readonly IMessageDialogService _messageDialogService;

        public BandDetailViewModel(IBandFacade eventFacade, IMediator mediator,
            IMessageDialogService messageDialogService)
        {
            _eventFacade = eventFacade;
            _mediator = mediator;
            _messageDialogService = messageDialogService;

            UpdateCommand = new RelayCommand(UpdateBandExecute, CanUpdateBand);
            DeleteCommand = new RelayCommand(DeleteBandExecute, CanDeleteBand);
            UploadImage = new RelayCommand(UploadImageExecute);
        }

        public ICommand DeleteCommand { get; }
        public ICommand UpdateCommand { get; }
        public ICommand UploadImage { get; }

        public BandDetailModel Model { get; set; }

        public void Load(Guid id)
        {
            Model = _eventFacade.GetById(id) ?? new BandDetailModel();
        }

        private bool CanDeleteBand()
        {
            return Model?.Id != Guid.Empty;
        }

        private void DeleteBandExecute()
        {
            var delete = _messageDialogService.Show(
                $"Delete",
                $"Do you want to delete {Model?.Name}?.",
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
                    $"Deleting of {Model?.Name} failed!",
                    "Deleting failed",
                    MessageDialogButtonConfiguration.OK,
                    MessageDialogResult.OK);
                return;
            }
            _mediator.Send(new DeleteMessage<BandDetailModel>());
        }


        private bool CanUpdateBand()
        {
            return Model != null
                   && !Model.Name.IsNullOrEmpty();
        }

        private void UpdateBandExecute()
        {
            _eventFacade.Update(Model);
            _mediator.Send(new UpdateMessage<BandDetailModel>());
        }

        public void UploadImageExecute()
        {
            var openFileDialog = new OpenFileDialog();

            if (openFileDialog.ShowDialog() == true)
            {
                Model.ImagePath = openFileDialog.FileName;
            }
        }
    }
}