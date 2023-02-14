using System.Collections.Generic;
using System.Linq;
using Tournament.API.DAL.Entities;
using Tournament.API.DAL.Entities.Factories;
using Tournament.API.DAL.Entities.Factories.Interfaces;
using Tournament.API.DAL.Repositories;
using Tournament.API.DAL.Repositories.Factories;
using Tournament.API.DAL.Repositories.Factories.Interfaces;
using Tournament.API.DAL.Repositories.Interfaces;

namespace Tournament.API.DAL.Tests
{
    public class RepositoryBaseTestsFixture : TournamentDbContextSetupFixture
    {

        //name of is name for InMemoryDatabase
        public RepositoryBaseTestsFixture() : base(nameof(RepositoryBaseTestsFixture))
        {
            EntityAbstractFactory = new EntityAbstractFactory();
            RepositoryAbstractFactory = new RepositoryAbstractFactory();
        }
        
        public IEntityAbstractFactory EntityAbstractFactory { get; }
        public IRepositoryAbstractFactory RepositoryAbstractFactory { get; }

        public IList<PlayerEntity> SeedDataPersons()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            var personList = new List<PlayerEntity>();
            for (var i = 0; i < 50; i++)
            {
                var person = EntityAbstractFactory.CreatePlayerEntity(i);
                personList.Add(person);
                dbContext.Players.Add(person);
            }

            dbContext.SaveChanges();
            return personList;
        }

        public void ClearDataPersons()
        {
            using var dbContext = DbContextFactory.CreateDbContext();
            foreach (var entity in dbContext.Players.ToList()) dbContext.Players.Remove(entity);

            dbContext.SaveChanges();
        }
    }
}
