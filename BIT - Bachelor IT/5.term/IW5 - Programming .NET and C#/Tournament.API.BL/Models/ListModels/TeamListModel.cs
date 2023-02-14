using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.ListModels.Interfaces;

namespace Tournament.API.BL.Models.ListModels
{
    public class TeamListModel : IListModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }

        private sealed class TeamListModelEqualityComparer : IEqualityComparer<TeamListModel>
        {
            public bool Equals(TeamListModel x, TeamListModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.ImagePath == y.ImagePath && x.Description == y.Description && x.Country == y.Country;
            }

            public int GetHashCode(TeamListModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.ImagePath, obj.Description, obj.Country);
            }
        }

        public static IEqualityComparer<TeamListModel> TeamListModelComparer { get; } = new TeamListModelEqualityComparer();
    }
}
