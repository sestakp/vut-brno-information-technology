using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.Controls.Models;
using FestivalAdministration.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FestivalAdministration.Commands;

namespace FestivalAdministration.ViewModels
{
    class ProgramViewModel : ViewModelBase, IProgramViewModel
    {
        public ProgramViewModel(IEventFacade eventFacade, IBandFacade bandFacade, IStageFacade stageFacade)
        {
            _eventFacade = eventFacade;
            _bandFacade = bandFacade;
            _stageFacade = stageFacade;
            Rows = new ObservableCollection<ProgramDataGridModel>();
            Load();
            UpdateTable = new RelayCommand(Load);
        }

        private IEventFacade _eventFacade { get; }
        private IBandFacade _bandFacade { get; }
        private IStageFacade _stageFacade { get; }

        public IList<ProgramDataGridModel> Rows { get; set; }

        public ICommand UpdateTable { get; set; }

        public void Load()
        {
            Rows.Clear();
            var events = GetMinAndMaxDate(out var minDate, out var maxDate);

            if (minDate == null || maxDate == null)
            {
                return;
            }


            int totalDays = (int)Math.Round((maxDate.Value - minDate.Value).TotalDays);

            var ColumnCount = 24;
            var RowCount = totalDays + 1;

            InitializeRowsToDatagrid(RowCount, minDate);

            foreach (var evnt in events)
            {
                AddEventToRows(evnt, minDate, ColumnCount);
            }

        }

        private void AddEventToRows(EventListModel evnt, DateTime? minDate, int ColumnCount)
        {
            if (evnt.Start != null && evnt.End != null)
            {
                var row = (int)Math.Round((evnt.Start.Value - minDate.Value).TotalDays);
                var column = evnt.Start.Value.Hour;
                evnt.BandName = _bandFacade.GetById(evnt.BandId).Name;
                evnt.StageName = _stageFacade.GetById(evnt.StageId).Name;

                var evntLenght = (int)Math.Round((evnt.End.Value - evnt.Start.Value).TotalHours);

                Rows[row].cells[column] = string.Format($"Band: {evnt.BandName}\nStage: {evnt.StageName}");

                for (var i = 1; i < evntLenght; i++)
                {
                    if ((column + i) >= ColumnCount)
                    {
                        row++;
                        column -= ColumnCount;
                    }


                    Rows[row].cells[(column + i) % ColumnCount] = "^^";
                }
            }
        }

        private void InitializeRowsToDatagrid(int RowCount, DateTime? minDate)
        {
            for (var i = 0; i < RowCount; i++)
            {
                var data = new ProgramDataGridModel();
                Rows.Add(data);
            }

            var date = minDate.Value;
            Rows[0].Date = date.ToString("m");
            for (var i = 1; i < RowCount; i++)
            {
                date = date.AddDays(1);
                Rows[i].Date = date.ToString("m");
            }
        }

        private IList<EventListModel> GetMinAndMaxDate(out DateTime? minDate, out DateTime? maxDate)
        {
            var events = _eventFacade.GetAll();

            var starts = events.OrderBy(evnt => evnt.Start).Select(evnt => evnt.Start).ToList();
            var ends = events.OrderBy(evnt => evnt.End).Select(evnt => evnt.End).ToList();

            var allDates = starts.Concat(ends).ToList();

            minDate = allDates.FirstOrDefault();
            maxDate = allDates.LastOrDefault();
            return events;
        }
    }
}
