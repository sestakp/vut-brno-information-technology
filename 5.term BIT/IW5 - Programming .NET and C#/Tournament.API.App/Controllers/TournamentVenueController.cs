using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;

namespace Tournament.API.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentVenueController : BaseController<TournamentVenueDetailModel, TournamentVenueListModel, TournamentVenueFormModel, TournamentVenueFormDefaultModel>
    {
        public TournamentVenueController(IFacadeBase<TournamentVenueDetailModel, TournamentVenueListModel, TournamentVenueFormModel, TournamentVenueFormDefaultModel> facade) : base(facade)
        {
        }
    }
}
