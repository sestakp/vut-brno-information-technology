using System;
using System.Collections.Generic;
using Nemesis.Essentials.Design;

namespace FestivalAdministration.DAL.Entities
{
    public record BandEntity : BaseEntity
    {
        public string Name { get; set; }

        public string Genre { get; set; }

        public string Country { get; set; }

        public string LongDescription { get; set; }

        public string ShortDescription { get; set; }

        public string ImagePath { get; set; }

        public IList<EventEntity> Events { get; set; } = new ValueCollection<EventEntity>();

        public static IEqualityComparer<BandEntity> BandEntityComparer { get; } = new BandEntityEqualityWithoutEventsComparer();

        private sealed class BandEntityEqualityWithoutEventsComparer : IEqualityComparer<BandEntity>
        {
            public bool Equals(BandEntity x, BandEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.Genre == y.Genre && x.Country == y.Country &&
                       x.LongDescription == y.LongDescription && x.ShortDescription == y.ShortDescription &&
                       x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(BandEntity obj)
            {
                return HashCode.Combine(obj.Name, obj.Genre, obj.Country, obj.LongDescription, obj.ShortDescription,
                    obj.ImagePath, obj.Events);
            }
        }
    }
}