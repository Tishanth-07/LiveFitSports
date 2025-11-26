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
        [AllowAnonymous]
        public async Task<ActionResult<List<Workout>>> GetWorkouts()
        {
            var workouts = await _service.GetAllWorkoutsAsync();
            return Ok(workouts);
        }

        [HttpGet("workouts/{id:length(24)}")]
        [AllowAnonymous]
        public async Task<ActionResult<Workout>> GetWorkout(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || id.Length != 24)
                return NotFound();
            var workout = await _service.GetWorkoutAsync(id);
            if (workout == null) return NotFound();
            return Ok(workout);
        }

        [HttpGet("tips")]
        [AllowAnonymous]
        public async Task<ActionResult<List<HealthTip>>> GetHealthTips()
        {
            var tips = await _service.GetAllHealthTipsAsync();
            return Ok(tips);
        }

        [HttpGet("tips/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<HealthTip>> GetHealthTip(string id)
        {
            var tip = await _service.GetHealthTipAsync(id);
            if (tip == null) return NotFound();
            return Ok(tip);
        }
    }
}
