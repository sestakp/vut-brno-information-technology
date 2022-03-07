using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Tournament.API.BL.Facades.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Facades.Factories
{
    public class FacadeAbstractFactory : IFacadeAbstractFactory
    {
        protected readonly IMapper Mapper;
        protected readonly IUnitOfWorkFactory UnitOfWorkFactory;
        protected readonly IWebHostEnvironment Environment;

        public FacadeAbstractFactory(IUnitOfWorkFactory unitOfWorkFactory, IMapper mapper, IWebHostEnvironment env)
        {
            UnitOfWorkFactory = unitOfWorkFactory;
            Mapper = mapper;
            Environment = env;
        }

        public GameFacade CreateGameFacade()
        {
            var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            return new GameFacade(unitOfWork, Mapper);
        }

        public SearchFacade CreateSearchFacade()
        {
            var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            return new SearchFacade(unitOfWork, Mapper);
        }

        public PlayerFacade CreatePlayerFacade()
        {
            var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            return new PlayerFacade(unitOfWork, Mapper, Environment);
        }

        public TeamFacade CreateTeamFacade()
        {
            var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            return new TeamFacade(unitOfWork, Mapper, Environment);
        }

        public TournamentVenueFacade CreateTournamentVenueFacade()
        {
            var unitOfWork = UnitOfWorkFactory.CreateUnitOfWork();
            return new TournamentVenueFacade(unitOfWork, Mapper);
        }
    }
}
