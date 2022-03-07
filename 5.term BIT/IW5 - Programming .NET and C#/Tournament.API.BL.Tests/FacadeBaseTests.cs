using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Mapster;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Moq;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories;
using Xunit;

namespace Tournament.API.BL.Tests
{
    public class FacadeBaseTests : IClassFixture<FacadeBaseTestsFixture>, IDisposable
    {
        private readonly FacadeBaseTestsFixture _fixture;

        public FacadeBaseTests(FacadeBaseTestsFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public void Create()
        {
            //Arrange
            
            
            var team = _fixture.FormModelAbstractFactory.CreateTeamFormModel();

            //Act
            using var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade();
            var teamListModel = teamFacade.Add(team);

            //Assert

            var teamRepository = _fixture.RepositoryAbstractFactory.CreateTeamRepository(_fixture.DbContextFactory.CreateDbContext());
            var teamStored = teamRepository.GetById(teamListModel.Id);

            var storedTeamToModel = _fixture.Mapper.Map<TeamListModel>(teamStored);

            Assert.Equal(teamListModel, storedTeamToModel, TeamListModel.TeamListModelComparer); 
        }

        [Fact]
        public void Remove()
        {
            //Arrange
            using var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var teamEntity = _fixture.EntityAbstractFactory.CreateTeamEntity();
            teamEntity = unitOfWork.TeamRepository.Insert(teamEntity);
            unitOfWork.Commit();

            //Act
            using var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade();
            teamFacade.Remove(teamEntity.Id);
            
            //Assert
            var returnedEntity = unitOfWork.TeamRepository.GetById(teamEntity.Id);

            Assert.Null(returnedEntity);
        }

        [Fact]
        public void GetById()
        {
            //Arrange
            using var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var teamEntity = _fixture.EntityAbstractFactory.CreateTeamEntity();
            teamEntity = unitOfWork.TeamRepository.Insert(teamEntity);
            unitOfWork.Commit();

            var teamDetailModel = _fixture.Mapper.Map<TeamDetailModel>(unitOfWork.TeamRepository.GetById(teamEntity.Id));

            //Act
            using var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade();
            var returnedTeamDetailModel = teamFacade.GetById(teamEntity.Id);

            //Assert
            Assert.NotNull(returnedTeamDetailModel);
            Assert.Equal(teamDetailModel, returnedTeamDetailModel, TeamDetailModel.TeamDetailModelComparer);
        }

        [Fact]
        public void Update()
        {
            //Arrange

            var teamEntity = _fixture.EntityAbstractFactory.CreateTeamEntity();
            using (var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork())
            {
                teamEntity = unitOfWork.TeamRepository.Insert(teamEntity);
                unitOfWork.Commit();
            }

            var teamFormModel = _fixture.Mapper.Map<TeamFormModel>(teamEntity);

            //Act
            teamFormModel.Description += " UPDATED";
            teamFormModel.Name += " UPDATED";

            using var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade();
            var teamListModel = teamFacade.Update(teamFormModel);

            //Assert
            using (var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork())
            {
                var returnedFormModel = _fixture.Mapper.Map<TeamListModel>(unitOfWork.TeamRepository.GetById(teamFormModel.Id));
                Assert.Equal(teamListModel, returnedFormModel, TeamListModel.TeamListModelComparer);
            }
        }


        [Fact]
        public void GetAll()
        {
            //Arrange
            var playerList = _fixture.SeedPlayers();
            
            //Act

            using var playerFacade = _fixture.FacadeAbstractFactory.CreatePlayerFacade();
            
            var returnedPlayers = playerFacade.GetAll();


            //Assert
           
           Assert.Equal(playerList, returnedPlayers, PlayerListModel.PlayerListModelComparer);
        }

        [Fact]
        public void GetFormDefaultModel()
        {
            //Arrange
            var teamList = _fixture.SeedTeams();

            //Act

            using var playerFacade = _fixture.FacadeAbstractFactory.CreatePlayerFacade();

            var returnedFormDefaultModel = playerFacade.GetDefaultFormModel();
            

            //Assert
            Assert.NotNull(returnedFormDefaultModel);
            Assert.NotEmpty(returnedFormDefaultModel.Teams);
            Assert.Equal(teamList.Count, returnedFormDefaultModel.Teams.Count);

        }

        [Fact]
        public void TestAddMedia()
        {
            //Arrange
            var team = _fixture.FormModelAbstractFactory.CreateTeamFormModel();
            team.Image = _fixture.MockFile();

            TeamDetailModel returnedTeam = null;
            //Act


            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                var teamListModel = teamFacade.Add(team);
                

                //Assert
                returnedTeam = teamFacade.GetById(teamListModel.Id);
            }


            Assert.NotNull(returnedTeam.ImagePath);

            var imagePath = returnedTeam.ImagePath;
            imagePath = imagePath.Replace("/", "\\");

            var path = _fixture.WebHostEnvironmentMock.Object.WebRootPath + imagePath;
            
            Assert.True(File.Exists(path));

            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                teamFacade.Remove(returnedTeam.Id);
            }

            Assert.False(File.Exists(path));


        }

        public void Dispose()
        {
            _fixture.Dispose();
        }
    }
}