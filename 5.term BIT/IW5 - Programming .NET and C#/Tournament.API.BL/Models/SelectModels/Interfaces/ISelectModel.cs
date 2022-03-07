using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.BL.Models.SelectModels.Interfaces
{
    interface ISelectModel
    {
        Guid Id { get; set; }
        public string SelectText { get; set; }
    }
}
