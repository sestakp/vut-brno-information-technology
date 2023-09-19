using Common.Enums;
using Common.Models.Interfaces;
using MongoDB.Bson.Serialization.Attributes;

namespace Common.Models
{
    public class Employee : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Email => Id;

        public string PasswordHash { get; set; } = string.Empty;

        public RoleEnum Role { get; set; }
    }
}
