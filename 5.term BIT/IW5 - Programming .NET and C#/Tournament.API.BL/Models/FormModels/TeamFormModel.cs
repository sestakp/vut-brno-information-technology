using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Tournament.API.BL.Models.FormModels.Interfaces;
using Tournament.API.Common.Interfaces;

namespace Tournament.API.BL.Models.FormModels
{
    public class TeamFormModel : IFormModel, IImage
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public IFormFile? Image { get; set; }
        public string? ImagePath { get; set; }

        private sealed class TeamFormModelEqualityComparer : IEqualityComparer<TeamFormModel>
        {
            public bool Equals(TeamFormModel x, TeamFormModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Description == y.Description && x.Country == y.Country && Equals(x.Image, y.Image) && x.ImagePath == y.ImagePath;
            }

            public int GetHashCode(TeamFormModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Description, obj.Country, obj.Image, obj.ImagePath);
            }
        }

        public static IEqualityComparer<TeamFormModel> TeamFormModelComparer { get; } = new TeamFormModelEqualityComparer();
    }
}
