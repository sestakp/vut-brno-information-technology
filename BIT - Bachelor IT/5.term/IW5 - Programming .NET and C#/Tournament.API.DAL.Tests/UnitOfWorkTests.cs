using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Entities;
using Xunit;

namespace Tournament.API.DAL.Tests
{
    public class UnitOfWorkTests : IClassFixture<UnitOfWorkTestsFixture>, IDisposable
    {
        private readonly UnitOfWorkTestsFixture _fixture;
        public UnitOfWorkTests(UnitOfWorkTestsFixture fixture)
        {
            _fixture = fixture;
            _fixture.PrepareDatabase();
            _fixture.ClearData();
        }

        [Fact]
        public void GetAll()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            _fixture.SeedDataPersons();

            //Act
            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var result = unitOfWork.PlayerRepository.GetAll();

            //Assert
            Assert.NotEmpty(result);
            Assert.Equal(result, dbContext.Players, PlayerEntity.PlayerEntityComparer);
        }

        [Fact]
        public void GetByID()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var teamEntity = dbContext.Teams.Add(_fixture.EntityAbstractFactory.CreateTeamEntity());
            dbContext.SaveChanges();

            //Act

            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var foundPerson = unitOfWork.TeamRepository.GetById(teamEntity.Entity.Id);

            //Assert
            Assert.NotNull(foundPerson);
            Assert.Equal(foundPerson, dbContext.Teams.FirstOrDefault(x => x.Id == teamEntity.Entity.Id), TeamEntity.TeamEntityComparer);
        }

        [Fact]
        public void InsertWithCommit()
        {
            //Arrange
            using var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();

            //Act

            for (var i = 0; i < 3; i++)
            {
                unitOfWork.PlayerRepository.Insert(_fixture.EntityAbstractFactory.CreatePlayerEntity(i));
            }

            unitOfWork.Commit();

            //Assert

            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            Assert.Equal(3, dbContext.Players.Count());
        }

        [Fact]
        public void UpdateWithCommit()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var person = _fixture.EntityAbstractFactory.CreatePlayerEntity();
            var personEntity = dbContext.Players.Add(person);
            dbContext.SaveChanges();
            person.Description = "New description";

            //Act 

            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            unitOfWork.PlayerRepository.Update(person);
            unitOfWork.Commit();

            //Assert
            Assert.Equal(person, dbContext.Players.FirstOrDefault(x => x.Id == personEntity.Entity.Id), PlayerEntity.PlayerEntityComparer);
        }

        [Fact]
        public void DeleteWithCommit()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var team = _fixture.EntityAbstractFactory.CreateTeamEntity();
            var teamEntity = dbContext.Teams.Add(team);
            dbContext.SaveChanges();

            //Act 
            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            unitOfWork.PlayerRepository.Delete(team.Id);
            unitOfWork.Commit();

            //Assert
            Assert.Equal(0, dbContext.Players.Count());
        }

        [Fact]
        public void Find()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            _fixture.SeedDataPersons();

            //Act
            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var result = unitOfWork.PlayerRepository.Find(x => x.Name.Equals("Name42"));

            //Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public void GetSelectModels()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            _fixture.SeedDataPersons();

            //Act
            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();
            var result = unitOfWork.PlayerRepository.GetSelectModels();

            //Assert
            Assert.NotEmpty(result);
        }

        [Fact]
        public void CurrentSlotIsEmpty()
        {
            //Arrange
            using var dbContext = _fixture.DbContextFactory.CreateDbContext();
            var gameBase = _fixture.EntityAbstractFactory.CreateGameEntity();
            gameBase.Start = new DateTime(2021, 1, 2, 0, 0, 0);
            gameBase.End = new DateTime(2021, 1, 3, 0, 0, 0);

            var gameInsideInterval = _fixture.EntityAbstractFactory.CreateGameEntity();
            gameInsideInterval.Start = new DateTime(2021, 1, 2, 1, 0, 0);
            gameInsideInterval.End = new DateTime(2021, 1, 2, 23, 0, 0);

            var gameLeftOverlap = _fixture.EntityAbstractFactory.CreateGameEntity();
            gameLeftOverlap.Start = new DateTime(2021, 1, 1, 0, 0, 0);
            gameLeftOverlap.End = new DateTime(2021, 1, 2, 1, 0, 0);

            var gameRightOverlap = _fixture.EntityAbstractFactory.CreateGameEntity();
            gameRightOverlap.Start = new DateTime(2021, 1, 2, 1, 0, 0);
            gameRightOverlap.End = new DateTime(2021, 1, 4, 0, 0, 0);

            var gameSameInterval = _fixture.EntityAbstractFactory.CreateGameEntity();
            gameSameInterval.Start = new DateTime(2021, 1, 2, 0, 0, 0);
            gameSameInterval.End = new DateTime(2021, 1, 3, 0, 0, 0);

            var games = new List<GameEntity>
            {
                gameInsideInterval,
                gameLeftOverlap,
                gameRightOverlap,
                gameSameInterval
            };

            //Act
            var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();

            foreach (var game in games)
            {
                dbContext.Games.Add(game);
                dbContext.SaveChanges();

                //Assert
                Assert.False(unitOfWork.GameRepository.CurrentSlotIsEmpty(gameBase));
                dbContext.Games.Remove(game);
            }
        }


        public void Dispose()
        {
            _fixture.ClearData();
            _fixture.TearDownDatabase();
        }
    }
}
