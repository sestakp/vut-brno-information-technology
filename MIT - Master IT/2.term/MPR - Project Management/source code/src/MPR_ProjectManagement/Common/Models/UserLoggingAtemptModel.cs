using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Models.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Common.Models
{
    public class UserLoggingAtemptModel : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string IpAddress { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
