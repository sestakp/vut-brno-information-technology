using System;
using System.Collections.Generic;

namespace FestivalAdministration.BL.Interfaces
{
    public interface IAppFacade<TModel, TListModel>
        where TModel : class, IModel
        where TListModel : class, IListModel
    {
        IList<TListModel> GetAll();
        TModel GetById(Guid id);
        public (TListModel, int) GetByIdWithIndex(Guid id);
        Guid Create(TModel model);
        Guid? Update(TModel model);
        void Delete(Guid id);
        void Delete(TModel model);
    }
}