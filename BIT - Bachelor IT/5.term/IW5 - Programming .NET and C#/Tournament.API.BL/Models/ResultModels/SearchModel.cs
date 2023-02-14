using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.BL.Models.ResultModels.Interfaces;

namespace Tournament.API.BL.Models.ResultModels
{
    public class SearchModel : IResultModel
    {
        public IList<TeamListModel> Teams { get; set; } = new List<TeamListModel>();

        public IList<PlayerListModel> Players { get; set; } = new List<PlayerListModel>();

        public IList<TournamentVenueListModel> TournamentVenues { get; set; } =
            new List<TournamentVenueListModel>();
    }
}
