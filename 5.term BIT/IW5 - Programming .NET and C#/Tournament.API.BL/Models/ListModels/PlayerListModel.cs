using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.ListModels.Interfaces;

namespace Tournament.API.BL.Models.ListModels
{
    public class PlayerListModel : IListModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? ImagePath { get; set; }
        public string? Nickname { get; set; }
        public string? Description { get; set; }
        public Guid TeamEntityId { get; set; }
        public string? TeamName { get; set; }
        public static IEqualityComparer<PlayerListModel> PlayerListModelComparer { get; } = new PlayerListModelEqualityComparer();

        private sealed class PlayerListModelEqualityComparer : IEqualityComparer<PlayerListModel>
        {
            public bool Equals(PlayerListModel x, PlayerListModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Surname == y.Surname && x.ImagePath == y.ImagePath && x.Nickname == y.Nickname && x.Description == y.Description && x.TeamEntityId.Equals(y.TeamEntityId) && x.TeamName == y.TeamName;
            }

            public int GetHashCode(PlayerListModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Surname, obj.ImagePath, obj.Nickname, obj.Description, obj.TeamEntityId, obj.TeamName);
            }
        }
    }
}
