using System;
using FestivalAdministration.Common;

namespace FestivalAdministration.Interfaces.DetailViewModels
{
    public interface IDetailViewModel<TDetail> : IViewModel
        where TDetail : class, IId
    {
        TDetail Model { get; set; }
        void Load(Guid id);
    }
}