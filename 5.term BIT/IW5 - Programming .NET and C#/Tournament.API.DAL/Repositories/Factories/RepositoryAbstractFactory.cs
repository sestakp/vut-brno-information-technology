using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories.Factories
{
    public class RepositoryAbstractFactory : IRepositoryAbstractFactory
    {
        public RepositoryAbstractFactory()
        {
        }

        public IGameRepository CreateGameRepository(TournamentDbContext Context)
        {
            return new GameRepository(Context);
        }

        public IPlayerRepository CreatePersonRepository(TournamentDbContext Context)
        {
            return new PlayerRepository(Context);
        }

        public ITeamRepository CreateTeamRepository(TournamentDbContext Context)
        {
            return new TeamRepository(Context);
        }

        public ITournamentVenueRepository CreateTournamentVenueRepository(TournamentDbContext Context)
        {
            return new TournamentVenueRepository(Context);
        }
    }
}
