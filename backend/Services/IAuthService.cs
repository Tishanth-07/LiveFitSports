using System.Threading.Tasks;
using LiveFitSports.API.DTOs.Auth;

namespace LiveFitSports.API.Services
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterRequest req);
        Task<string> LoginAsync(LoginRequest req);
        Task<bool> VerifyEmailAsync(VerifyEmailRequest req);
        Task ResendVerificationCodeAsync(ResendVerificationRequest req);
        Task SendForgotPasswordCodeAsync(ForgotPasswordRequest req);
        Task ResetPasswordAsync(ResetPasswordRequest req);
    }
}
