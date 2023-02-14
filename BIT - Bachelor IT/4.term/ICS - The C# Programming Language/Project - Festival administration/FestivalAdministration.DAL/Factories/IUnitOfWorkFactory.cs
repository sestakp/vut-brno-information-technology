using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.Factories
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork CreateUnitOfWork(IDbContextFactory contextFactory, IRepositoryAbstractFactory repositoryAbstractFactory);
    }
}
