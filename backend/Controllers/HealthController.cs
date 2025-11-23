using LiveFitSports.API.Models;
using LiveFitSports.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HealthController : ControllerBase
    {
        private readonly HealthService _service;
        public HealthController(HealthService service)
        {
            _service = service;
        }

        [HttpGet("workouts")]
        public async Task<ActionResult<List<Workout>>> GetWorkouts()
        {
            var workouts = await _service.GetAllWorkoutsAsync();
            return Ok(workouts);
        }

        [HttpGet("workouts/{id}")]
        public async Task<ActionResult<Workout>> GetWorkout(string id)
        {
            var workout = await _service.GetWorkoutAsync(id);
            if (workout == null) return NotFound();
            return Ok(workout);
        }

        [HttpGet("tips")]
        public async Task<ActionResult<List<HealthTip>>> GetHealthTips()
        {
            var tips = await _service.GetAllHealthTipsAsync();
            return Ok(tips);
        }

        [HttpGet("tips/{id}")]
        public async Task<ActionResult<HealthTip>> GetHealthTip(string id)
        {
            var tip = await _service.GetHealthTipAsync(id);
            if (tip == null) return NotFound();
            return Ok(tip);
        }
    }
}
