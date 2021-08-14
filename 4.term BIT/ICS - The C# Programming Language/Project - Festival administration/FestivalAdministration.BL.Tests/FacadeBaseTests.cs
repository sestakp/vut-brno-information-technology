using System;
using System.Linq;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Models;
using Mapster;
using Xunit;

namespace FestivalAdministration.BL.Tests
{
    public class FacadeBaseTests : IClassFixture<FacadeBaseTestsFixture>, IDisposable
    {
        private readonly FacadeBaseTestsFixture _fixture;

        public FacadeBaseTests(FacadeBaseTestsFixture fixture)
        {
            _fixture = fixture;
        }


        public void Dispose()
        {
            _fixture.ClearDataBands();
        }

        [Fact]
        public void Create()
        {
            //Arrange
            var band = new BandDetailModel
            {
                Country = "Czech",
                Genre = "Rock",
                ImagePath = "C:/Users/testUser/Images/image.jpg",
                LongDescription = "Long description of band",
                ShortDescription = "Short description of band"
            };
            
            //Act
            var id = _fixture.Facade.Create(band);

            //Assert
            var bandStored = _fixture.Repository.GetById(id);

            var storedBandToModel = bandStored.Adapt<BandDetailModel>();

            Assert.Equal(band, storedBandToModel, BandDetailModel.BandDetailModelComparer);
        }


        [Fact]
        public void GetAll()
        {
            //Arrange
            var bandList = _fixture.SeedDataBands();
            bandList = bandList.OrderBy(a => a.Id).ToList();

            //Act
            var storedBands = _fixture.Facade.GetAll();
            storedBands = storedBands.OrderBy(a => a.Id).ToList();


            //Assert

            Assert.Equal(bandList.Count, storedBands.Count);

            for (var i = 0; i < bandList.Count; i++)
                Assert.Equal(
                    bandList[i].Adapt<BandListModel>(),
                    storedBands[i],
                    BandListModel.NameImagePathComparer);
        }


        [Fact]
        public void GetById()
        {
            //Arrange
            var bandList = _fixture.SeedDataBands();

            foreach (var band in bandList)
            {
                //Act
                var storedBand = _fixture.Facade.GetById(band.Id);

                //Assert
                Assert.Equal(band, storedBand, BandDetailModel.BandDetailModelComparer);
            }
        }

        [Fact]
        public void DeleteById()
        {
            //Arrange
            var bandList = _fixture.SeedDataBands();

            foreach (var band in bandList)
            {
                //Act
                _fixture.Facade.Delete(band.Id);

                var storedBand = _fixture.Repository.GetById(band.Id);

                //Assert
                Assert.Equal(default, storedBand);
            }
        }

        [Fact]
        public void Delete()
        {
            //Arrange
            var bandList = _fixture.SeedDataBands();

            foreach (var band in bandList)
            {
                //Act
                _fixture.Facade.Delete(band);
                
                var storedBand = _fixture.Repository.GetById(band.Id);


                //Assert
                Assert.Equal(default, storedBand);
            }
        }


        [Fact]
        public void Update()
        {
            //Arrange
            var bandList = _fixture.SeedDataBands();

            foreach (var band in bandList)
            {
                band.ImagePath += "Updated";
                band.Country += "Updated";
                band.Genre += "Updated";
                band.LongDescription += "Updated";
                band.ShortDescription += "Updated";
                band.Name += "Updated";

                //Act
                _fixture.Facade.Update(band);

                //Assert
                var storedBand = _fixture.Repository.GetById(band.Id).Adapt<BandDetailModel>();

                Assert.Equal(band, storedBand, BandDetailModel.BandDetailModelComparer);
            }
        }
    }
}