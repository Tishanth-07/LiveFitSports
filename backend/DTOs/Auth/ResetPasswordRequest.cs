using System.ComponentModel.DataAnnotations;

namespace LiveFitSports.API.DTOs.Auth
{
    public class ResetPasswordRequest
    {
        [Required][EmailAddress] public required string Email { get; set; }
        [Required] public required string Code { get; set; }
        [Required] public required string NewPassword { get; set; }
    }
}
