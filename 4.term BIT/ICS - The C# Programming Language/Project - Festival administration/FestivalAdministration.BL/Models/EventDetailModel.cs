using System;
using System.Collections.Generic;
using FestivalAdministration.BL.ListModels;

namespace FestivalAdministration.BL.Models
{
    public class EventDetailModel : ModelBase
    {
        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public Guid BandId { get; set; }
        public BandListModel Band { get; set; }

        public Guid StageId { get; set; }
        public StageListModel Stage { get; set; }

        public static IEqualityComparer<EventDetailModel> EventDetailModelComparer { get; } =
            new EventDetailModelEqualityComparer();

        private sealed class EventDetailModelEqualityComparer : IEqualityComparer<EventDetailModel>
        {
            public bool Equals(EventDetailModel x, EventDetailModel y)
            {
                var bandComparer = new ObjectsComparer.Comparer<BandListModel>();
                var stageComparer = new ObjectsComparer.Comparer<StageListModel>();

                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return Nullable.Equals(x.Start, y.Start) && Nullable.Equals(x.End, y.End) &&
                       x.BandId.Equals(y.BandId) && bandComparer.Compare(x.Band, y.Band) && x.StageId.Equals(y.StageId) &&
                       stageComparer.Compare(x.Stage,y.Stage);
            }

            public int GetHashCode(EventDetailModel obj)
            {
                return HashCode.Combine(obj.Start, obj.End, obj.BandId, obj.Band, obj.StageId, obj.Stage);
            }
        }
    }
}