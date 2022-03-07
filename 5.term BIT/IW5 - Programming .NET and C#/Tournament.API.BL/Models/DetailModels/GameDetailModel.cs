using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.ListModels;

namespace Tournament.API.BL.Models.DetailModels
{
    public class GameDetailModel : IDetailModel
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public Guid TeamRedId { get; set; }
        public string TeamRedName { get; set; }
        public string TeamRedPoints { get; set; }
        public string TeamRedImage { get; set; }
        public IList<PlayerListModel> TeamRedPlayers { get; set; }
        public Guid TeamBlueId { get; set; }
        public string TeamBlueName { get; set; }
        public string TeamBluePoints { get; set; }
        public string TeamBlueImage { get; set; }
        public IList<PlayerListModel> TeamBluePlayers { get; set; }
        public string? TournamentVenueName { get; set; }
        public Guid TournamentVenueId { get; set; }

    }
}
