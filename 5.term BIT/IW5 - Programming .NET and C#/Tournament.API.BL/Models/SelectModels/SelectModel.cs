using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.SelectModels.Interfaces;

namespace Tournament.API.BL.Models.SelectModels
{
    public class SelectModel : ISelectModel
    {
        public Guid Id { get; set; }
        public string? SelectText { get; set; }
    }
}
