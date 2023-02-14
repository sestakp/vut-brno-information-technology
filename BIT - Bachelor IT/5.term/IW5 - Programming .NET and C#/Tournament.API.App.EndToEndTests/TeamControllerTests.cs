using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.ListModels;
using Xunit;

namespace Tournament.API.App.EndToEndTests
{
    public class TeamControllerTests : IClassFixture<TeamControllerTestsFixture>, IAsyncDisposable
    {
        private readonly TeamControllerTestsFixture _fixture;
        private readonly TournamentApiApplicationFactory application;
        private readonly Lazy<HttpClient> client;

        public TeamControllerTests(TeamControllerTestsFixture fixture)
        {
            _fixture = fixture;
            application = new TournamentApiApplicationFactory();
            client = new Lazy<HttpClient>(application.CreateClient());
        }

        [Fact]
        public async Task GetAllTeams_Returns_At_Last_One_Team()
        {
            //Arrange

            //Act
            var response = await client.Value.GetAsync("/api/Team");

            //Assert
            response.EnsureSuccessStatusCode();

            var recipes = await response.Content.ReadFromJsonAsync<ICollection<TeamListModel>>();
            Assert.NotNull(recipes);
            Assert.NotEmpty(recipes);
        }
        [Fact]
        public async Task GetTeamById_Returns_valid_team()
        {
            //Arrange

            //Act
            var response = await client.Value.GetAsync("/api/Team");

            //Assert
            response.EnsureSuccessStatusCode();

            var teams = await response.Content.ReadFromJsonAsync<ICollection<TeamListModel>>();
            Assert.NotNull(teams);
            Assert.NotEmpty(teams);
        }

        [Fact]
        public async Task GetFormDefaultModel()
        {
            //Arrange

            //Act
            var response = await client.Value.GetAsync("/Api/Player/GetFormDefaultModel");

            //Asssert
            response.EnsureSuccessStatusCode();

            var formDefaultModel = await response.Content.ReadFromJsonAsync<PlayerFormDefaultModel>();
            Assert.NotNull(formDefaultModel);
            Assert.NotEmpty(formDefaultModel.Teams);
        }

        [Theory]
        [InlineData("4a76d51e-c12e-4ad5-a289-08d9a2e80f6a")]
        [InlineData("f41d8c39-5202-4ab0-a28a-08d9a2e80f6a")]
        [InlineData("6f803a31-cdeb-4cbe-a28b-08d9a2e80f6a")]
        [InlineData("07e9a2b4-1d67-4e95-a28c-08d9a2e80f6a")]
        [InlineData("f7cc7832-13a6-40b1-a28d-08d9a2e80f6a")]
        [InlineData("2f62f3d2-fe74-49af-a28e-08d9a2e80f6a")]
        public async Task GetById(string id)
        {

            //Arrange
            var url = "/Api/Team/GetById?id=" + id;


            //Act
            var response = await client.Value.GetAsync(url);

            //Assert
            response.EnsureSuccessStatusCode();

            var detailModel = await response.Content.ReadFromJsonAsync<TeamDetailModel>();
            Assert.NotNull(detailModel);
            Assert.NotEmpty(detailModel.Players);
        }


        [Fact]
        public async Task Create()
        {
            //Arrange

            var teamFormModel = _fixture.FormModelAbstractFactory.CreateTeamFormModel();

            var data = new MultipartFormDataContent();
            data.Add(new StringContent(teamFormModel.Name), "name");
            data.Add(new StringContent(teamFormModel.Description), "description");
            data.Add(new StringContent(teamFormModel.Country), "country");

            //Act
            var response = await client.Value.PostAsync("/Api/Team", data);

            //Assert
            response.EnsureSuccessStatusCode();

            var listModel = await response.Content.ReadFromJsonAsync<TeamListModel>();
            Assert.NotNull(listModel);
            Assert.NotEqual(Guid.Empty, listModel.Id);


            //Clean up

            using var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade();
            teamFacade.Remove(listModel.Id);
        }

        [Fact]
        public async Task Update()
        {
            //Arrange
            var teamFormModel = _fixture.FormModelAbstractFactory.CreateTeamFormModel();
            teamFormModel.ImagePath = null;

            TeamListModel listModel;
            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                listModel = teamFacade.Add(teamFormModel);
            }

            teamFormModel.Id = listModel.Id;

            teamFormModel.Description += "UPDATED";
            teamFormModel.Country += "UPDATED";


            //Act

            var data = new MultipartFormDataContent();
            data.Add(new StringContent(teamFormModel.Id.ToString()), "id");
            data.Add(new StringContent(teamFormModel.Name), "name");
            data.Add(new StringContent(teamFormModel.Description), "description");
            data.Add(new StringContent(teamFormModel.Country), "country");

            var response = await client.Value.PutAsync("/Api/Team", data);

            //Assert
            response.EnsureSuccessStatusCode();

            var returnedListModel = await response.Content.ReadFromJsonAsync<TeamListModel>();
            Assert.NotNull(returnedListModel);
            Assert.Equal(_fixture.Mapper.Map<TeamListModel>(teamFormModel), returnedListModel, TeamListModel.TeamListModelComparer);


            //Clean up

            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                teamFacade.Remove(teamFormModel.Id);
            }

        }

        [Fact]
        public async Task Delete()
        {
            //Arrange
            var teamFormModel = _fixture.FormModelAbstractFactory.CreateTeamFormModel();
            TeamListModel teamListModel;
            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                teamListModel = teamFacade.Add(teamFormModel);
            }

            //Act
            var response = await client.Value.DeleteAsync("/Api/Team?id=" + teamListModel.Id);

            //Assert
            response.EnsureSuccessStatusCode();
            using (var teamFacade = _fixture.FacadeAbstractFactory.CreateTeamFacade())
            {
                var deletedTeam = teamFacade.GetById(teamListModel.Id);
                Assert.Null(deletedTeam);
            }

        }

        public async ValueTask DisposeAsync()
        {
            await application.DisposeAsync();
        }
    }
}