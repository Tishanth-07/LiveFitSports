using System.ComponentModel.DataAnnotations;

namespace LiveFitSports.API.DTOs.Auth
{
    public class VerifyEmailRequest
    {
        [Required][EmailAddress] public required string Email { get; set; }
        [Required] public required string Code { get; set; }
    }
}
