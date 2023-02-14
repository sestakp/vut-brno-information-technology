using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Entities.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.UnitOfWork.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        int Commit();
        IGameRepository GameRepository { get; }
        IPlayerRepository PlayerRepository { get; }
        ITeamRepository TeamRepository { get; }
        ITournamentVenueRepository TournamentVenueRepository { get; }
        IRepository<T> GetRepository<T>(Common.Enums.Entities entity) where T : IEntity;
    }
}
