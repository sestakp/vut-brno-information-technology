using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tournament.API.DAL.Entities;

namespace Tournament.API.DAL.Database.Configurations
{
    class GameConfiguration : IEntityTypeConfiguration<GameEntity>
    {
        public void Configure(EntityTypeBuilder<GameEntity> builder)
        {

            builder.HasOne(gameEntity => gameEntity.TeamRed)
                .WithMany(teamEntity => teamEntity.TeamRedGames)
                .HasForeignKey(gameEntity => gameEntity.TeamRedId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(gameEntity => gameEntity.TeamBlue)
                .WithMany(teamEntity => teamEntity.TeamBlueGames)
                .HasForeignKey(gameEntity => gameEntity.TeamBlueId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(gameEntity => gameEntity.TournamentVenue)
                .WithMany(tournamentVenueEntity => tournamentVenueEntity.Games)
                .HasForeignKey(gameEntity => gameEntity.TournamentVenueId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
