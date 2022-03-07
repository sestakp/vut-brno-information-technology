using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.Interfaces;
using Tournament.API.BL.Models.ResultModels;

namespace Tournament.API.BL.Facades.Interfaces
{
    public interface ISearchFacade : IFacadeBase
    {
        SearchModel SearchData(string searchValue);
    }
}
