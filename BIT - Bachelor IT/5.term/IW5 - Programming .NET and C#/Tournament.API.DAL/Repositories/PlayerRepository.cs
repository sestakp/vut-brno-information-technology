using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories
{
    public class PlayerRepository : RepositoryBase<PlayerEntity>, IPlayerRepository
    {
        public PlayerRepository(TournamentDbContext context) : base(context)
        {
        }

        public override IEnumerable<SelectEntity> GetSelectModels()
        {
            var players = GetAll();

            return players.Select(player => new SelectEntity(){ Id = player.Id, SelectText = player.Team?.Name ?? $"Solo - {player.Name} {player.Surname}" }).ToList();
        }

        public override PlayerEntity? GetById(Guid id)
        {
            return context.Players.Include(p => p.Team).SingleOrDefault(x => x.Id == id);
        }
    }
}
