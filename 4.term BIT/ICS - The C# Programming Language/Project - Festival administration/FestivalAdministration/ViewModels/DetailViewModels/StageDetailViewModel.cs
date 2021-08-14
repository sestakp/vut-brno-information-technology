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
    internal class StageDetailViewModel : ViewModelBase, IStageDetailViewModel
    {
        private readonly IMediator _mediator;
        private readonly IStageFacade _StageFacade;
        private readonly IMessageDialogService _messageDialogService;

        public StageDetailViewModel(IStageFacade StageFacade, IMediator mediator,
            IMessageDialogService messageDialogService)
        {
            _StageFacade = StageFacade;
            _mediator = mediator;
            _messageDialogService = messageDialogService;

            UpdateCommand = new RelayCommand(UpdateStageExecute, CanUpdateBand);
            DeleteCommand = new RelayCommand(DeleteStageExecute, CanDeleteBand);
            UploadImage = new RelayCommand(UploadImageExecute);
        }

        public ICommand DeleteCommand { get; }
        public ICommand UpdateCommand { get; }
        public ICommand UploadImage { get; }

        public StageDetailModel Model { get; set; }


        public void Load(Guid id)
        {
            Model = _StageFacade.GetById(id) ?? new StageDetailModel();
        }

        private bool CanDeleteBand()
        {
            return Model?.Id != Guid.Empty;
        }

        private void DeleteStageExecute()
        {
            var delete = _messageDialogService.Show(
                $"Delete",
                $"Do you want to delete {Model?.Name}?.",
                MessageDialogButtonConfiguration.YesNo,
                MessageDialogResult.No);

            if (delete == MessageDialogResult.No) return;

            try
            {
                _StageFacade.Delete(Model);
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
            _mediator.Send(new DeleteMessage<StageDetailModel>());
        }

        private bool CanUpdateBand()
        {
            return Model != null
                   && !Model.Name.IsNullOrEmpty();
        }

        private void UpdateStageExecute()
        {
            _StageFacade.Update(Model);
            _mediator.Send(new UpdateMessage<StageDetailModel>());
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