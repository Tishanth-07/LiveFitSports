using System.ComponentModel.DataAnnotations;

namespace LiveFitSports.API.DTOs.Auth
{
    public class ForgotPasswordRequest
    {
        [Required][EmailAddress] public required string Email { get; set; }
    }
}
