using System;
using System.Collections.Generic;
using System.Text;
using FestivalAdministration.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FestivalAdministration.DAL.Interfaces
{
    public interface IDbContext
    {
        //public DbSet<BandEntity> Bands { get; set; }
        //public DbSet<EventEntity> Events { get; set; }
        //public DbSet<StageEntity> Stages { get; set; }
        int SaveChanges();
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
    }
}
