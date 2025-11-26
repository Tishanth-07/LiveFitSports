using LiveFitSports.API.Models;
using MongoDB.Driver;

namespace LiveFitSports.API.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(MongoContext context)
        {
            // Workouts
            var workouts = new[]
            {
                new Workout
                {
                    Title = "Morning Run",
                    Description = "A 30-minute cardio run to kickstart your day and boost metabolism.",
                    DurationMinutes = 30,
                    Difficulty = "Medium",
                    ImageUrl = "/images/image1.png"
                },
                new Workout
                {
                    Title = "Push Ups",
                    Description = "Strength training exercise for chest, shoulders, and triceps.",
                    DurationMinutes = 15,
                    Difficulty = "Easy",
                    ImageUrl = "/images/image2.png"
                },
                new Workout
                {
                    Title = "Yoga Flow",
                    Description = "Relaxing yoga sequence to improve flexibility and reduce stress.",
                    DurationMinutes = 25,
                    Difficulty = "Easy",
                    ImageUrl = "/images/image3.png"
                },
                new Workout
                {
                    Title = "HIIT Circuit",
                    Description = "High-intensity interval training to burn calories quickly.",
                    DurationMinutes = 20,
                    Difficulty = "Hard",
                    ImageUrl = "/images/image4.png"
                },
                new Workout
                {
                    Title = "Cycling",
                    Description = "Outdoor or stationary cycling to improve cardiovascular health.",
                    DurationMinutes = 40,
                    Difficulty = "Medium",
                    ImageUrl = "/images/image6.png"
                }
            };

            if (!context.Workouts.Find(_ => true).Any())
                await context.Workouts.InsertManyAsync(workouts);

            // HealthTips
            var healthTips = new[]
            {
                new HealthTip
                {
                    Title = "Stay Hydrated",
                    Content = "Drink at least 8 glasses of water daily to keep your body hydrated and maintain energy levels.",
                    ImageUrl = "/images/image7.png"
                },
                new HealthTip
                {
                    Title = "Stretch Before Workouts",
                    Content = "Always perform dynamic stretches before starting exercises to prevent injuries.",
                    ImageUrl = "/images/image8.png"
                },
                new HealthTip
                {
                    Title = "Balanced Diet",
                    Content = "Include proteins, healthy fats, and carbohydrates in your meals to maintain energy and muscle health.",
                    ImageUrl = "/images/image9.png"
                },
                new HealthTip
                {
                    Title = "Get Enough Sleep",
                    Content = "Aim for 7-9 hours of sleep each night to allow your body to recover and maintain mental focus.",
                    ImageUrl = "/images/image10.png"
                },
                new HealthTip
                {
                    Title = "Regular Physical Activity",
                    Content = "Engage in at least 150 minutes of moderate-intensity exercise per week for overall health.",
                    ImageUrl = "/images/image5.png"
                }
            };

            if (!context.HealthTips.Find(_ => true).Any())
                await context.HealthTips.InsertManyAsync(healthTips);

        }

        public static async Task FixImageUrlsAsync(MongoContext context)
        {
            var workoutFixList = await context.Workouts
                .Find(w => w.ImageUrl != null && w.ImageUrl.Contains("/images/match"))
                .ToListAsync();
            foreach (var w in workoutFixList)
            {
                w.ImageUrl = w.ImageUrl!.Replace("/images/match", "/images/image");
                await context.Workouts.ReplaceOneAsync(x => x.Id == w.Id, w);
            }

            var healthTipsFixList = await context.HealthTips
                .Find(t => t.ImageUrl != null && t.ImageUrl.Contains("/images/match"))
                .ToListAsync();
            foreach (var t in healthTipsFixList)
            {
                t.ImageUrl = t.ImageUrl!.Replace("/images/match", "/images/image");
                await context.HealthTips.ReplaceOneAsync(x => x.Id == t.Id, t);
            }

            var matchesCollection = context.Database.GetCollection<LiveFitSports.API.Models.Match>("matches");
            var matchesFixList = await matchesCollection
                .Find(m => m.ImageUrl != null && m.ImageUrl.Contains("/images/match"))
                .ToListAsync();
            foreach (var m in matchesFixList)
            {
                m.ImageUrl = m.ImageUrl!.Replace("/images/match", "/images/image");
                await matchesCollection.ReplaceOneAsync(x => x.Id == m.Id, m);
            }
        }
    }
}
