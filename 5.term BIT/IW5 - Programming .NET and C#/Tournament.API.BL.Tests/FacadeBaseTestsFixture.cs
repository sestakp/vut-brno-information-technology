using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Moq;
using Tournament.API.BL.Facades;
using Tournament.API.BL.Facades.Factories;
using Tournament.API.BL.Facades.Factories.Interfaces;
using Tournament.API.BL.Models.FormModels.Factories;
using Tournament.API.BL.Models.FormModels.Factories.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.BL.Profiles;
using Tournament.API.DAL.Repositories;
using Tournament.API.DAL.Tests;
using Tournament.API.DAL.UnitOfWork;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Tests
{
    public class FacadeBaseTestsFixture : UnitOfWorkTestsFixture
    {
        public int ITERATION_MAX = 50;
        public FacadeBaseTestsFixture()
        {
            FormModelAbstractFactory = new FormModelAbstractFactory();

            var config = new MapperConfiguration(opts =>
            {
                opts.AddProfile<GameMapperProfile>();
                opts.AddProfile<FormSelectProfile>();
                opts.AddProfile<PlayerMapperProfile>();
                opts.AddProfile<TeamMapperProfile>();
                opts.AddProfile<TournamentVenueMapperProfile>();
            });

            Mapper = new Mapper(config);
            WebHostEnvironmentMock = new Mock<IWebHostEnvironment>();
            WebHostEnvironmentMock.Setup(m => m.WebRootPath)
                .Returns("./");
            FacadeAbstractFactory = new FacadeAbstractFactory(UnitOfWorkFactory, Mapper, WebHostEnvironmentMock.Object);
        }
        
        public IFormModelAbstractFactory FormModelAbstractFactory { get; }
        public IMapper Mapper { get; }
        public IFacadeAbstractFactory FacadeAbstractFactory { get; }

        public Mock<IWebHostEnvironment> WebHostEnvironmentMock { get; }

        public List<PlayerListModel> SeedPlayers()
        {
            var personsList = new List<PlayerListModel>();
            using (var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork())
            {
                for (var i = 0; i < ITERATION_MAX; i++)
                {
                    var personEntity = EntityAbstractFactory.CreatePlayerEntity();

                    personEntity = unitOfWork.PlayerRepository.Insert(personEntity);

                    personsList.Add(Mapper.Map<PlayerListModel>(personEntity));
                }

                unitOfWork.Commit();
            }

            return personsList;
        }
        public List<TeamListModel> SeedTeams()
        {
            var personsList = new List<TeamListModel>();
            using (var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork())
            {
                for (var i = 0; i < ITERATION_MAX; i++)
                {
                    var teamEntity = EntityAbstractFactory.CreateTeamEntity();

                    teamEntity = unitOfWork.TeamRepository.Insert(teamEntity);

                    personsList.Add(Mapper.Map<TeamListModel>(teamEntity));
                }

                unitOfWork.Commit();
            }

            return personsList;
        }


        public IFormFile MockFile()
        {
            //Setup mock file using a memory stream
            var content = "Hello World from a Fake File";
            var fileName = "test.jpg";
            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(content);
            writer.Flush();
            stream.Position = 0;

            //create FormFile with desired data
            return new FormFile(stream, 0, stream.Length, "id_from_form", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/jpg",
            };

        }
    }
}
