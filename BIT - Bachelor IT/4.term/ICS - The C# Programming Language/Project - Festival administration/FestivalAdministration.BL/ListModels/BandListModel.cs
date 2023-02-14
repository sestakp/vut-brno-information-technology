using System;
using System.Collections.Generic;

namespace FestivalAdministration.BL.ListModels
{
    public class BandListModel : ListModelBase
    {
        public string Name { get; set; }

        public string ImagePath { get; set; }

        private sealed class NameImagePathEqualityComparer : IEqualityComparer<BandListModel>
        {
            public bool Equals(BandListModel x, BandListModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(BandListModel obj)
            {
                return HashCode.Combine(obj.Name, obj.ImagePath);
            }
        }

        public static IEqualityComparer<BandListModel> NameImagePathComparer { get; } = new NameImagePathEqualityComparer();
    }
}