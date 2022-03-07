using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels.Interfaces;

namespace Tournament.API.BL.Models.DetailModels
{
    public class TournamentVenueDetailModel : IDetailModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public IList<GameDetailModel> Games { get; set; } = new List<GameDetailModel>();
    }
}
