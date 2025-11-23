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
                    ImageUrl = "/images/match1.png"
                },
                new Workout
                {
                    Title = "Push Ups",
                    Description = "Strength training exercise for chest, shoulders, and triceps.",
                    DurationMinutes = 15,
                    Difficulty = "Easy",
                    ImageUrl = "/images/match2.png"
                },
                new Workout
                {
                    Title = "Yoga Flow",
                    Description = "Relaxing yoga sequence to improve flexibility and reduce stress.",
                    DurationMinutes = 25,
                    Difficulty = "Easy",
                    ImageUrl = "/images/match3.png"
                },
                new Workout
                {
                    Title = "HIIT Circuit",
                    Description = "High-intensity interval training to burn calories quickly.",
                    DurationMinutes = 20,
                    Difficulty = "Hard",
                    ImageUrl = "/images/match4.png"
                },
                new Workout
                {
                    Title = "Cycling",
                    Description = "Outdoor or stationary cycling to improve cardiovascular health.",
                    DurationMinutes = 40,
                    Difficulty = "Medium",
                    ImageUrl = "/images/match6.png"
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
                    ImageUrl = "/images/match7.png"
                },
                new HealthTip
                {
                    Title = "Stretch Before Workouts",
                    Content = "Always perform dynamic stretches before starting exercises to prevent injuries.",
                    ImageUrl = "/images/match8.png"
                },
                new HealthTip
                {
                    Title = "Balanced Diet",
                    Content = "Include proteins, healthy fats, and carbohydrates in your meals to maintain energy and muscle health.",
                    ImageUrl = "/images/match9.png"
                },
                new HealthTip
                {
                    Title = "Get Enough Sleep",
                    Content = "Aim for 7-9 hours of sleep each night to allow your body to recover and maintain mental focus.",
                    ImageUrl = "/images/match10.png"
                },
                new HealthTip
                {
                    Title = "Regular Physical Activity",
                    Content = "Engage in at least 150 minutes of moderate-intensity exercise per week for overall health.",
                    ImageUrl = "/images/match5.png"
                }
            };

            if (!context.HealthTips.Find(_ => true).Any())
                await context.HealthTips.InsertManyAsync(healthTips);
        }
    }
}
