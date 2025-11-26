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

        private string ToAbsolute(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl)) return imageUrl ?? string.Empty;
            if (imageUrl.StartsWith("http", System.StringComparison.OrdinalIgnoreCase)) return imageUrl;
            var req = HttpContext.Request;
            var baseUrl = $"{req.Scheme}://{req.Host}";
            if (imageUrl.StartsWith("/")) return baseUrl + imageUrl;
            return baseUrl + "/" + imageUrl;
        }

        [HttpGet("workouts")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Workout>>> GetWorkouts()
        {
            List<Workout> workouts;
            try
            {
                workouts = await _service.GetAllWorkoutsAsync();
            }
            catch
            {
                workouts = new List<Workout>();
            }
            if (workouts == null || workouts.Count == 0)
            {
                workouts = new List<Workout>
                {
                    new Workout { Title = "Morning Run", Description = "A 30-minute cardio run to kickstart your day and boost metabolism.", ImageUrl = "/images/image1.png" },
                    new Workout { Title = "Push Ups", Description = "Strength training exercise for chest, shoulders, and triceps.", ImageUrl = "/images/image2.png" },
                    new Workout { Title = "Yoga Flow", Description = "Relaxing yoga sequence to improve flexibility and reduce stress.", ImageUrl = "/images/image3.png" }
                };
            }
            var mapped = workouts.ConvertAll(w => { w.ImageUrl = ToAbsolute(w.ImageUrl); return w; });
            return Ok(mapped);
        }

        [HttpGet("workouts/{id:length(24)}")]
        [AllowAnonymous]
        public async Task<ActionResult<Workout>> GetWorkout(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || id.Length != 24)
                return NotFound();
            var workout = await _service.GetWorkoutAsync(id);
            if (workout == null) return NotFound();
            workout.ImageUrl = ToAbsolute(workout.ImageUrl);
            return Ok(workout);
        }

        [HttpGet("tips")]
        [AllowAnonymous]
        public async Task<ActionResult<List<HealthTip>>> GetHealthTips()
        {
            List<HealthTip> tips;
            try
            {
                tips = await _service.GetAllHealthTipsAsync();
            }
            catch
            {
                tips = new List<HealthTip>();
            }
            if (tips == null || tips.Count == 0)
            {
                tips = new List<HealthTip>
                {
                    new HealthTip { Title = "Stay Hydrated", Content = "Drink at least 8 glasses of water daily to keep your body hydrated and maintain energy levels.", ImageUrl = "/images/image7.png" },
                    new HealthTip { Title = "Stretch Before Workouts", Content = "Perform dynamic stretches before exercises to prevent injuries.", ImageUrl = "/images/image8.png" },
                    new HealthTip { Title = "Balanced Diet", Content = "Include proteins, healthy fats, and carbohydrates in your meals.", ImageUrl = "/images/image9.png" }
                };
            }
            var mapped = tips.ConvertAll(t => { t.ImageUrl = ToAbsolute(t.ImageUrl); return t; });
            return Ok(mapped);
        }

        [HttpGet("tips/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<HealthTip>> GetHealthTip(string id)
        {
            var tip = await _service.GetHealthTipAsync(id);
            if (tip == null) return NotFound();
            tip.ImageUrl = ToAbsolute(tip.ImageUrl);
            return Ok(tip);
        }
    }
}
