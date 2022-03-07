using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.FormModels.Interfaces;

namespace Tournament.API.BL.Models.FormModels
{
    public class TournamentVenueFormModel : IFormModel
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public static IEqualityComparer<TournamentVenueFormModel> IdNameDescriptionComparer { get; } = new IdNameDescriptionEqualityComparer();

        private sealed class IdNameDescriptionEqualityComparer : IEqualityComparer<TournamentVenueFormModel>
        {
            public bool Equals(TournamentVenueFormModel x, TournamentVenueFormModel y)
            {
                if (ReferenceEquals(x, y)) return true;
                if (ReferenceEquals(x, null)) return false;
                if (ReferenceEquals(y, null)) return false;
                if (x.GetType() != y.GetType()) return false;
                return x.Id.Equals(y.Id) && x.Name == y.Name && x.Description == y.Description;
            }

            public int GetHashCode(TournamentVenueFormModel obj)
            {
                return HashCode.Combine(obj.Id, obj.Name, obj.Description);
            }
        }
    }
}
