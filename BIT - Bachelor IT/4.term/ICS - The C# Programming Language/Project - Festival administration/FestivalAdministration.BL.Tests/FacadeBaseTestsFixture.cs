using System.Collections.Generic;
using System.Linq;
using FestivalAdministration.BL.Facades;
using FestivalAdministration.BL.Models;
using FestivalAdministration.DAL.Entities;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using FestivalAdministration.DAL.Repositories;
using FestivalAdministration.DAL.Tests;
using FestivalAdministration.DAL.UnitOfWork;
using Mapster;

namespace FestivalAdministration.BL.Tests
{
    public class FacadeBaseTestsFixture : UnitOfWorkTestsFixture
    {
        public FacadeBaseTestsFixture()
        {
            Facade = new BandFacade(UnitOfWork);
        }

        public BandFacade Facade { get; }


        public IList<BandDetailModel> SeedDataBands()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            var bandList = new List<BandDetailModel>();
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
                dbContext.Bands.Add(band);
                bandList.Add(band.Adapt<BandDetailModel>());
            }

            dbContext.SaveChanges();
            return bandList;
        }

        public void ClearDataBands()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            foreach (var entity in Repository.GetAll().ToList()) Repository.Remove(entity);
            dbContext.SaveChanges();
        }
    }
}