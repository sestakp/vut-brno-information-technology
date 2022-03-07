using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories.Factories.Interfaces
{
    public interface IRepositoryAbstractFactory
    {
        IGameRepository CreateGameRepository(TournamentDbContext Context);
        IPlayerRepository CreatePersonRepository(TournamentDbContext Context);
        ITeamRepository CreateTeamRepository(TournamentDbContext Context);
        ITournamentVenueRepository CreateTournamentVenueRepository(TournamentDbContext Context);
    }
}
