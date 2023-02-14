using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.BL.Facades.Interfaces
{
    public interface IFacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel> : IFacadeBase
        where TDetailModel : class, IDetailModel
        where TListModel : class, IListModel
        where TFormModel : class, IFormModel
        where TFormDefaultModel : class, IFormDefaultModel
    {
        public IList<TListModel> GetAll();
        public TDetailModel? GetById(Guid id);
        public TListModel Add(TFormModel detailModel);
        public TListModel Update(TFormModel detailModel);
        public void Remove(Guid id);
        public TFormDefaultModel GetDefaultFormModel();
    }

    public interface IFacadeBase : IDisposable
    {

    }
}
