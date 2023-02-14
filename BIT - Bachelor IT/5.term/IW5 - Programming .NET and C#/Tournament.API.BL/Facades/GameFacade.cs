using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Tournament.API.BL.Facades.Interfaces;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.BL.Models.SelectModels;
using Tournament.API.Common.Enums;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Repositories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Factories.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.BL.Facades
{
    public class GameFacade : FacadeBase<GameDetailModel, GameListModel, GameFormModel, GameFormDefaultModel, GameEntity>, IGameFacade
    {
        
        public GameFacade(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper, Entities.Game)
        {
        }

        protected bool validSlotModel(GameFormModel formModel)
        {
            if (formModel.Start > formModel.End) return false;

            
            if ( !UnitOfWork.GameRepository.CurrentSlotIsEmpty(Mapper.Map<GameEntity>(formModel)))
            {
                return false;
            }

            return true;
        }

        public override GameListModel Add(GameFormModel formModel)
        {
           if( !validSlotModel(formModel))
            {
                return null;
            }
            
           var listModel = base.Add(formModel);

            var model = UnitOfWork.GameRepository.GetById(listModel.Id);
            return Mapper.Map<GameListModel>(model);
        }

        public override GameListModel Update(GameFormModel formModel)
        {
            if (!validSlotModel(formModel))
            {
                return null;
            }
            var listModel = base.Update(formModel);
            var model = UnitOfWork.GameRepository.GetById(listModel.Id);
            return Mapper.Map<GameListModel>(model);
        }

        public override GameFormDefaultModel GetDefaultFormModel()
        {
            var gameFormDefaultModel = base.GetDefaultFormModel();
            gameFormDefaultModel.Teams = Mapper.Map<IList<SelectModel>>(UnitOfWork.TeamRepository.GetSelectModels());
            gameFormDefaultModel.TournamentVenues = Mapper.Map<IList<SelectModel>>(UnitOfWork.TournamentVenueRepository.GetSelectModels());
            return gameFormDefaultModel;
        }
    }
}
