using LiveFitSports.API.Repositories;
using LiveFitSports.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserRepository _userRepo;
        private readonly IWebHostEnvironment _env;

        public ProfileController(UserRepository userRepo, IWebHostEnvironment env)
        {
            _userRepo = userRepo;
            _env = env;
        }

        // GET /api/profile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // PUT /api/profile
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            var userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return NotFound();

            // Log incoming request for debugging
            Console.WriteLine($"UpdateProfile - UserId: {userId}, Payload: {System.Text.Json.JsonSerializer.Serialize(updateDto)}");

            // Validate the DTO
            if (updateDto == null)
            {
                return BadRequest(new { error = "Invalid request body" });
            }

            bool hasUpdates = false;

            // Only update fields that were provided and are not empty
            if (!string.IsNullOrWhiteSpace(updateDto.FirstName))
            {
                user.FirstName = updateDto.FirstName.Trim();
                hasUpdates = true;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.LastName))
            {
                user.LastName = updateDto.LastName.Trim();
                hasUpdates = true;
            }

            if (!hasUpdates)
            {
                return BadRequest(new { error = "No valid fields provided for update" });
            }

            try 
            {
                await _userRepo.UpdateAsync(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateProfile error: {ex}");
                return StatusCode(500, new { error = "Failed to update profile" });
            }
        }

        // POST /api/profile/avatar
        [HttpPost("avatar")]
        [RequestSizeLimit(10_000_000)] // allow up to ~10MB
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = GetUserIdFromClaims();
            if (userId == null) return Unauthorized();

            if (file == null || file.Length == 0) return BadRequest("File is required");

            // ensure uploads folder
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            // unique filename
            var ext = Path.GetExtension(file.FileName);
            var newFileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, newFileName);

            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var publicUrl = $"{Request.Scheme}://{Request.Host}/uploads/{newFileName}";

            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return NotFound();

            user.AvatarUrl = publicUrl;
            await _userRepo.UpdateAsync(user);

            return Ok(new { avatarUrl = publicUrl });
        }

        private string? GetUserIdFromClaims()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        }
    }
}
