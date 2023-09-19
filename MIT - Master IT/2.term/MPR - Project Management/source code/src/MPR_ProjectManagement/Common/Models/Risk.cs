using Common.Enums;
using Common.Models.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models
{
    public class Risk : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public string ItemId { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Cause { get; set; } = string.Empty;

        public IList<string> Vulnerabilities { get; set; } = new List<string>();

        public string Control { get; set; } = string.Empty;

        [BsonRequired]
        //[BsonRepresentation(BsonType.ObjectId)]
        public string OwnerId { get; set; } = string.Empty;

        [BsonRequired]
        public ProbabilityEnum Probability { get; set; }

        [BsonRequired]
        public ProbabilityEnum Impact { get; set; }

        public int RiskValue => (int)Probability * (int)Impact;

        [BsonRequired]
        public RiskStateEnum State { get; set; }

        [BsonRequired]
        public DateTime CreateDate { get; set; }

        public DateTime LastUpdateDate { get; set; }

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.ObjectId)]
        [BsonDefaultValue(null)]
        public string PhaseId { get; set; } = string.Empty;

    }
}
