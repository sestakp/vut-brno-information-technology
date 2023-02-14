using System;
using System.Collections.Generic;
using Tournament.API.DAL.Entities.Interfaces;
namespace Tournament.API.DAL.Entities
{
    public class TournamentVenueEntity : IEntity
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public IList<GameEntity> Games { get; set; } = new List<GameEntity>();
        public static IEqualityComparer<TournamentVenueEntity> TournamentVenueEntityComparer { get; } = new TournamentVenueEntityEqualityComparer();

        private sealed class TournamentVenueEntityEqualityComparer : IEqualityComparer<TournamentVenueEntity>
        {
            public bool Equals(TournamentVenueEntity x, TournamentVenueEntity y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Description == y.Description;
            }

            public int GetHashCode(TournamentVenueEntity obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Description, obj.Games);
            }
        }
    }
}
