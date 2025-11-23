using LiveFitSports.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFitSports.API.Repositories
{
    public interface IHealthRepository
    {
        Task<List<Workout>> GetWorkoutsAsync();
        Task<Workout?> GetWorkoutByIdAsync(string id);
        Task<List<HealthTip>> GetHealthTipsAsync();
        Task<HealthTip?> GetHealthTipByIdAsync(string id);
    }
}
