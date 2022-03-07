using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.Interfaces;
using Tournament.API.Common.Interfaces;

namespace Tournament.API.BL.Models.DetailModels
{
    public class TeamDetailModel : IDetailModel, IImagePath
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public IList<PlayerDetailModel> Players { get; set; } = new List<PlayerDetailModel>();

        private sealed class TeamDetailModelEqualityComparer : IEqualityComparer<TeamDetailModel>
        {
            public bool Equals(TeamDetailModel x, TeamDetailModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.ImagePath == y.ImagePath && x.Description == y.Description && x.Country == y.Country;
            }

            public int GetHashCode(TeamDetailModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.ImagePath, obj.Description, obj.Country, obj.Players);
            }
        }

        public static IEqualityComparer<TeamDetailModel> TeamDetailModelComparer { get; } = new TeamDetailModelEqualityComparer();
    }
}
