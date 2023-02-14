using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.Common.Interfaces;
using Tournament.API.DAL.UnitOfWork.Interfaces;

namespace Tournament.API.DAL.UnitOfWork.Factories.Interfaces
{
    public interface IUnitOfWorkFactory : IFactory
    {
        IUnitOfWork CreateUnitOfWork();
    }
}
