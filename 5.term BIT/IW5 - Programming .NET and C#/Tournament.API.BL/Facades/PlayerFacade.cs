﻿using AutoMapper;
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
    public class PlayerFacade : FacadeBaseWithMedia<PlayerDetailModel, PlayerListModel, PlayerFormModel, PlayerFormDefaultModel, PlayerEntity>, IPlayerFacade
    {
        public PlayerFacade(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment env) : base(unitOfWork, mapper, Entities.Player, env)
        {
        }

        protected override IList<PlayerListModel> GetListModels(IList<PlayerListModel> listModels)
        {
            var teams = UnitOfWork.TeamRepository.GetAll().ToList();
            foreach (var listModel in listModels)
            {
                listModel.TeamName = teams.FirstOrDefault(team => team.Id == listModel.TeamEntityId)?.Name;
            }
            return base.GetListModels(listModels);
        }

        public override PlayerFormDefaultModel GetDefaultFormModel()
        {
            
            var defaultModel = base.GetDefaultFormModel();
            defaultModel.Teams = Mapper.Map<IList<SelectModel>>(UnitOfWork.TeamRepository.GetSelectModels());
            return defaultModel;
        }
    }
}