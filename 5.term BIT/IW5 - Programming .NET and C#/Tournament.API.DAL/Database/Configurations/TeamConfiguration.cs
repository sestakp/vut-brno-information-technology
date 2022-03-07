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
    class TeamConfiguration : IEntityTypeConfiguration<TeamEntity>
    {
        public void Configure(EntityTypeBuilder<TeamEntity> builder)
        {
            builder.HasMany(teamEntity => teamEntity.Players)
                .WithOne(playerEntity => playerEntity.Team)
                .HasForeignKey(gameEntity => gameEntity.TeamEntityId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(teamEntity => teamEntity.TeamRedGames)
                .WithOne(gameEntity => gameEntity.TeamRed)
                .HasForeignKey(gameEntity => gameEntity.TeamRedId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(teamEntity => teamEntity.TeamBlueGames)
                .WithOne(gameEntity => gameEntity.TeamBlue)
                .HasForeignKey(gameEntity => gameEntity.TeamBlueId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
