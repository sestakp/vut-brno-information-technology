using FestivalAdministration.Common;

namespace FestivalAdministration.Messages
{
    internal class NewMessage<T> : Message<T> where T : IId
    {
    }
}