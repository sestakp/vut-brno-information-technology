using System;
using System.Collections.Generic;
using Tournament.API.DAL.Database;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.DAL.Repositories.Interfaces
{
    public interface IRepository<TEntity>
        where TEntity : IEntity
    {
        public IEnumerable<TEntity> GetAll();
        public TEntity? GetById(Guid id);
        public TEntity Insert(TEntity entity);
        public TEntity Update(TEntity entity);
        public void Delete(Guid id);
        public IEnumerable<TEntity> Find(Func<TEntity, bool> predicate);
        public IEnumerable<SelectEntity> GetSelectModels();
        public TournamentDbContext context { get; }
    }
}
