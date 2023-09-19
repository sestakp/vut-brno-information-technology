using Common.Enums;
using Common.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models
{
    public class RiskTemplate : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Cause { get; set; } = string.Empty;

        public IList<string> Vulnerabilities { get; set; } = new List<string>();

        public string Control { get; set; } = string.Empty;

        public ProbabilityEnum Probability { get; set; }

        public ProbabilityEnum Impact { get; set; }

        public RiskStateEnum State { get; set; }
    }
}
