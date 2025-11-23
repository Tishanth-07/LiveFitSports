using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LiveFitSports.API.Models
{
    public class Workout
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DurationMinutes { get; set; } = 0; 
        public string Difficulty { get; set; } = "Easy"; 
        public string? ImageUrl { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
