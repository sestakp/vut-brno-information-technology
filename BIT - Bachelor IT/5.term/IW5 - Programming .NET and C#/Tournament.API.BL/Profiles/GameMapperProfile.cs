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
    public class GameMapperProfile : ProfileBase<GameEntity, GameDetailModel, GameListModel, GameFormModel, GameFormDefaultModel>
    {
        public GameMapperProfile()
        {

            CreateMap<GameEntity, GameDetailModel>()
                    .ForMember(dest => dest.TeamBlueName,
                        opt => opt.MapFrom(src => src.TeamBlue.Name))
                    .ForMember(dest => dest.TeamBlueImage,
                        opt => opt.MapFrom(src => src.TeamBlue.ImagePath))
                    .ForMember(dest => dest.TeamRedName,
                        opt => opt.MapFrom(src => src.TeamRed.Name))
                    .ForMember(dest => dest.TeamRedImage,
                        opt => opt.MapFrom(src => src.TeamRed.ImagePath))
                    .ForMember(dest => dest.TournamentVenueName,
                        opt => opt.MapFrom(src => src.TournamentVenue.Name))
                    .ForMember(dest => dest.TeamBluePlayers,
                        opt => opt.MapFrom(src => src.TeamBlue.Players))
                    .ForMember(dest => dest.TeamRedPlayers,
                        opt => opt.MapFrom(src => src.TeamRed.Players));


        }
    }
}
