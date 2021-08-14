using System;
using System.Collections.Generic;
using Nemesis.Essentials.Design;

namespace FestivalAdministration.BL.Models
{
    public class BandDetailModel : ModelBase
    {
        public string Name { get; set; }

        public string Genre { get; set; }

        public string Country { get; set; }

        public string LongDescription { get; set; }

        public string ShortDescription { get; set; }

        public string ImagePath { get; set; }

        public IList<EventDetailModel> Events { get; set; } = new ValueCollection<EventDetailModel>();

        public static IEqualityComparer<BandDetailModel> BandDetailModelComparer { get; } =
            new BandDetailModelEqualityComparer();

        private sealed class BandDetailModelEqualityComparer : IEqualityComparer<BandDetailModel>
        {
            public bool Equals(BandDetailModel x, BandDetailModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (x is null) return false;
                if (y is null) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.Genre == y.Genre && x.Country == y.Country &&
                       x.LongDescription == y.LongDescription && x.ShortDescription == y.ShortDescription &&
                       x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(BandDetailModel obj)
            {
                return HashCode.Combine(obj.Name, obj.Genre, obj.Country, obj.LongDescription, obj.ShortDescription,
                    obj.ImagePath, obj.Events);
            }
        }
    }
}