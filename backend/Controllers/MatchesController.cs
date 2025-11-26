using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LiveFitSports.API.Repositories;
using System.Collections.Generic;
using LiveFitSports.API.Models;
using System;
using System.Linq;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly MatchRepository _matches;
        public MatchesController(MatchRepository matches) => _matches = matches;

        private string? ToAbsolute(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl)) return imageUrl;
            if (imageUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase)) return imageUrl;
            var req = HttpContext.Request;
            var baseUrl = $"{req.Scheme}://{req.Host}";
            if (imageUrl.StartsWith("/")) return baseUrl + imageUrl;
            return baseUrl + "/" + imageUrl;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? sport = null, [FromQuery] string? status = null, [FromQuery] int page = 1)
        {
            var list = await _matches.GetAllAsync(sport!, status!, page);
            if (list == null || list.Count == 0)
            {
                list = new List<Match>
                {
                    new Match { Sport = "Football", Title = "Team A vs Team B", Description = "Champions League Quarter Finals", Status = "Live", StartAtUtc = DateTime.UtcNow.AddMinutes(-30), ImageUrl = "/images/image11.png", Teams = new List<string>{"Team A","Team B"}, Popularity = 90 },
                    new Match { Sport = "Cricket", Title = "India vs Australia", Description = "T20 World Cup Group Match", Status = "Upcoming", StartAtUtc = DateTime.UtcNow.AddHours(3), ImageUrl = "/images/image12.png", Teams = new List<string>{"India","Australia"}, Popularity = 85 },
                    new Match { Sport = "Basketball", Title = "Lakers vs Warriors", Description = "NBA Season Regular Match", Status = "Finished", StartAtUtc = DateTime.UtcNow.AddDays(-1), ImageUrl = "/images/image13.png", Teams = new List<string>{"Lakers","Warriors"}, Popularity = 70 }
                };
            }
            var mapped = list.Select(m => { m.ImageUrl = ToAbsolute(m.ImageUrl); return m; }).ToList();
            return Ok(mapped);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var match = await _matches.GetByIdAsync(id);
            if (match == null) return NotFound();
            match.ImageUrl = ToAbsolute(match.ImageUrl);
            return Ok(match);
        }
    }
}
