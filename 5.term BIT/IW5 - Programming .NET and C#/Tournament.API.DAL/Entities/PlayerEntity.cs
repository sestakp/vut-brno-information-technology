using System;
using System.Collections.Generic;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.DAL.Entities
{
    public class PlayerEntity : IEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string Nickname { get; set; }
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public Guid TeamEntityId { get; set; }
        public TeamEntity? Team { get; set; }
        public static IEqualityComparer<PlayerEntity> PlayerEntityComparer { get; } = new PlayerEntityEqualityComparer();

        private sealed class PlayerEntityEqualityComparer : IEqualityComparer<PlayerEntity>
        {
            public bool Equals(PlayerEntity x, PlayerEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Surname == y.Surname && x.Nickname == y.Nickname && x.ImagePath == y.ImagePath && x.Description == y.Description && x.TeamEntityId.Equals(y.TeamEntityId) && Equals(x.Team, y.Team);
            }

            public int GetHashCode(PlayerEntity obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Surname, obj.Nickname, obj.ImagePath, obj.Description, obj.TeamEntityId, obj.Team);
            }
        }

    }
}
