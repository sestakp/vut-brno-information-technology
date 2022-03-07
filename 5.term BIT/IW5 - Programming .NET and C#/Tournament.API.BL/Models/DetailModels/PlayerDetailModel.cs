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
    public class PlayerDetailModel : IDetailModel, IImagePath
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public string? Nickname { get; set; }
        public Guid TeamEntityId { get; set; }
        public string? TeamName { get; set; }


        private sealed class PlayerDetailModelEqualityComparer : IEqualityComparer<PlayerDetailModel>
        {
            public bool Equals(PlayerDetailModel x, PlayerDetailModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Surname == y.Surname && x.ImagePath == y.ImagePath && x.Description == y.Description && x.TeamEntityId.Equals(y.TeamEntityId);
            }

            public int GetHashCode(PlayerDetailModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Surname, obj.ImagePath, obj.Description, obj.TeamEntityId);
            }
        }

        public static IEqualityComparer<PlayerDetailModel> PlayerDetailModelComparer { get; } = new PlayerDetailModelEqualityComparer();
    }
}
