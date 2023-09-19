using Common.Models.Interfaces;
using MongoDB.Driver;

namespace Common.Controllers.Interfaces
{
    public interface IController<T> where T : IMongoItem
    {
        IEnumerable<T> Get();

        T Get(string id);

        string Post(T item);

        ReplaceOneResult Put(T item);

        DeleteResult Delete(string id);
    }
}
