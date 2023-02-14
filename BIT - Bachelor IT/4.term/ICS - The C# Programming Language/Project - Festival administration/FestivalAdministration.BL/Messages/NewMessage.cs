using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.Common;

namespace FestivalAdministration.BL.Messages
{
    public class NewMessage<T> : Message<T>, IMessage where T : IId
    {
    }
}