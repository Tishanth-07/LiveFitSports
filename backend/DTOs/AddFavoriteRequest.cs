using System.ComponentModel.DataAnnotations;

namespace LiveFitSports.API.DTOs
{
    public class AddFavoriteRequest
    {
        [Required]
        public required string ItemId { get; set; }
        public string? ItemType { get; set; }
    }
}
