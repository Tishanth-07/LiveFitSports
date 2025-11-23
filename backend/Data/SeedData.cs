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
                    ImageUrl = "https://example.com/images/morning_run.jpg"
                },
                new Workout
                {
                    Title = "Push Ups",
                    Description = "Strength training exercise for chest, shoulders, and triceps.",
                    DurationMinutes = 15,
                    Difficulty = "Easy",
                    ImageUrl = "https://example.com/images/push_ups.jpg"
                },
                new Workout
                {
                    Title = "Yoga Flow",
                    Description = "Relaxing yoga sequence to improve flexibility and reduce stress.",
                    DurationMinutes = 25,
                    Difficulty = "Easy",
                    ImageUrl = "https://example.com/images/yoga_flow.jpg"
                },
                new Workout
                {
                    Title = "HIIT Circuit",
                    Description = "High-intensity interval training to burn calories quickly.",
                    DurationMinutes = 20,
                    Difficulty = "Hard",
                    ImageUrl = "https://example.com/images/hiit_circuit.jpg"
                },
                new Workout
                {
                    Title = "Cycling",
                    Description = "Outdoor or stationary cycling to improve cardiovascular health.",
                    DurationMinutes = 40,
                    Difficulty = "Medium",
                    ImageUrl = "https://example.com/images/cycling.jpg"
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
                    ImageUrl = "https://example.com/images/hydration.jpg"
                },
                new HealthTip
                {
                    Title = "Stretch Before Workouts",
                    Content = "Always perform dynamic stretches before starting exercises to prevent injuries.",
                    ImageUrl = "https://example.com/images/stretching.jpg"
                },
                new HealthTip
                {
                    Title = "Balanced Diet",
                    Content = "Include proteins, healthy fats, and carbohydrates in your meals to maintain energy and muscle health.",
                    ImageUrl = "https://example.com/images/balanced_diet.jpg"
                },
                new HealthTip
                {
                    Title = "Get Enough Sleep",
                    Content = "Aim for 7-9 hours of sleep each night to allow your body to recover and maintain mental focus.",
                    ImageUrl = "https://example.com/images/sleep.jpg"
                },
                new HealthTip
                {
                    Title = "Regular Physical Activity",
                    Content = "Engage in at least 150 minutes of moderate-intensity exercise per week for overall health.",
                    ImageUrl = "https://example.com/images/physical_activity.jpg"
                }
            };

            if (!context.HealthTips.Find(_ => true).Any())
                await context.HealthTips.InsertManyAsync(healthTips);
        }
    }
}
