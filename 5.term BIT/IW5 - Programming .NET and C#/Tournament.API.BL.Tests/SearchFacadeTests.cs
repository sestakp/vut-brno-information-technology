using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.DAL.Entities;
using Xunit;

namespace Tournament.API.BL.Tests
{
    public class SearchFacadeTests : IClassFixture<FacadeBaseTestsFixture>, IDisposable
    {
        private readonly FacadeBaseTestsFixture _fixture;

        public SearchFacadeTests(FacadeBaseTestsFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public void SearchData()
        {
            //Arrange
            using var unitOfWork = _fixture.UnitOfWorkFactory.CreateUnitOfWork();

            for (var i = 0; i < _fixture.ITERATION_MAX; i++)
            {
                var person = _fixture.EntityAbstractFactory.CreatePlayerEntity(i); 
                var team = _fixture.EntityAbstractFactory.CreateTeamEntity(i);
                var tournamentVenue = _fixture.EntityAbstractFactory.CreateTournamentVenueEntity(i);
                
                if (i % 10 == 0)
                {
                    person.Name = "SearchName";
                    team.Country = "SearchCountry";
                    tournamentVenue.Description = "SearchDescription";
                }

                unitOfWork.PlayerRepository.Insert(person);
                unitOfWork.TeamRepository.Insert(team);
                unitOfWork.TournamentVenueRepository.Insert(tournamentVenue);
            }

            unitOfWork.Commit();


            //Act
            using var searchFacade = _fixture.FacadeAbstractFactory.CreateSearchFacade();
            var searchResult = searchFacade.SearchData("search");

            //Assert
            Assert.Equal(5, searchResult.Players.Count);
            Assert.Equal(5, searchResult.Teams.Count);
            Assert.Equal(5, searchResult.TournamentVenues.Count);
        }


        public void Dispose()
        {
            _fixture.Dispose();
        }
    }
}
