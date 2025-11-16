using System.ComponentModel.DataAnnotations;

namespace LiveFitSports.API.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required] public required string FirstName { get; set; }
        [Required] public required string LastName { get; set; }
        [Required][EmailAddress] public required string Email { get; set; }
        [Required] public required string Password { get; set; }
    }
}
