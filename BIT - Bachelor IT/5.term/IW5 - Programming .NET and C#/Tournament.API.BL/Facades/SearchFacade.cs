using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.Interfaces;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.BL.Models.ResultModels;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Facades
{
    public class SearchFacade : ISearchFacade
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IMapper Mapper;


        public SearchFacade(IUnitOfWork unitOfWork, IMapper mapper)
        {
            UnitOfWork = unitOfWork;
            Mapper = mapper;
        }

        public SearchModel SearchData(string searchValue)
        {
            var searchModel = new SearchModel();
            searchValue = searchValue.ToLower();
            

            searchModel.Teams = Mapper.Map<List<TeamListModel>>(UnitOfWork.TeamRepository
                .Find(team =>
                    {
                        if (team.Name != null && team.Name.ToLower().Contains(searchValue)) return true;
                        if (team.Description != null && team.Description.ToLower().Contains(searchValue)) return true;
                        return team.Country != null && team.Country.ToLower().Contains(searchValue);
                    }));

            searchModel.Players = Mapper.Map<List<PlayerListModel>>(UnitOfWork.PlayerRepository
                .Find(person =>
                    {
                        if (person.Name.ToLower().Contains(searchValue)) return true;
                        if (person.Surname.ToLower().Contains(searchValue)) return true;
                        if (person.Nickname != null && person.Nickname.ToLower().Contains(searchValue)) return true;
                        return person.Description != null && person.Description.ToLower().Contains(searchValue);
                    }));

            searchModel.TournamentVenues = Mapper.Map<List<TournamentVenueListModel>>(UnitOfWork.TournamentVenueRepository
                .Find(tournamentVenue =>
                    {
                        if (tournamentVenue.Name != null && tournamentVenue.Name.ToLower().Contains(searchValue)) return true;
                        return tournamentVenue.Description != null && tournamentVenue.Description.ToLower().Contains(searchValue);
                    }));

            return searchModel;
        }

        public void Dispose()
        {
        }
    }
}
