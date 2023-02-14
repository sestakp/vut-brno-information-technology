using System;
using System.Collections.Generic;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.DAL.Entities
{
    public class GameEntity : IEntity
    {
        public Guid Id { get; set; }
        public Guid TeamRedId { get; set; }
        public TeamEntity? TeamRed { get; set; }
        public Guid TeamBlueId { get; set; }
        public TeamEntity? TeamBlue { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int TeamRedPoints { get; set; }
        public int TeamBluePoints { get; set; }
        public Guid TournamentVenueId { get; set; }
        public TournamentVenueEntity? TournamentVenue { get; set; }
        public static IEqualityComparer<GameEntity> GameEntityComparer { get; } = new GameEntityEqualityComparer();

        private sealed class GameEntityEqualityComparer : IEqualityComparer<GameEntity>
        {
            public bool Equals(GameEntity x, GameEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.TeamRedId.Equals(y.TeamRedId) && Equals(x.TeamRed, y.TeamRed) && x.TeamBlueId.Equals(y.TeamBlueId) && Equals(x.TeamBlue, y.TeamBlue) && x.TournamentVenueId.Equals(y.TournamentVenueId) && Equals(x.TournamentVenue, y.TournamentVenue);
            }

            public int GetHashCode(GameEntity obj)
            {
                var hashCode = new HashCode();
                hashCode.Add(obj.Id);
                hashCode.Add(obj.TeamRedId);
                hashCode.Add(obj.TeamRed);
                hashCode.Add(obj.TeamBlueId);
                hashCode.Add(obj.TeamBlue);
                hashCode.Add(obj.TournamentVenueId);
                hashCode.Add(obj.TournamentVenue);
                return hashCode.ToHashCode();
            }
        }
    }

    
}
