using System;
using FestivalAdministration.BL.Interfaces;

namespace FestivalAdministration.BL.ListModels
{
    public abstract class ListModelBase : IListModel
    {
        public Guid Id { get; set; }
    }
}