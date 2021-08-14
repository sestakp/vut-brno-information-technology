using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using System;
using System.Linq;

namespace FestivalAdministration.DAL.Repositories
{
    public class EventRepository : RepositoryBase<EventEntity>, IEventRepository
    {
        public EventRepository(FestivalAdministrationDbContext context) : base(context)
        { 
        }

        private bool ValidRecordForInsertOrUpdate(EventEntity entity)
        {
            if (entity.Start > entity.End) return false;

            var count = Context.Events
                .Where(record => (record.StageId == entity.StageId || record.BandId == entity.BandId) && record.Id != entity.Id)
                .Count(
                    record => (
                        (record.Start < entity.Start && record.End > entity.End) || //Inside interval
                        (entity.Start < record.Start && entity.End > record.Start) || // Left overlap
                        (entity.Start < record.End && entity.End > record.End) //Right overlat
                    )
                );

            return count == 0;
        }


        public override Guid Insert(EventEntity entity)
        {
            if (!ValidRecordForInsertOrUpdate(entity))
            {
                return Guid.Empty;
            }
            return base.Insert(entity);
        }

        public override Guid? Update(EventEntity entity)
        {
            if (!ValidRecordForInsertOrUpdate(entity))
            {
                return Guid.Empty;
            }
            return base.Update(entity);
        }
    }
}