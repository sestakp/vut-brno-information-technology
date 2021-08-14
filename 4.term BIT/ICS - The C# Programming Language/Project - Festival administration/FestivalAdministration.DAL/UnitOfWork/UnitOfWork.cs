using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;

namespace FestivalAdministration.DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FestivalAdministrationDbContext _context;
        private readonly IRepositoryAbstractFactory _repositoryAbstractFactory;

        private IBandRepository _bandRepository;
        private IStageRepository _stageRepository;
        private IEventRepository _eventRepository;

        public IBandRepository BandRepository
        {
            get
            {
                if (this._bandRepository == null)
                {
                    this._bandRepository = _repositoryAbstractFactory.CreateBandRepository(_context);
                }
                return _bandRepository;
            }
        }

        public IStageRepository StageRepository
        {
            get
            {
                if (this._stageRepository == null)
                {
                    this._stageRepository = _repositoryAbstractFactory.CreateStageRepository(_context);
                }
                return _stageRepository;
            }
        }

        public IEventRepository EventRepository
        {
            get
            {
                if (this._eventRepository == null)
                {
                    this._eventRepository = _repositoryAbstractFactory.CreateEventRepository(_context);
                }
                return _eventRepository;
            }
        }

        public UnitOfWork(IDbContextFactory contextFactory, IRepositoryAbstractFactory repositoryAbstractFactory)
        {
            _context = contextFactory.CreateDbContext();
            _repositoryAbstractFactory = repositoryAbstractFactory;
        }


        public void Commit()
        {
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
