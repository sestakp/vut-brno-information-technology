using FestivalAdministration.Common;

namespace FestivalAdministration.Interfaces.Wrappers
{
    internal interface IWrapper<T>
        where T : class, IId, new()
    {
    }
}