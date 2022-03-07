using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Entities.Interfaces;
using Tournament.API.DAL.Repositories.Factories;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;
using Tournament.API.Common.Enums;
using Tournament.API.DAL.Database;

namespace Tournament.API.DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        protected readonly TournamentDbContext Context;
        public UnitOfWork(
            IGameRepository gameRepository, 
            IPlayerRepository playerRepository,
            ITeamRepository teamRepository, 
            ITournamentVenueRepository tournamentVenueRepository,
            TournamentDbContext context)
        {
            Context = context;
            GameRepository = gameRepository;
            PlayerRepository = playerRepository;
            TeamRepository = teamRepository;
            TournamentVenueRepository = tournamentVenueRepository;
        }
        
        public IGameRepository GameRepository { get; init; }
        public IPlayerRepository PlayerRepository { get; init; }
        public ITeamRepository TeamRepository { get; init; }
        public ITournamentVenueRepository TournamentVenueRepository { get; init; }

        public IRepository<T> GetRepository<T>(Common.Enums.Entities entity)
        where T : IEntity
        {
            return entity switch
            {
                Common.Enums.Entities.Game => (IRepository<T>)GameRepository,
                Common.Enums.Entities.Player => (IRepository<T>)PlayerRepository,
                Common.Enums.Entities.Team => (IRepository<T>)TeamRepository,
                Common.Enums.Entities.TournamentVenue => (IRepository<T>)TournamentVenueRepository,
                _ => throw new ArgumentOutOfRangeException(nameof(entity), entity, null)
            };
        }
        public int Commit()
        {
            return Context.SaveChanges();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
