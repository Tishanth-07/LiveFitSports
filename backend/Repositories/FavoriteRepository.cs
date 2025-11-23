using MongoDB.Driver;
using LiveFitSports.API.Models;
using LiveFitSports.API.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFitSports.API.Repositories
{
    public class FavoriteRepository
    {
        private readonly MongoContext _context;
        public FavoriteRepository(MongoContext context) => _context = context;

        public IMongoCollection<Favorite> Favorites => _context.Database.GetCollection<Favorite>("favorites");

        public async Task AddAsync(Favorite fav) => await Favorites.InsertOneAsync(fav);

        public async Task<List<Favorite>> GetByUserAsync(string userId) =>
            await Favorites.Find(f => f.UserId == userId).ToListAsync();

        public async Task RemoveAsync(string userId, string itemId) =>
            await Favorites.DeleteOneAsync(f => f.UserId == userId && f.ItemId == itemId);
    }
}
