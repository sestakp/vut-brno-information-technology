using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.DAL.Database.Factories.Interfaces
{
    public interface IDbContextFactory
    {
        TournamentDbContext CreateDbContext();
    }
}
