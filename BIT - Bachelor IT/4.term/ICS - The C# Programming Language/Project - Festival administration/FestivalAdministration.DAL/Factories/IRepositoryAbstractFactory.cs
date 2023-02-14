using FestivalAdministration.DAL.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FestivalAdministration.DAL.Factories
{
    public interface IRepositoryAbstractFactory
    {
        IBandRepository CreateBandRepository(FestivalAdministrationDbContext _context);
        IStageRepository CreateStageRepository(FestivalAdministrationDbContext _context);
        IEventRepository CreateEventRepository(FestivalAdministrationDbContext _context);
    }
}
