using FestivalAdministration.Common;

namespace FestivalAdministration.BL.Messages
{
    public class SelectedMessage<T> : Message<T>
        where T : IId
    {
    }
}