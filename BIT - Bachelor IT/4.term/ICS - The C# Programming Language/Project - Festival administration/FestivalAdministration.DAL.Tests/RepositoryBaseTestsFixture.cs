using System.Collections.Generic;
using System.Linq;
using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using FestivalAdministration.DAL.Repositories;

namespace FestivalAdministration.DAL.Tests
{
    public class RepositoryBaseTestsFixture : FestivalAdministrationDbContextSetupFixture
    {
        //name of is name for InMemoryDatabase
        public RepositoryBaseTestsFixture() : base(nameof(RepositoryBaseTestsFixture))
        {
            Repository = new BandRepository(DbContextFactory.CreateDbContext());
        }


        public IAppRepository<BandEntity> Repository { get; }

        public IList<BandEntity> SeedDataBands()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            var bandList = new List<BandEntity>();
            for (var i = 0; i < 50; i++)
            {
                var band = new BandEntity
                {
                    Country = $"Czech{i}",
                    Genre = $"Rock{i}",
                    Name = $"Name{i}",
                    ImagePath = $"C:/Users/testUser/Images/image{i}.jpg",
                    LongDescription = $"Long description of band{i}",
                    ShortDescription = $"Short description of band{i}"
                };
                bandList.Add(band);
                dbContext.Bands.Add(band);
            }

            dbContext.SaveChanges();
            return bandList;
        }

        public void ClearDataBands()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            foreach (var entity in dbContext.Bands.ToList()) dbContext.Bands.Remove(entity);

            dbContext.SaveChanges();
        }
    }
}