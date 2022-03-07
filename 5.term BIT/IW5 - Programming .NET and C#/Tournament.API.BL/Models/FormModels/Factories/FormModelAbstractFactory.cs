using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.BL.Models.FormModels.Factories.Interfaces;

namespace Tournament.API.BL.Models.FormModels.Factories
{
    public class FormModelAbstractFactory : IFormModelAbstractFactory
    {
        public GameFormModel CreateGameFormModel(int index = 0)
        {
            return new GameFormModel();
        }

        public PlayerFormModel CreatePersonFormModel(int index = 0)
        {
            return new PlayerFormModel
            {
                Description = $"Description {index}",
                ImagePath = $"Image path {index}",
                Surname = $"Surname {index}",
                Name = $"Name {index}"
            };
        }

        public TeamFormModel CreateTeamFormModel(int index = 0)
        {
            return new TeamFormModel
            {
                Description = $"Description {index}",
                Country = $"Country {index}",
                ImagePath = $"Image path {index}",
                Name = $"Name {index}"
            };
        }

        public TournamentVenueFormModel CreateTournamentVenueFormModel(int index = 0)
        {
            return new TournamentVenueFormModel
            {
                Description = $"Description {index}",
                Name = $"Name {index}"
            };
        }
    }
}
