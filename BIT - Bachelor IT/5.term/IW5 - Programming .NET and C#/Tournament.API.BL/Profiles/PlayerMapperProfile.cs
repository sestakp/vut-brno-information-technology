using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.DetailModels;
using Tournament.API.BL.Models.FormDefaultModels;
using Tournament.API.BL.Models.FormModels;
using Tournament.API.BL.Models.ListModels;
using Tournament.API.BL.Models.SelectModels;
using Tournament.API.DAL.Entities;

namespace Tournament.API.BL.Profiles
{
    public class PlayerMapperProfile : ProfileBase<PlayerEntity, PlayerDetailModel, PlayerListModel, PlayerFormModel, PlayerFormDefaultModel>
    {
        public PlayerMapperProfile()
        {

            CreateMap<PlayerEntity, PlayerDetailModel>()
                    .ForMember(dest => dest.TeamName,
                        opt => opt.MapFrom(src => src.Team.Name));
        }
    }
}
