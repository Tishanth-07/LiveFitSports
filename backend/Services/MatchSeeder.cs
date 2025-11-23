using LiveFitSports.API.Data;
using LiveFitSports.API.Models;
using MongoDB.Driver;

namespace LiveFitSports.API.Services
{
    public class MatchSeeder
    {
        private readonly IMongoCollection<Match> _matches;

        public MatchSeeder(MongoContext context)
        {
            _matches = context.Database.GetCollection<Match>("matches");
        }

        public async Task SeedAsync()
        {
            var existing = await _matches.CountDocumentsAsync(FilterDefinition<Match>.Empty);
            if (existing > 0) return; // Already seeded

            var seedMatches = new List<Match>
            {
                new Match
                {
                    Sport = "Football",
                    Title = "Team A vs Team B",
                    Description = "Champions League Quarter Finals",
                    Status = "Live",
                    StartAtUtc = DateTime.UtcNow.AddMinutes(-30),
                    ImageUrl = "/images/match11.png",
                    Teams = new List<string> { "Team A", "Team B" },
                    Popularity = 90,
                    Metadata = new Dictionary<string, object>
                    {
                        { "ScoreA", 1 },
                        { "ScoreB", 2 },
                        { "Stadium", "Old Trafford" }
                    }
                },
                new Match
                {
                    Sport = "Cricket",
                    Title = "India vs Australia",
                    Description = "T20 World Cup Group Match",
                    Status = "Upcoming",
                    StartAtUtc = DateTime.UtcNow.AddHours(3),
                    ImageUrl = "/images/match12.png",
                    Teams = new List<string> { "India", "Australia" },
                    Popularity = 85,
                    Metadata = new Dictionary<string, object>
                    {
                        { "Venue", "Wankhede Stadium" },
                        { "TossWonBy", "India" }
                    }
                },
                new Match
                {
                    Sport = "Basketball",
                    Title = "Lakers vs Warriors",
                    Description = "NBA Season Regular Match",
                    Status = "Finished",
                    StartAtUtc = DateTime.UtcNow.AddDays(-1),
                    ImageUrl = "/images/match13.png",
                    Teams = new List<string> { "Lakers", "Warriors" },
                    Popularity = 70,
                    Metadata = new Dictionary<string, object>
                    {
                        { "ScoreA", 102 },
                        { "ScoreB", 99 },
                        { "Arena", "Staples Center" }
                    }
                }
            };

            await _matches.InsertManyAsync(seedMatches);
        }
    }
}
