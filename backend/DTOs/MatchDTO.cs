namespace LiveFitSports.API.DTOs
{
    public class MatchDTO
    {
        public required string Id { get; set; }
        public string? Sport { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public DateTime StartAtUtc { get; set; }
        public string? ImageUrl { get; set; }
    }
}
