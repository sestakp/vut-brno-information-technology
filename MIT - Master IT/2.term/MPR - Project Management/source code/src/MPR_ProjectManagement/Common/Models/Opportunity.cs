using Common.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models
{
    public class Opportunity : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public string Priority { get; set; } = string.Empty;

        public bool IsSolved { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = string.Empty;
    }
}
