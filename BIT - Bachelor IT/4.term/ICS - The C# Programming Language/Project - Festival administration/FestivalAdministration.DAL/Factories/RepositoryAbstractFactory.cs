using System;
using System.Collections.Generic;
using System.Text;
using FestivalAdministration.DAL.Interfaces;
using FestivalAdministration.DAL.Repositories;

namespace FestivalAdministration.DAL.Factories
{
    public class RepositoryAbstractFactory : IRepositoryAbstractFactory
    {
        public IBandRepository CreateBandRepository(FestivalAdministrationDbContext _context) {
            return new BandRepository(_context);
        }

        public IStageRepository CreateStageRepository(FestivalAdministrationDbContext _context) {
            return new StageRepository(_context);
        }
        public IEventRepository CreateEventRepository(FestivalAdministrationDbContext _context) {
            return new EventRepository(_context);
        }
    }
}
