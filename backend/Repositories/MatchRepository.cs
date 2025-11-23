using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using LiveFitSports.API.Data;
using LiveFitSports.API.Models;
using System.Linq;

namespace LiveFitSports.API.Repositories
{
    public class MatchRepository
    {
        private readonly MongoContext _context;
        public MatchRepository(MongoContext context) => _context = context;

        public async Task<List<Match>> GetAllAsync(string? sport = null, string? status = null, int page = 1, int pageSize = 20)
        {
            var filter = Builders<Match>.Filter.Empty;
            if (!string.IsNullOrEmpty(sport))
                filter &= Builders<Match>.Filter.Eq(m => m.Sport, sport);
            if (!string.IsNullOrEmpty(status))
                filter &= Builders<Match>.Filter.Eq(m => m.Status, status);

            return await _context.Database.GetCollection<Match>("matches")
                .Find(filter)
                .SortByDescending(m => m.Popularity)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<Match> GetByIdAsync(string id)
        {
            return await _context.Database.GetCollection<Match>("matches").Find(m => m.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateManyAsync(IEnumerable<Match> matches)
        {
            await _context.Database.GetCollection<Match>("matches").InsertManyAsync(matches);
        }
    }
}
