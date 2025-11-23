using LiveFitSports.API.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace LiveFitSports.API.Data
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string UsersCollection { get; set; } = string.Empty;
    }

    public class MongoContext
    {
        private readonly IMongoDatabase _database;
        public IMongoCollection<Models.User> Users { get; }
        public IMongoCollection<Workout> Workouts { get; }
        public IMongoCollection<HealthTip> HealthTips { get; }


        public IMongoDatabase Database => _database;

        public MongoContext(IConfiguration config)
        {
            var settings = config.GetSection("MongoSettings").Get<MongoSettings>()
                ?? throw new InvalidOperationException("MongoSettings configuration section is missing or invalid.");
            var client = new MongoClient(settings.ConnectionString);
            _database = client.GetDatabase(settings.DatabaseName);
            Users = _database.GetCollection<Models.User>(settings.UsersCollection ?? "users");
            Workouts = _database.GetCollection<Workout>("workouts");
            HealthTips = _database.GetCollection<HealthTip>("healthtips");
        }
    }
}
