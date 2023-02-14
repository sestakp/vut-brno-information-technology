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
    class TournamentVenueConfiguration : IEntityTypeConfiguration<TournamentVenueEntity>
    {
        public void Configure(EntityTypeBuilder<TournamentVenueEntity> builder)
        {
            builder.HasMany(tournamentVenueEntity => tournamentVenueEntity.Games)
                .WithOne(gameEntity => gameEntity.TournamentVenue)
                .HasForeignKey(gameEntity => gameEntity.TournamentVenueId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
