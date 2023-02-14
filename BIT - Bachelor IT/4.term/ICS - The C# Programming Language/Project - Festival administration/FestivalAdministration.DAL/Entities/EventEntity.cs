using System;
using System.Collections.Generic;
using ObjectsComparer;

namespace FestivalAdministration.DAL.Entities
{
    public record EventEntity : BaseEntity
    {
        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public Guid BandId { get; set; }
        public BandEntity Band { get; set; }

        public Guid StageId { get; set; }
        public StageEntity Stage { get; set; }

        public static IEqualityComparer<EventEntity> EventEntityComparer { get; } = new EventEntityEqualityComparer();

        private sealed class EventEntityEqualityComparer : IEqualityComparer<EventEntity>
        {
            public bool Equals(EventEntity x, EventEntity y)
            {
                var bandComparer = new ObjectsComparer.Comparer<BandEntity>();
                var stageComparer = new ObjectsComparer.Comparer<StageEntity>();

                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return Nullable.Equals(x.Start, y.Start) && Nullable.Equals(x.End, y.End) &&
                       x.BandId.Equals(y.BandId) && bandComparer.Compare(x.Band, y.Band) && x.StageId.Equals(y.StageId) && stageComparer.Compare(x.Stage, y.Stage);
            }

            public int GetHashCode(EventEntity obj)
            {
                return HashCode.Combine(obj.Start, obj.End, obj.BandId, obj.Band, obj.StageId, obj.Stage);
            }
        }
    }
}