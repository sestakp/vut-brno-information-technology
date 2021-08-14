using System;
using System.Collections.Generic;

namespace FestivalAdministration.DAL.Interfaces
{
    public interface IAppRepository<TEntity> : IAppRepository
        where TEntity : class, IEntity
    {
        IList<TEntity> GetAll();
        TEntity GetById(Guid id);
        Guid Insert(TEntity entity);
        Guid? Update(TEntity entity);
        void Remove(Guid id);
        void Remove(TEntity entity);
    }

    public interface IAppRepository : IDisposable
    {
    }
}