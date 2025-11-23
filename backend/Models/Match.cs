using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace LiveFitSports.API.Models
{
    public class Match
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Sport { get; set; }   
        public string? Title { get; set; }   
        public string? Description { get; set; }
        public string? Status { get; set; }  
        public DateTime StartAtUtc { get; set; }
        public string? ImageUrl { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
        public int Popularity { get; set; } = 0;
        public List<string> Teams { get; set; } = new();
    }
}
