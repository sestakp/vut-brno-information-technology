using Common.Models.Interfaces;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models
{
    public class Participate : IMongoItem
    {
        // ObjectId as string for testing purposes (Swagger has inconsistency in request and response forms of ObjectId)
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;


        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = string.Empty;


        [BsonRequired]
        //[BsonRepresentation(BsonType.ObjectId)] its email
        public string EmployeeId { get; set; } = string.Empty;
    }
}
