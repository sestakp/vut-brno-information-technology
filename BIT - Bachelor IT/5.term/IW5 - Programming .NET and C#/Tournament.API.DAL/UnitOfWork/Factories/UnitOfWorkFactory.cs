using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.Database.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Factories;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.DAL.UnitOfWork.Factories
{
    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {
        
        protected readonly IDbContextFactory contextFactory;
        protected readonly IRepositoryAbstractFactory repositoryAbstractFactory;
        public UnitOfWorkFactory(IRepositoryAbstractFactory repositoryAbstractFactory, IDbContextFactory dbContextFactory)
        {
            this.repositoryAbstractFactory = repositoryAbstractFactory;
            this.contextFactory = dbContextFactory;
        }

        public IUnitOfWork CreateUnitOfWork()
        {
            var context = contextFactory.CreateDbContext();
            
            return new UnitOfWork(
                repositoryAbstractFactory.CreateGameRepository(context),
                repositoryAbstractFactory.CreatePersonRepository(context),
                repositoryAbstractFactory.CreateTeamRepository(context),
                repositoryAbstractFactory.CreateTournamentVenueRepository(context),
                context
                );
        }
    }
}
