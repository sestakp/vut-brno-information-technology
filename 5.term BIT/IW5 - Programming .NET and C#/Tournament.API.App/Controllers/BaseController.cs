using Microsoft.AspNetCore.Mvc;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels.Interfaces;
using Tournament.API.BL.Models.FormDefaultModels.Interfaces;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.BL.Models.ListModels.Interfaces;

namespace Tournament.API.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<TDetailModel, TListModel, TFormModel, TFormDefaultModel> : ControllerBase
    where TDetailModel : class, IDetailModel
    where TListModel : class, IListModel
    where TFormModel : class, IFormModel
    where TFormDefaultModel : class, IFormDefaultModel
    {
        protected readonly IFacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel> Facade;

        public BaseController(IFacadeBase<TDetailModel, TListModel, TFormModel, TFormDefaultModel> facade)
        {
            Facade = facade;
        }

        [HttpGet]
        public ActionResult<IList<TListModel>> GetAll()
        {
            return new ActionResult<IList<TListModel>>(Facade.GetAll());
        }

        [HttpGet("GetFormDefaultModel")]
        public ActionResult<TFormDefaultModel> GetFormDefaultModel()
        {
            return new ActionResult<TFormDefaultModel>(Facade.GetDefaultFormModel());
        }

        [HttpGet("GetById")]
        public ActionResult<TDetailModel> GetById(Guid id)
        {
            var model = Facade.GetById(id);

            if (model == null)
            {
                return NotFound();
            }

            return model;
        }

        [HttpPost]
        public ActionResult<TListModel> Create([FromForm] TFormModel formModel)
        {
            return Facade.Add(formModel);
        }

        [HttpPut]
        public ActionResult<TListModel> Update([FromForm] TFormModel formModel)
        {
            return Facade.Update(formModel);
        }

        [HttpDelete]
        public IActionResult Delete(Guid id)
        {
            Facade.Remove(id);
            return Ok();
        }
    }
}
