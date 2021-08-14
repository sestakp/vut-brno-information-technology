using System;
using FestivalAdministration.Common;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.Entities
{
    public abstract record BaseEntity : IEntity, IId
    {
        public Guid Id { get; set; }
    }
}