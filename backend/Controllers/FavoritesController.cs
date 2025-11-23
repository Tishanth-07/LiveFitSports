using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using LiveFitSports.API.Repositories;
using LiveFitSports.API.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly FavoriteRepository _favRepo;
        public FavoritesController(FavoriteRepository favRepo) => _favRepo = favRepo;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            var favs = await _favRepo.GetByUserAsync(userId);
            return Ok(favs);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Favorite fav)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            fav.UserId = userId;
            await _favRepo.AddAsync(fav);
            return Ok(fav);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> Remove(string itemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }
            await _favRepo.RemoveAsync(userId, itemId);
            return NoContent();
        }
    }
}
