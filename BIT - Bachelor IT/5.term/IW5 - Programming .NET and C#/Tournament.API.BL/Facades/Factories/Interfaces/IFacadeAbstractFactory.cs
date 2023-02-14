using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.BL.Facades.Factories.Interfaces
{
    public interface IFacadeAbstractFactory
    {
        GameFacade CreateGameFacade();
        SearchFacade CreateSearchFacade();
        PlayerFacade CreatePlayerFacade();
        TeamFacade CreateTeamFacade();
        TournamentVenueFacade CreateTournamentVenueFacade();
    }
}
