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
    public class EventListViewModel : ViewModelBase, IEventListViewModel
    {
        private readonly IEventFacade _eventFacade;
        private readonly IBandFacade _bandFacade;
        private readonly IStageFacade _stageFacade;
        private readonly IMediator _mediator;


        public EventListViewModel(IMediator mediator, IEventFacade eventFacade, IBandFacade bandFacade, IStageFacade stageFacade)
        {
            _mediator = mediator;
            _eventFacade = eventFacade;
            _bandFacade = bandFacade;
            _stageFacade = stageFacade;
            EventNew = new RelayCommand(EventNewExecute);
            EventSelected = new RelayCommand<EventListModel>(EventSelectedExecute);
            mediator.Register<UpdateMessage<EventDetailModel>>(EventUpdateOrDeleteExecute);
            mediator.Register<DeleteMessage<EventDetailModel>>(EventUpdateOrDeleteExecute);
            Events.AddRange(_eventFacade.GetAll());
            Load();
        }

        public ObservableCollection<EventListModel> Events { get; set; } = new();

        public ICommand EventSelected { get; }
        public ICommand EventNew { get; }


        public void Load()
        {
            Events.Clear();
            var events = _eventFacade.GetAll();
            foreach (var evnt in events)
            {
                evnt.BandName = _bandFacade.GetById(evnt.BandId).Name;
                evnt.StageName = _stageFacade.GetById(evnt.StageId).Name;
            }

            Events.AddRange(events);
        }

        private void EventNewExecute()
        {
            _mediator.Send(new NewMessage<EventDetailModel>());
        }

        private void EventSelectedExecute(EventListModel Event)
        {
            _mediator.Send(new SelectedMessage<EventDetailModel> { Id = Event.Id });
        }

        private void EventUpdateOrDeleteExecute(IMessage _)
        {
            Load();
        }
    }
}