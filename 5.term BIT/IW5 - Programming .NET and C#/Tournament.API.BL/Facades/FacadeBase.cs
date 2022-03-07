using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels.Interfaces;
using Tournament.API.BL.Models.SelectModels.Interfaces;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Tournament.API.Common.Enums;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;

namespace Tournament.API.BL.Facades
{
    public class FacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel, TEntity> : IFacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel>
        where TDetailModel : class, IDetailModel
        where TListModel : class, IListModel
        where TFormModel : class, IFormModel
        where TFormDefaultModel : class, IFormDefaultModel, new()
        where TEntity : class, IEntity
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IRepository<TEntity> Repository;
        protected readonly IMapper Mapper;
        protected readonly Entities Entity;
        

        protected virtual TListModel GetListModel(TListModel listModel)
        {
            return listModel;
        }

        protected virtual IList<TListModel> GetListModels(IList<TListModel> listModels)
        {
            foreach (var listModel in listModels)
            {
                GetListModel(listModel);
            }

            return listModels;
        }
        

        public FacadeBase(IUnitOfWork unitOfWork, IMapper mapper, Entities entity)
        {
            UnitOfWork = unitOfWork;
            Entity = entity;
            Repository = UnitOfWork.GetRepository<TEntity>(Entity);
            this.Mapper = mapper;
        }

        public IList<TListModel> GetAll()
        {
            var entities = Repository.GetAll();
            var listModels = Mapper.Map<IList<TListModel>>(entities);
            return GetListModels(listModels);
        }

        public TDetailModel? GetById(Guid id)
        {
            return Mapper.Map<TDetailModel?>(Repository.GetById(id));
        }

        public virtual TListModel Add(TFormModel formModel)
        {
            var detailModel = Mapper.Map<TListModel>(Repository.Insert(Mapper.Map<TEntity>(formModel)));
            UnitOfWork.Commit();
            return detailModel;
        }

        public virtual TListModel Update(TFormModel formModel)
        {
            var detailModel = Mapper.Map<TListModel>(Repository.Update(Mapper.Map<TEntity>(formModel)));
            UnitOfWork.Commit();
            return detailModel;
        }

        public virtual void Remove(Guid id)
        {
            Repository.Delete(id);
            UnitOfWork.Commit();
        }

        public virtual TFormDefaultModel GetDefaultFormModel()
        {
            var formDefaultModel = new TFormDefaultModel();
            return formDefaultModel;
        }

        public void Dispose()
        {
        }
    }
}
