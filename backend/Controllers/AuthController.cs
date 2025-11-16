using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LiveFitSports.API.Services;
using LiveFitSports.API.DTOs.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

namespace LiveFitSports.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService auth, ILogger<AuthController> logger)
        {
            _auth = auth;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            try
            {
                await _auth.RegisterAsync(req);
                return Ok(new { message = "Registered. Verification code sent to email." });
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Register error");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest req)
        {
            try
            {
                var ok = await _auth.VerifyEmailAsync(req);
                return Ok(new { verified = ok });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest req)
        {
            try
            {
                await _auth.ResendVerificationCodeAsync(req);
                return Ok(new { message = "Verification code resent." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var token = await _auth.LoginAsync(req);
                return Ok(new { accessToken = token });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
        {
            try
            {
                await _auth.SendForgotPasswordCodeAsync(req);
                return Ok(new { message = "Password reset code sent to email." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            try
            {
                await _auth.ResetPasswordAsync(req);
                return Ok(new { message = "Password reset successful." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
