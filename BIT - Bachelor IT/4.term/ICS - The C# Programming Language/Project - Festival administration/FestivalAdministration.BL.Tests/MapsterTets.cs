using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FestivalAdministration.BL.ListModels;
using FestivalAdministration.BL.Models;
using FestivalAdministration.DAL.Entities;
using Mapster;
using Nemesis.Essentials.Runtime;
using Xunit;

namespace FestivalAdministration.BL.Tests
{
    public class MapsterTets
    {

        [Fact]
        public void MapBand()
        {
            //Arrange
            var id = Guid.NewGuid();

            var entity = new BandEntity
            {
                Id = id,
                Country = "Country",
                Events = new List<EventEntity>(),
                Genre = "Genre",
                ImagePath = "ImagePath",
                LongDescription = "Long Description",
                Name = "Name",
                ShortDescription = "Short Description"
            };

            var model = new BandDetailModel
            {
                Id = id,
                Country = "Country",
                Events = new List<EventDetailModel>(),
                Genre = "Genre",
                ImagePath = "ImagePath",
                LongDescription = "Long Description",
                Name = "Name",
                ShortDescription = "Short Description"
            };


            //Act
            var entityAdapted = model.Adapt<BandEntity>();
            entityAdapted.Events = model.Events.Adapt<List<EventEntity>>();

            var modelAdapted = entity.Adapt<BandDetailModel>();
            modelAdapted.Events = entity.Events.Adapt<List<EventDetailModel>>();

            //Assert
            Assert.Equal(entity,entityAdapted, BandEntity.BandEntityComparer);
            Assert.Equal(model, modelAdapted, BandDetailModel.BandDetailModelComparer);
        }


        [Fact]
        public void MapStage()
        {
            //Arrange
            var id = Guid.NewGuid();

            var entity = new StageEntity()
            {
                Id = id,
                Events = new List<EventEntity>(),
                ImagePath = "ImagePath",
                Name = "Name",
                Description = "Description"
            };

            var model = new StageDetailModel()
            {
                Id = id,
                Events = new List<EventDetailModel>(),
                ImagePath = "ImagePath",
                Name = "Name",
                Description = "Description"
            };


            //Act
            var entityAdapted = model.Adapt<StageEntity>();
            var modelAdapted = entity.Adapt<StageDetailModel>();


            //Assert
            Assert.Equal(entity, entityAdapted, StageEntity.StageEntityComparer);
            Assert.Equal(model, modelAdapted, StageDetailModel.StageDetailModelComparer);
        }




        [Fact]
        public void MapEvent()
        {
            //Arrange


            var stageEntity = new StageEntity()
            {
                Id = Guid.NewGuid(),
                ImagePath = "ImagePath",
                Name = "Name",
            };

            var stageModel = new StageListModel()
            {
                Id = stageEntity.Id,
                ImagePath = "ImagePath",
                Name = "Name",
            };

            var bandEntity = new BandEntity
            {
                Id = Guid.NewGuid(),
                ImagePath = "ImagePath",
                Name = "Name",
            };

            var bandModel = new BandListModel()
            {
                Id = bandEntity.Id,
                ImagePath = "ImagePath",
                Name = "Name",
            };


            var id = Guid.NewGuid();

            var entity = new EventEntity
            {
                Id = id,
                Start = new DateTime(2020,11,25,12,00,00),
                End = new DateTime(2020, 11, 25, 14, 00, 00),
                BandId = bandEntity.Id,
                Band = bandEntity,
                StageId = stageEntity.Id,
                Stage = stageEntity
            };

            var model = new EventDetailModel
            {
                Id = id,
                Start = new DateTime(2020, 11, 25, 12, 00, 00),
                End = new DateTime(2020, 11, 25, 14, 00, 00),
                BandId = bandModel.Id,
                Band = bandModel,
                StageId = stageModel.Id,
                Stage = stageModel
            };


            //Act
            var entityAdapted = model.Adapt<EventEntity>();
            var modelAdapted = entity.Adapt<EventDetailModel>();
            

            //Assert
            Assert.Equal(entity, entityAdapted, EventEntity.EventEntityComparer);
            Assert.Equal(model, modelAdapted, EventDetailModel.EventDetailModelComparer);
        }
    }
}
