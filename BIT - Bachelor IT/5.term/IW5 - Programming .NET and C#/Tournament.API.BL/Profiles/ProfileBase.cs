using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels.Interfaces;
using Tournament.API.DAL.Entities.Interfaces;

namespace Tournament.API.BL.Profiles
{
    public abstract class ProfileBase<TEntity, TDetailModel, TListModel, TFormModel, TFormDefaultModel> : Profile
        where TEntity : class, IEntity
        where TDetailModel : class, IDetailModel
        where TListModel : class, IListModel
        where TFormModel : class, IFormModel
        where TFormDefaultModel : class, IFormDefaultModel
    {
        public ProfileBase()
        {
            CreateMap<TEntity, TDetailModel>();
            CreateMap<TEntity, TListModel>();
            CreateMap<TDetailModel, TEntity>();
            CreateMap<TDetailModel, TListModel>();
            CreateMap<TFormModel, TEntity>();
            CreateMap<TEntity, TFormDefaultModel>();
            CreateMap<TEntity, TFormModel>();
            CreateMap<TFormModel, TDetailModel>();
            CreateMap<TListModel, TFormModel>();
            CreateMap<TFormModel, TListModel>();
        }
    }
}
