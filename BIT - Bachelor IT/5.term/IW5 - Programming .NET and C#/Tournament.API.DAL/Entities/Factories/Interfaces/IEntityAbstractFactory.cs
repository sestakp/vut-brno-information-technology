using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.DAL.Entities.Factories.Interfaces
{
    public interface IEntityAbstractFactory
    {
        GameEntity CreateGameEntity(int index = 0);
        PlayerEntity CreatePlayerEntity(int index = 0);
        TeamEntity CreateTeamEntity(int index = 0);
        TournamentVenueEntity CreateTournamentVenueEntity(int index = 0);
    }
}
