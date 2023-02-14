using System;
using System.Collections.Generic;
using Nemesis.Essentials.Design;

namespace FestivalAdministration.DAL.Entities
{
    public record StageEntity : BaseEntity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string ImagePath { get; set; }

        public IList<EventEntity> Events { get; set; } = new ValueCollection<EventEntity>();

        public static IEqualityComparer<StageEntity> StageEntityComparer { get; } = new StageEntityEqualityWithoutEventsComparer();

        private sealed class StageEntityEqualityWithoutEventsComparer : IEqualityComparer<StageEntity>
        {
            public bool Equals(StageEntity x, StageEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.Description == y.Description && x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(StageEntity obj)
            {
                return HashCode.Combine(obj.Name, obj.Description, obj.ImagePath, obj.Events);
            }
        }
    }
}