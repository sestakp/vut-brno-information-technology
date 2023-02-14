using System;
using System.Collections.Generic;
using System.Text;

namespace FestivalAdministration.DAL.Interfaces
{
    public interface IUnitOfWork :IDisposable
    {
        IBandRepository BandRepository { get; }
        IEventRepository EventRepository { get; }
        IStageRepository StageRepository { get; }
        void Commit();
    }
}
