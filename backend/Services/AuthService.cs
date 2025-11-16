using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LiveFitSports.API.DTOs.Auth;
using LiveFitSports.API.Models;
using LiveFitSports.API.Repositories;
using LiveFitSports.API.Utilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using BCrypt.Net;
using Google.Apis.Auth;

namespace LiveFitSports.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserRepository _users;
        private readonly IEmailService _email;
        private readonly JwtSettings _jwtSettings;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;
        public AuthService(UserRepository users, IEmailService email, IConfiguration config, ILogger<AuthService> logger)
        {
            _users = users;
            _email = email;
            _config = config;
            _logger = logger;
            var jwtSection = _config.GetSection("JwtSettings");
            _jwtSettings = jwtSection.Get<JwtSettings>()
                ?? throw new InvalidOperationException("JwtSettings configuration section is missing or invalid.");
        }

        // Password policy: 1 uppercase, 1 symbol, 1 number, min 6
        private bool ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password)) return false;
            var hasUpper = new Regex(@"[A-Z]+");
            var hasNumber = new Regex(@"\d+");
            var hasSymbol = new Regex(@"[!@#$%^&*(),.?""{}|<>_\-+\\\/\[\];:'`~]+");
            return password.Length >= 6 && hasUpper.IsMatch(password) && hasNumber.IsMatch(password) && hasSymbol.IsMatch(password);
        }

        private string GenerateNumericCode(int length = 6)
        {
            var rng = new Random();
            var code = "";
            for (int i = 0; i < length; i++)
                code += rng.Next(0, 10).ToString();
            return code;
        }

        public async Task RegisterAsync(RegisterRequest req)
        {
            // check email uniqueness
            var existing = await _users.GetByEmailAsync(req.Email);
            if (existing != null) throw new ApplicationException("Email already in use.");

            if (!ValidatePassword(req.Password))
                throw new ApplicationException("Password must be at least 6 chars, include 1 uppercase, 1 number and 1 symbol.");

            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                FirstName = req.FirstName,
                LastName = req.LastName,
                Email = req.Email,
                PasswordHash = hash,
                EmailVerified = false
            };

            // generate verification code, expiry 2 minutes
            user.EmailVerificationCode = GenerateNumericCode(6);
            user.EmailVerificationCodeExpiryUtc = DateTime.UtcNow.AddMinutes(2);

            await _users.CreateAsync(user);

            // send verification email
            var emailBody = $"Hello {user.FirstName},<br/><p>Your verification code is <b>{user.EmailVerificationCode}</b>. It expires in 2 minutes.</p>";
            try
            {
                await _email.SendEmailAsync(user.Email, "Verify your LiveFit Sports account", emailBody);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email.");
                // Do not rollback creation — but tell the client to retry sending code
            }
        }

        public async Task<string> LoginAsync(LoginRequest req)
        {
            var user = await _users.GetByEmailAsync(req.Email);
            if (user == null) throw new ApplicationException("Invalid credentials.");

            if (!user.EmailVerified) throw new ApplicationException("Email not verified.");

            if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                throw new ApplicationException("Invalid credentials.");

            var token = JwtTokenGenerator.GenerateToken(user, _jwtSettings);
            return token;
        }

        public async Task<bool> VerifyEmailAsync(VerifyEmailRequest req)
        {
            var user = await _users.GetByEmailAsync(req.Email);
            if (user == null) throw new ApplicationException("User not found.");
            if (user.EmailVerified) return true;

            if (user.EmailVerificationCode == null || user.EmailVerificationCodeExpiryUtc == null)
                throw new ApplicationException("No verification code found. Request a new one.");

            if (DateTime.UtcNow > user.EmailVerificationCodeExpiryUtc.Value)
                throw new ApplicationException("Verification code expired.");

            var storedCode = user.EmailVerificationCode?.Trim();
            var inputCode = req.Code?.Trim();
            if (storedCode != inputCode)
                throw new ApplicationException("Invalid verification code.");

            user.EmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpiryUtc = null;
            await _users.UpdateAsync(user);
            return true;
        }

        public async Task ResendVerificationCodeAsync(ResendVerificationRequest req)
        {
            var user = await _users.GetByEmailAsync(req.Email);
            if (user == null) throw new ApplicationException("User not found.");
            if (user.EmailVerified) throw new ApplicationException("Email already verified.");

            // generate new code and set expiry 2 minutes from now
            user.EmailVerificationCode = GenerateNumericCode(6);
            user.EmailVerificationCodeExpiryUtc = DateTime.UtcNow.AddMinutes(2);
            await _users.UpdateAsync(user);

            var emailBody = $"Hi {user.FirstName},<br/><p>Your new verification code is <b>{user.EmailVerificationCode}</b>. It expires in 2 minutes.</p>";
            await _email.SendEmailAsync(user.Email, "Resend: Verify your LiveFit Sports account", emailBody);
        }

        public async Task SendForgotPasswordCodeAsync(ForgotPasswordRequest req)
        {
            var user = await _users.GetByEmailAsync(req.Email);
            if (user == null) throw new ApplicationException("User not found.");

            user.PasswordResetCode = GenerateNumericCode(6);
            user.PasswordResetCodeExpiryUtc = DateTime.UtcNow.AddMinutes(2);
            await _users.UpdateAsync(user);

            var body = $"Hi {user.FirstName},<br/><p>Your password reset code is <b>{user.PasswordResetCode}</b>. It expires in 2 minutes.</p>";
            await _email.SendEmailAsync(user.Email, "LiveFit Sports - Password reset code", body);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequest req)
        {
            var user = await _users.GetByEmailAsync(req.Email);
            if (user == null) throw new ApplicationException("User not found.");

            if (user.PasswordResetCode == null || user.PasswordResetCodeExpiryUtc == null)
                throw new ApplicationException("No reset code found. Request a new one.");

            if (DateTime.UtcNow > user.PasswordResetCodeExpiryUtc.Value)
                throw new ApplicationException("Reset code expired.");

            if (user.PasswordResetCode != req.Code)
                throw new ApplicationException("Invalid reset code.");

            if (!ValidatePassword(req.NewPassword))
                throw new ApplicationException("Password must be at least 6 chars, include 1 uppercase, 1 number and 1 symbol.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            user.PasswordResetCode = null;
            user.PasswordResetCodeExpiryUtc = null;
            await _users.UpdateAsync(user);
        }
    }
}
