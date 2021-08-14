using System;
using System.Collections.Generic;
using System.Linq;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FestivalAdministration.DAL.Repositories
{
    public class RepositoryBase<T> : IAppRepository<T>
        where T : class, IEntity, new()
    {
        protected readonly FestivalAdministrationDbContext Context;

        protected internal RepositoryBase(FestivalAdministrationDbContext context)
        {
            Context = context;
        }

        public IList<T> GetAll()
        {
            return Context.Set<T>().ToList();
        }

        public T GetById(Guid id)
        {
            return Context.Set<T>().FirstOrDefault(entity => entity.Id == id);
        }


        public virtual Guid Insert(T entity)
        {
            Context.Set<T>().Add(entity);
            return entity.Id;
        }

        public void Remove(Guid id)
        {
            Context.Set<T>().Remove(Context.Set<T>().Single(obj => obj.Id.Equals(id)));
        }

        public void Remove(T entity)
        {
            Context.Remove(Context.Find(typeof(T), entity.Id));
        }

        /// <returns>null if unknown error, Id if success or returns error</returns>
        public virtual Guid? Update(T entity)
        {

            if(entity.Id != Guid.Empty)
            {
                Remove(entity);
                entity.Id = Guid.Empty;
            }
            return Insert(entity);
        }


        public void Dispose()
        {
            Context?.Dispose();
        }
    }
}