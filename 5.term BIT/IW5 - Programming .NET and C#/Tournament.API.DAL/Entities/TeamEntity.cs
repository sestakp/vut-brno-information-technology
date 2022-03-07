using System;
using System.Collections.Generic;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.DAL.Entities
{
    public class TeamEntity : IEntity
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public IList<PlayerEntity> Players { get; set; } = new List<PlayerEntity>();
        public IList<GameEntity> TeamRedGames { get; set; } = new List<GameEntity>();
        public IList<GameEntity> TeamBlueGames { get; set; } = new List<GameEntity>();
        public static IEqualityComparer<TeamEntity> TeamEntityComparer { get; } = new TeamEntityEqualityComparer();

        private sealed class TeamEntityEqualityComparer : IEqualityComparer<TeamEntity>
        {
            public bool Equals(TeamEntity x, TeamEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.ImagePath == y.ImagePath && x.Description == y.Description && x.Country == y.Country;
            }

            public int GetHashCode(TeamEntity obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.ImagePath, obj.Description, obj.Country, obj.Players, obj.TeamRedGames, obj.TeamBlueGames);
            }
        }
    }
}
