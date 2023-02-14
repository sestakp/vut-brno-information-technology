using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Tournament.API.BL.Models.SelectModels;
using Tournament.API.DAL.Entities;

namespace Tournament.API.BL.Profiles
{
    public class FormSelectProfile : Profile
    {
        public FormSelectProfile()
        {
            CreateMap<SelectEntity, SelectModel>();
        }
    }
}
