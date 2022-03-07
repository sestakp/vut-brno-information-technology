using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Entities.Factories.Interfaces;

namespace Tournament.API.DAL.Entities.Factories
{
    public class EntityAbstractFactory : IEntityAbstractFactory
    {
        public GameEntity CreateGameEntity(int index = 0)
        {
            return new GameEntity();
        }

        public PlayerEntity CreatePlayerEntity(int index = 0)
        {
            return new PlayerEntity
            {
                Name = $"Name{index}",
                Surname = $"Surname{index}",
                Description = $"Description{index}",
                ImagePath = $"Image{index}"
            };
        }

        public TeamEntity CreateTeamEntity(int index = 0)
        {
            return new TeamEntity
            {
                Name = $"Name{index}",
                Description = $"Description{index}",
                ImagePath = $"Image{index}",
                Country = $"Country{index}"
            };
        }

        public TournamentVenueEntity CreateTournamentVenueEntity(int index = 0)
        {
            return new TournamentVenueEntity
            {
                Name = $"Name{index}",
                Description = $"Description{index}"
            };
        }
    }
}
