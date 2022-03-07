using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tournament.API.DAL.Database;

namespace Tournament.API.DAL.Repositories
{
    public class GameRepository : RepositoryBase<GameEntity>, IGameRepository
    {
        public GameRepository(TournamentDbContext context) : base(context)
        {
        }

        public override IEnumerable<GameEntity> GetAll()
        {
            return context.Games
                .Include(g => g.TeamBlue)
                .Include(g => g.TeamRed)
                .Include(g => g.TournamentVenue);
        }

        public override GameEntity? GetById(Guid id)
        {
            return context.Games
                .Include(g => g.TeamRed)
                .ThenInclude(tr => tr.Players)
                .Include(g => g.TeamBlue)
                .ThenInclude(tb => tb.Players)                
                .Include(g => g.TournamentVenue)
                .FirstOrDefault(entity => entity.Id == id);
        }

        public override GameEntity Update(GameEntity entity)
        {
            var game = base.Update(entity);
            //game = GetById(game.Id);

            return game;
        }

        public override GameEntity Insert(GameEntity entity)
        {
            return base.Insert(entity);
        }
            

        public bool CurrentSlotIsEmpty(GameEntity entity)
        {
            var games = context.Games.Where(g => g.TournamentVenueId == entity.TournamentVenueId && g.Id != entity.Id);
            var count = games.Count(game => (
                    (game.Start < entity.Start && game.End > entity.End) || //Inside interval
                    (entity.Start < game.Start && entity.End > game.Start) || // Left overlap
                    (entity.Start < game.End && entity.End > game.End) ||//Right overlat
                    (entity.Start == game.Start && entity.End == game.End) //Same interval
                ));

            return count == 0;
        }
    }
}
