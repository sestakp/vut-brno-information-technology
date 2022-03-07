using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.SelectModels;

namespace Tournament.API.BL.Models.FormDefaultModels
{
    public class PlayerFormDefaultModel : PlayerDetailModel, IFormDefaultModel
    {
        public IList<SelectModel> Teams { get; set; } = new List<SelectModel>();
    }
}
