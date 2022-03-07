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
    class PlayerConfiguration : IEntityTypeConfiguration<PlayerEntity>
    {
        public void Configure(EntityTypeBuilder<PlayerEntity> builder)
        {
            builder.HasOne(playerEntity => playerEntity.Team)
                .WithMany(teamEntity => teamEntity.Players)
                .HasForeignKey(playerEntity => playerEntity.TeamEntityId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
