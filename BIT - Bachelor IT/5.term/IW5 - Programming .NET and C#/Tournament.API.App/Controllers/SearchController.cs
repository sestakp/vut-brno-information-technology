using Microsoft.AspNetCore.Mvc;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.Interfaces;
using Tournament.API.BL.Models.ResultModels;

namespace Tournament.API.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : Controller
    {
        protected readonly ISearchFacade SearchFacade;

        public SearchController(ISearchFacade searchFacade)
        {
            SearchFacade = searchFacade;
        }

        [HttpGet("Filter")]
        public ActionResult<SearchModel> Search(string searchValue)
        {
            return new ActionResult<SearchModel>(SearchFacade.SearchData(searchValue));
        }
    }
}
