using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.Common.Enums;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Facades
{
    public class TournamentVenueFacade : FacadeBase<TournamentVenueDetailModel, TournamentVenueListModel, TournamentVenueFormModel, TournamentVenueFormDefaultModel, TournamentVenueEntity>, ITournamentVenueFacade
    {
        public TournamentVenueFacade(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper, Entities.TournamentVenue)
        {
        }
    }
}
