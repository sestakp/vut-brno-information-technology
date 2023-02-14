using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FestivalAdministration.DAL
{
    public class FestivalAdministrationDbContext : DbContext, IDbContext
    {
        public FestivalAdministrationDbContext(DbContextOptions contextOptions)
            : base(contextOptions)
        {
        }

        public DbSet<BandEntity> Bands { get; set; }
        public DbSet<EventEntity> Events { get; set; }
        public DbSet<StageEntity> Stages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BandEntity>()
                .HasMany(e => e.Events)
                .WithOne(e => e.Band)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<EventEntity>()
                .HasOne(e=> e.Band)
                .WithMany(e=> e.Events)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EventEntity>()
                .HasOne(e => e.Stage)
                .WithMany(e => e.Events)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StageEntity>()
                .HasMany(e => e.Events)
                .WithOne(e => e.Stage)
                .OnDelete(DeleteBehavior.Cascade);


            base.OnModelCreating(modelBuilder);
        }
        
    }
}