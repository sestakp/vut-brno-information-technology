using System;

namespace FestivalAdministration.BL.Interfaces
{
    public interface IMessage
    {
        Guid Id { get; set; }
        Guid TargetId { get; set; }
    }
}