using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LiveFitSports.API.Repositories;
using System.Collections.Generic;
using LiveFitSports.API.Models;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly MatchRepository _matches;
        public MatchesController(MatchRepository matches) => _matches = matches;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? sport = null, [FromQuery] string? status = null, [FromQuery] int page = 1)
        {
            var list = await _matches.GetAllAsync(sport!, status!, page);
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var match = await _matches.GetByIdAsync(id);
            if (match == null) return NotFound();
            return Ok(match);
        }
    }
}
