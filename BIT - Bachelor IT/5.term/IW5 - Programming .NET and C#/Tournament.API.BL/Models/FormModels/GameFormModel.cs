using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormModels.Interfaces;

namespace Tournament.API.BL.Models.FormModels
{
    public class GameFormModel : IFormModel
    {
        public Guid Id { get; set; }
        public Guid TeamRedId { get; set; }
        public Guid TeamBlueId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public int? TeamRedPoints { get; set; }
        public int? TeamBluePoints { get; set; }
        public Guid TournamentVenueId { get; set; }
    }
}
