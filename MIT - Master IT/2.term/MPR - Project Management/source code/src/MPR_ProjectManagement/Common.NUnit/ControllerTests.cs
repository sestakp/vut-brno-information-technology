using Common.Controllers;
using Common.Controllers.Interfaces;
using Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Common.NUnit
{
    /// <summary>
    /// Tests for basic CRUD actions
    /// </summary>
    /// <remarks>
    /// Before running, start a mongodb container (Docker)
    /// Connection string is "mongodb://localhost:27017"
    /// </remarks>
    public class ControllerTests
    {
        private IMongoClient client;
        private IMongoDatabase database;
        private IMongoCollection<Project> projects;
        private IController<Project> controller;

        private readonly IList<Project> initProjects = new List<Project>() {
            new Project() {
                Id = "507f1f77bcf86cd799439011",
                Name = "testProject1",
                StartDate = new DateTime(2022, 3, 14, 2, 30, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2022, 11, 4, 14, 29, 50, DateTimeKind.Utc),
                IsFinished = false,
                ProjectManager = "00000020f51bb4362eee2a4e"
            },
            new Project() {
                Id = "507f191e810c19729de860ea",
                Name = "testProject2",
                StartDate = new DateTime(2021, 1, 1, 1, 1, 1, DateTimeKind.Utc),
                EndDate = new DateTime(2022, 6, 21, 18, 31, 13, DateTimeKind.Utc),
                IsFinished = true,
                ProjectManager = "00000020f51bb4362eee2a4d"
            }
        };

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            client = new MongoClient("mongodb://localhost:27017");
            database = client.GetDatabase($"tests_{DateTime.Now.Ticks}");
        }

        [SetUp]
        public void Setup()
        {
            projects = database.GetCollection<Project>("projects");
            projects.InsertMany(initProjects);
            var logger = new Logger<Controller<Project>>(new LoggerFactory());
            var client = new HttpClient();
            var contextAccessor = new HttpContextAccessor();
            controller = new Controller<Project>(projects, logger, client,contextAccessor);
        }

        [TearDown]
        public void TearDown()
        {
            database.DropCollection("projects");
        }

        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            client.DropDatabase(database.DatabaseNamespace.DatabaseName);
        }

        [Test]
        public void GetTests()
        {
            var result = controller.Get();

            result.Should().BeEquivalentTo(initProjects);
        }

        [Test]
        public void GetTest()
        {
            var result = controller.Get(initProjects[1].Id);

            result.Should().BeEquivalentTo(initProjects[1]);
        }

        [Test]
        public void PostTest()
        {
            var newProject = new Project()
            {
                Id = "507f192e810c19729de860ee",
                Name = "testProject3",
                StartDate = new DateTime(2021, 12, 24, 8, 55, 8, DateTimeKind.Utc),
                EndDate = new DateTime(2022, 9, 12, 2, 34, 9, DateTimeKind.Utc),
                IsFinished = false,
                ProjectManager = "00000020f51bb4362eee2a4e"
            };

            controller.Post(newProject);

            var result = projects.Find(x => x.Id == newProject.Id).First();
            result.Should().BeEquivalentTo(newProject);
        }

        [Test]
        public void PutTest()
        {
            var defaultValue = projects.Find(x => x.Id == initProjects[0].Id).First();
            defaultValue.Name = "testProject1NEW";
            defaultValue.IsFinished = true;
            defaultValue.EndDate = new DateTime(2021, 7, 23, 5, 12, 29, DateTimeKind.Utc);

            controller.Put(defaultValue);

            var result = projects.Find(x => x.Id == initProjects[0].Id).First();
            result.Should().BeEquivalentTo(defaultValue);
        }

        [Test]
        public void DeleteTest()
        {
            controller.Delete(initProjects[1].Id);

            var result = projects.Find(x => x.Id == initProjects[1].Id);
            result.Any().Should().BeFalse();
        }
    }
}