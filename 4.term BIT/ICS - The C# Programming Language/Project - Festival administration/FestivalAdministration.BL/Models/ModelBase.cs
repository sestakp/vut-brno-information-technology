using System;
using FestivalAdministration.BL.Interfaces;

namespace FestivalAdministration.BL.Models
{
    public abstract class ModelBase : IModel
    {
        public Guid Id { get; set; }
    }
}