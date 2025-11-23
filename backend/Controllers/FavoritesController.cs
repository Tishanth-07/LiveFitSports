using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using LiveFitSports.API.Repositories;
using LiveFitSports.API.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using LiveFitSports.API.DTOs;
using MongoDB.Bson;
using System;

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
        public async Task<IActionResult> Add([FromBody] AddFavoriteRequest req)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }

            if (req == null || string.IsNullOrWhiteSpace(req.ItemId))
            {
                return BadRequest(new { error = "ItemId is required." });
            }

            var fav = new Favorite
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserId = userId,
                ItemId = req.ItemId,
                ItemType = string.IsNullOrWhiteSpace(req.ItemType) ? "match" : req.ItemType,
                CreatedAtUtc = DateTime.UtcNow
            };

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
