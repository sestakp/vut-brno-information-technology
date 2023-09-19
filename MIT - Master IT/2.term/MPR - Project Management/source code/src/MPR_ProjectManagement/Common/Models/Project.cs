using Common.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models
{
    public class Project : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        [BsonDefaultValue(null)]
        public DateTime? EndDate { get; set; }

        public bool IsFinished { get; set; }

        [BsonRequired]
        //[BsonRepresentation(BsonType.ObjectId)] its email actualy
        public string ProjectManager { get; set; } = string.Empty;

    }
}
