using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace LiveFitSports.API.Models
{
    public class Favorite
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        public required string UserId { get; set; }   // user ObjectId string
        public required string ItemId { get; set; }   // match id
        public string? ItemType { get; set; } // "match", "team", etc.
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
