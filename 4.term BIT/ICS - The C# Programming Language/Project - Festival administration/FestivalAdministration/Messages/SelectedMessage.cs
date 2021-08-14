using FestivalAdministration.Common;

namespace FestivalAdministration.Messages
{
    internal class SelectedMessage<T> : Message<T> where T : IId
    {
    }
}