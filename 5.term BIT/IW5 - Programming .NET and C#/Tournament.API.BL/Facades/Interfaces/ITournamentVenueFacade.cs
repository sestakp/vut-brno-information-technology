using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;

namespace Tournament.API.BL.Facades.Interfaces
{
    public interface ITournamentVenueFacade : IFacadeBase<TournamentVenueDetailModel, TournamentVenueListModel, TournamentVenueFormModel, TournamentVenueFormDefaultModel>
    {
    }
}
