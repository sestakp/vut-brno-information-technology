using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.ListModels.Interfaces;

namespace Tournament.API.BL.Models.ListModels
{
    public class GameListModel : IListModel
    {
        public Guid Id { get; set; }
        public Guid TeamRedId { get; set; }
        public TeamDetailModel? TeamRed { get; set; }
        public Guid TeamBlueId { get; set; }
        public TeamDetailModel? TeamBlue { get; set; }
        public Guid TournamentVenueId { get; set; }
        public TournamentVenueDetailModel? TournamentVenue { get; set; }

        public string TeamRedPoints { get; set; }
        public string TeamBluePoints { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
