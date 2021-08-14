using FestivalAdministration.Common;

namespace FestivalAdministration.Messages
{
    internal class UpdateMessage<T> : Message<T> where T : IId
    {
    }
}