using FestivalAdministration.Common;

namespace FestivalAdministration.BL.Messages
{
    public class UpdateMessage<T> : Message<T>
        where T : IId
    {
    }
}