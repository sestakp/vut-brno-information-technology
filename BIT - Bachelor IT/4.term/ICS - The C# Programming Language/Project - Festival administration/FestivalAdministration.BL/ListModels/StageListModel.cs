using System;
using System.Collections.Generic;

namespace FestivalAdministration.BL.ListModels
{
    public class StageListModel : ListModelBase
    {
        public string Name { get; set; }

        public string ImagePath { get; set; }

        public static IEqualityComparer<StageListModel> NameDescriptionImagePathComparer { get; } =
            new NameDescriptionImagePathEqualityComparer();

        private sealed class NameDescriptionImagePathEqualityComparer : IEqualityComparer<StageListModel>
        {
            public bool Equals(StageListModel x, StageListModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(StageListModel obj)
            {
                return HashCode.Combine(obj.Name, obj.ImagePath);
            }
        }
    }
}