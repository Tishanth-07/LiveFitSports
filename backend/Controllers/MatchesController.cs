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

        private string ToAbsolute(string imageUrl)
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
