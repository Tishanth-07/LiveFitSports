using System.Threading.Tasks;
using MongoDB.Driver;
using LiveFitSports.API.Models;
using LiveFitSports.API.Data;
using System;

namespace LiveFitSports.API.Repositories
{
    public class UserRepository
    {
        private readonly MongoContext _context;
        public UserRepository(MongoContext context)
        {
            _context = context;
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.Find(u => u.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user)
        {
            await _context.Users.InsertOneAsync(user);
        }

        public async Task UpdateAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
            await _context.Users.ReplaceOneAsync(filter, user);
        }
    }
}
