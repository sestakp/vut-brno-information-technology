using Microsoft.EntityFrameworkCore;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories
{
    public class TournamentVenueRepository : RepositoryBase<TournamentVenueEntity>, ITournamentVenueRepository
    {
        public TournamentVenueRepository(TournamentDbContext context) : base(context)
        {
        }
        public override IEnumerable<SelectEntity> GetSelectModels()
        {
            var tournamentVenues = GetAll();

            return tournamentVenues.Select(tournamentVenue => new SelectEntity(){Id = tournamentVenue.Id, SelectText = tournamentVenue.Name}).ToList();

        }

        public override TournamentVenueEntity? GetById(Guid id)
        {

            return context.TournamentVenues
                .Include(tp => tp.Games)
                .ThenInclude(g => g.TeamBlue)
                .Include(tp => tp.Games)
                .ThenInclude(g => g.TeamRed)
                .FirstOrDefault(entity => entity.Id == id);
        }
    }
}
