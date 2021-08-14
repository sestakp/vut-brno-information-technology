using System;
using System.Collections.Generic;
using System.Linq;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using Mapster;

namespace FestivalAdministration.BL.Facades
{
    public abstract class FacadeBase<TM, TLM, TE> : IAppFacade<TM, TLM>, IDisposable
        where TM : class, IModel, new()
        where TLM : class, IListModel, new()
        where TE : class, IEntity, new()
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IAppRepository<TE> Repository;

        public FacadeBase(IUnitOfWork unitOfWork, IAppRepository<TE> repository)
        {
            UnitOfWork = unitOfWork;
            Repository = repository;
   
        }

        public Guid Create(TM model) 
        {
            model.Id = Repository.Insert(model.Adapt<TE>());
            UnitOfWork.Commit();
            return model.Id;

        }

        public void Delete(Guid id)
        {
            Repository.Remove(id);
            UnitOfWork.Commit();
        }

        public void Delete(TM model)
        {
            Repository.Remove(model.Adapt<TE>());
            UnitOfWork.Commit();
        }

        public IList<TLM> GetAll()
        {
            return Repository.GetAll().Adapt<IList<TLM>>();
        }

        public TM GetById(Guid id)
        {
            return Repository.GetById(id).Adapt<TM>();
        }

        public (TLM, int) GetByIdWithIndex(Guid id)
        {
            var tuple = GetAll().Select((Value, Index) => new { Value, Index })
                .SingleOrDefault(p => p.Value.Id == id);

            return (tuple?.Value, tuple?.Index ?? -1);
        }

        public Guid? Update(TM model)
        {
            var id = Repository.Update(model.Adapt<TE>());
            UnitOfWork.Commit();
            return id;
        }

        public void Dispose()
        {
            UnitOfWork?.Dispose();
        }
    }
}