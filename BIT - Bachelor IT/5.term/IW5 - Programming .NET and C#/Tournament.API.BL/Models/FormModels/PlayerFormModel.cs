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
    public class PlayerFormModel : IFormModel, IImage
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Surname { get; set; } = null!;
        public string? Nickname { get; set; }
        public string? ImagePath { get; set; }
        public string? Description { get; set; }
        public Guid TeamEntityId { get; set; }
        public IFormFile? Image { get; set; }
        public static IEqualityComparer<PlayerFormModel> PlayerFormModelComparer { get; } = new PlayerFormModelEqualityComparer();
        private sealed class PlayerFormModelEqualityComparer : IEqualityComparer<PlayerFormModel>
        {
            public bool Equals(PlayerFormModel x, PlayerFormModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Surname == y.Surname && x.ImagePath == y.ImagePath && x.Description == y.Description;
            }

            public int GetHashCode(PlayerFormModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Surname, obj.ImagePath, obj.Description, obj.TeamEntityId, obj.Image);
            }
        }

    }

}
