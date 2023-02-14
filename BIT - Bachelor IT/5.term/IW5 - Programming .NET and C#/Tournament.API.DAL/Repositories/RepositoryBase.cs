using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Entities.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Repositories
{
    public class RepositoryBase<TEntity> : IRepository<TEntity>
        where TEntity : class, IEntity
    {
        public TournamentDbContext context { get; }
        protected DbSet<TEntity> dbSet;


        public RepositoryBase(TournamentDbContext context)
        {
            this.context = context;
            dbSet = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> GetAll()
        {
            return dbSet.AsEnumerable();
        }

        public virtual TEntity? GetById(Guid id)
        {
            return dbSet.FirstOrDefault(entity => entity.Id == id);
        }

        public virtual TEntity Insert(TEntity entity)
        {
            entity.Id = dbSet.Add(entity).Entity.Id;
            return entity;
        }

        public virtual TEntity Update(TEntity entity)
        {
            if (entity.Id == Guid.Empty) { return entity; }
            entity.Id = dbSet.Update(entity).Entity.Id;
            return entity;
        }

        public virtual void Delete(Guid id)
        {
            var entity = GetById(id);
            if(entity != null)
            {
                dbSet.Remove(entity);
            }
        }

        public IEnumerable<TEntity> Find(Func<TEntity, bool> predicate)
        {
            return GetAll().Where(predicate);
        }

        public virtual IEnumerable<SelectEntity> GetSelectModels()
        {
            return GetAll().Select(e => new SelectEntity(){Id = e.Id, SelectText = e.Id.ToString()});
        }
        
    }
}
