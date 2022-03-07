using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Tournament.API.DAL.Database.Configurations;
using Tournament.API.DAL.Entities;

namespace Tournament.API.DAL.Database
{
    public class TournamentDbContext : DbContext
    {
        public TournamentDbContext(DbContextOptions contextOptions) : base(contextOptions)
        {
        }

        public DbSet<GameEntity> Games { get; set; }
        public DbSet<PlayerEntity> Players { get; set; }
        public DbSet<TeamEntity> Teams { get; set; }
        public DbSet<TournamentVenueEntity> TournamentVenues { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new GameConfiguration());

            modelBuilder.ApplyConfiguration(new PlayerConfiguration());

            modelBuilder.ApplyConfiguration(new TeamConfiguration());

            modelBuilder.ApplyConfiguration(new TournamentVenueConfiguration());

        }

    }
}
