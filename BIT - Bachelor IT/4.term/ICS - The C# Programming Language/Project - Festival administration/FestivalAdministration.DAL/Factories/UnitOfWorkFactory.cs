using System;
using System.Collections.Generic;
using System.Text;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.Factories
{
    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {
        IUnitOfWork IUnitOfWorkFactory.CreateUnitOfWork(IDbContextFactory contextFactory, IRepositoryAbstractFactory repositoryAbstractFactory)
        {
            return new UnitOfWork.UnitOfWork(contextFactory, repositoryAbstractFactory);
        }
    }
}
