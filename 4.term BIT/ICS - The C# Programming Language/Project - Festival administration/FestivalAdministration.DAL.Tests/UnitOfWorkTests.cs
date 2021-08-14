using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FestivalAdministration.DAL.Entities;
using Xunit;

namespace FestivalAdministration.DAL.Tests
{
    public class UnitOfWorkTests : IClassFixture<UnitOfWorkTestsFixture>, IDisposable
    {
        private readonly UnitOfWorkTestsFixture _fixture;

        private const int IterationMax = 50;
        public UnitOfWorkTests(UnitOfWorkTestsFixture fixture)
        {
            _fixture = fixture;
            _fixture.PrepareDatabase();
            _fixture.ClearData();
        }


        [Fact]
        public void InsertBandAndStageWithCommit()
        {
            //Arrange
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());

            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());

            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());

            //Act
            _fixture.UnitOfWork.Commit();



            //Assert
            Assert.Equal(3, _fixture.UnitOfWork.BandRepository.GetAll().Count);
            Assert.Equal(4, _fixture.UnitOfWork.StageRepository.GetAll().Count);
            Assert.Equal(5, _fixture.UnitOfWork.EventRepository.GetAll().Count);

        }

        [Fact]
        public void InsertBandAndStageWithoutCommit()
        {
            //Arrange
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());
            _fixture.UnitOfWork.BandRepository.Insert(new BandEntity());

            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());
            _fixture.UnitOfWork.StageRepository.Insert(new StageEntity());

            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());
            _fixture.UnitOfWork.EventRepository.Insert(new EventEntity());

            //Act

            //Assert
            Assert.Equal(0, _fixture.UnitOfWork.BandRepository.GetAll().Count);
            Assert.Equal(0, _fixture.UnitOfWork.StageRepository.GetAll().Count);
            Assert.Equal(0, _fixture.UnitOfWork.EventRepository.GetAll().Count);

        }

       



        public void Dispose()
        {
            _fixture.ClearData();
            _fixture.TearDownDatabase();
        }
    }
}
