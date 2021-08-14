using System;
using System.Linq;
using FestivalAdministration.DAL.Entities;
using Xunit;

namespace FestivalAdministration.DAL.Tests
{
    public class RepositoryBaseTests : IClassFixture<RepositoryBaseTestsFixture>//, IDisposable
    {
        /*
        private const int IterationMax = 50;

        private readonly RepositoryBaseTestsFixture _fixture;

        public RepositoryBaseTests(RepositoryBaseTestsFixture fixture)
        {
            _fixture = fixture;
            _fixture.PrepareDatabase();
        }


        public void Dispose()
        {
            _fixture.ClearDataBands();
            _fixture.TearDownDatabase();
        }

        [Fact]
        public void CreateEntity()
        {
            //Arrange
            var band = new BandEntity
            {
                Country = "Czech",
                Genre = "Rock",
                Name = "Name",
                ImagePath = "C:/Users/testUser/Images/image.jpg",
                LongDescription = "Long description of band",
                ShortDescription = "Short description of band"
            };

            //Act
            var retId = _fixture.Repository.Insert(band);
            _fixture.Repository.Save();

            //Assert
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var returnedBand = dbContext.Bands.First(entity => entity.Id == retId);
            Assert.NotEqual(default, returnedBand);
            Assert.Equal(band, returnedBand, BandEntity.BandEntityComparer);
        }

        [Fact]
        public void GetAllEntities()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();

            var bandList = _fixture.SeedDataBands();

            //Act
            var returnedList = _fixture.Repository.GetAll().ToList();

            //Assert

            Assert.Equal(bandList.Count, returnedList.Count);
            for (var i = 0; i < IterationMax; i++)
                Assert.Equal(bandList[i], returnedList[i], BandEntity.BandEntityComparer);
        }

        [Fact]
        public void GetEntityById()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var bandList = _fixture.SeedDataBands();

            for (var i = 0; i < bandList.Count; i++)
            {
                //Act
                var band = _fixture.Repository.GetById(bandList[i].Id);

                //Assert
                Assert.Equal(bandList[i], band, BandEntity.BandEntityComparer);
            }
        }


        [Fact]
        public void RemoveEntityByGuid()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var bandList = _fixture.SeedDataBands();

            for (var i = 0; i < bandList.Count; i++)
            {
                //Act
                _fixture.Repository.Remove(bandList[i].Id);
                _fixture.Repository.Save();

                //Assert
                var band = dbContext.Bands.FirstOrDefault(entity => entity.Id == bandList[i].Id);

                Assert.Equal(default, band);
            }
        }

        [Fact]
        public void RemoveEntity()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var bandList = _fixture.SeedDataBands();

            for (var i = 0; i < bandList.Count; i++)
            {
                //Act
                _fixture.Repository.Remove(bandList[i]);
                _fixture.Repository.Save();

                //Assert
                var band = dbContext.Bands.FirstOrDefault(entity => entity.Id == bandList[i].Id);

                Assert.Equal(default, band);
            }
        }

        [Fact]
        public void UpdateEntity()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var bandList = _fixture.SeedDataBands();

            foreach (var band in bandList)
            {
                band.Country += "Updated";
                band.Genre += "Updated";
                band.ImagePath += "Updated";
                band.Name += "Updated";

                //Act

                var retId = _fixture.Repository.Update(band);
                _fixture.Repository.Save();

                //Assert
                var bandStored = dbContext.Bands.Find(retId);

                Assert.Equal(band, bandStored, BandEntity.BandEntityComparer);
            }
        }
        */
    }
}