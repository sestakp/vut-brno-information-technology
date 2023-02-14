namespace FestivalAdministration.Interfaces
{
    public interface IFactory<out T>
    {
        T Create();
    }
}