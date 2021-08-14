using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using FestivalAdministration.DAL.Repositories;

namespace FestivalAdministration.DAL.Tests
{
    public class UnitOfWorkTestsFixture : RepositoryBaseTestsFixture
    {
        public IUnitOfWork UnitOfWork { get; }

        public UnitOfWorkTestsFixture()
        {
            UnitOfWork = new UnitOfWork.UnitOfWork(DbContextFactory, new RepositoryAbstractFactory());
        }


        public void ClearData()
        {
            UnitOfWork.BandRepository.GetAll();
            foreach (var entity in UnitOfWork.BandRepository.GetAll()) { UnitOfWork.BandRepository.Remove(entity); }
            foreach (var entity in UnitOfWork.EventRepository.GetAll()) { UnitOfWork.EventRepository.Remove(entity); }
            foreach (var entity in UnitOfWork.StageRepository.GetAll()) { UnitOfWork.StageRepository.Remove(entity); }

            UnitOfWork.Commit();
        }
    }
}
