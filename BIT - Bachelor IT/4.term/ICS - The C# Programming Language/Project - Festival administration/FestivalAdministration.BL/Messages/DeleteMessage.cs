using FestivalAdministration.Common;

namespace FestivalAdministration.BL.Messages
{
    public class DeleteMessage<T> : Message<T>
        where T : IId
    {
    }
}