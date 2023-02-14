using System;
using System.Collections.Generic;

namespace FestivalAdministration.BL.ListModels
{
    public class EventListModel : ListModelBase
    {
        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public Guid BandId { get; set; }

        public string BandName { get; set; }

        public Guid StageId { get; set; }

        public string StageName { get; set; }

        public static IEqualityComparer<EventListModel> StartEndComparer { get; } = new StartEndEqualityComparer();

        private sealed class StartEndEqualityComparer : IEqualityComparer<EventListModel>
        {
            public bool Equals(EventListModel x, EventListModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return Nullable.Equals(x.Start, y.Start) && Nullable.Equals(x.End, y.End);
            }

            public int GetHashCode(EventListModel obj)
            {
                return HashCode.Combine(obj.Start, obj.End);
            }
        }
    }
}