using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories
{
    public class TeamRepository : RepositoryBase<TeamEntity>, ITeamRepository
    {
        public TeamRepository(TournamentDbContext context) : base(context)
        {
        }

        public override IEnumerable<SelectEntity> GetSelectModels()
        {
            var teams = GetAll();

            return teams.Select(team => new SelectEntity{Id = team.Id, SelectText = $"{team.Country} - {team.Name}"}).ToList();
        }

        public override TeamEntity? GetById(Guid id)
        {
            var teams = context.Teams.ToList();
            return context.Teams.Include(t => t.
                Players).FirstOrDefault(team => team.Id == id);
        }

        public override void Delete(Guid id)
        {
            var team = GetById(id);
               
            if (team != null)
            {
                var games = context.Games.Where(g => g.TeamBlueId == team.Id || g.TeamRedId == team.Id);
                foreach(var game in games)
                {
                    context.Games.Remove(game);
                }

                dbSet.Remove(team);
            }
        }
    }
}
