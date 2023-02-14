using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.BL.Models.FormModels.Factories.Interfaces
{
    public interface IFormModelAbstractFactory
    {
        GameFormModel CreateGameFormModel(int index = 0);
        PlayerFormModel CreatePersonFormModel(int index = 0);
        TeamFormModel CreateTeamFormModel(int index = 0);
        TournamentVenueFormModel CreateTournamentVenueFormModel(int index = 0);
    }
}
