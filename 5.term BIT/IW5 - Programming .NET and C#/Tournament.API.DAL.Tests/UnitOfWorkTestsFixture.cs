using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Repositories;
using Tournament.API.DAL.Repositories.Factories;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.DAL.Tests
{
    public class UnitOfWorkTestsFixture : RepositoryBaseTestsFixture
    {
        public IUnitOfWorkFactory UnitOfWorkFactory { get; }

        public UnitOfWorkTestsFixture()
        {
            var context = DbContextFactory.CreateDbContext();
            UnitOfWorkFactory = new UnitOfWorkFactory(
                    RepositoryAbstractFactory,
                    DbContextFactory
                );
        }


        public void ClearData()
        {
            using var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            foreach (var entity in unitOfWork.GameRepository.GetAll()) { unitOfWork.GameRepository.Delete(entity.Id); }
            foreach (var entity in unitOfWork.PlayerRepository.GetAll()) { unitOfWork.PlayerRepository.Delete(entity.Id); }
            foreach (var entity in unitOfWork.TeamRepository.GetAll()) { unitOfWork.TeamRepository.Delete(entity.Id); }
            foreach (var entity in unitOfWork.TournamentVenueRepository.GetAll()) { unitOfWork.TournamentVenueRepository.Delete(entity.Id); }

            unitOfWork.Commit();
        }
    }
}
