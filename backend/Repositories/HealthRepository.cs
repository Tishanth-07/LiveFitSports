using LiveFitSports.API.Data;
using LiveFitSports.API.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFitSports.API.Repositories
{
    public class HealthRepository : IHealthRepository
    {
        private readonly MongoContext _context;
        public HealthRepository(MongoContext context)
        {
            _context = context;
        }

        public async Task<List<Workout>> GetWorkoutsAsync() =>
            await _context.Workouts.Find(_ => true).ToListAsync();

        public async Task<Workout?> GetWorkoutByIdAsync(string id) =>
            await _context.Workouts.Find(w => w.Id == id).FirstOrDefaultAsync();

        public async Task<List<HealthTip>> GetHealthTipsAsync() =>
            await _context.HealthTips.Find(_ => true).ToListAsync();

        public async Task<HealthTip?> GetHealthTipByIdAsync(string id) =>
            await _context.HealthTips.Find(h => h.Id == id).FirstOrDefaultAsync();
    }
}
