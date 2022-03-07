using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.DAL.Entities;

namespace Tournament.API.DAL.Repositories.Interfaces
{
    public interface IGameRepository : IRepository<GameEntity>
    {
        public bool CurrentSlotIsEmpty(GameEntity entity);
    }
}
