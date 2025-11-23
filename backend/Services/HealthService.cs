using LiveFitSports.API.Models;
using LiveFitSports.API.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFitSports.API.Services
{
    public class HealthService
    {
        private readonly IHealthRepository _repository;
        public HealthService(IHealthRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Workout>> GetAllWorkoutsAsync() => _repository.GetWorkoutsAsync();
        public Task<Workout?> GetWorkoutAsync(string id) => _repository.GetWorkoutByIdAsync(id);

        public Task<List<HealthTip>> GetAllHealthTipsAsync() => _repository.GetHealthTipsAsync();
        public Task<HealthTip?> GetHealthTipAsync(string id) => _repository.GetHealthTipByIdAsync(id);
    }
}
