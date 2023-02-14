using System;
using System.Collections.Generic;
using Nemesis.Essentials.Design;

namespace FestivalAdministration.BL.Models
{
    public class StageDetailModel : ModelBase
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string ImagePath { get; set; }

        public IList<EventDetailModel> Events { get; set; } = new ValueCollection<EventDetailModel>();

        public static IEqualityComparer<StageDetailModel> StageDetailModelComparer { get; } =
            new StageDetailModelEqualityComparer();

        private sealed class StageDetailModelEqualityComparer : IEqualityComparer<StageDetailModel>
        {
            public bool Equals(StageDetailModel x, StageDetailModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Name == y.Name && x.Description == y.Description && x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(StageDetailModel obj)
            {
                return HashCode.Combine(obj.Name, obj.Description, obj.ImagePath, obj.Events);
            }
        }
    }
}