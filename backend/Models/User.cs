using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LiveFitSports.API.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        // Basic profile
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public required string Email { get; set; }
        public required string PasswordHash { get; set; } // For email+password signup

        public bool EmailVerified { get; set; } = false;

        // Verification / reset codes
        public string? EmailVerificationCode { get; set; }
        public DateTime? EmailVerificationCodeExpiryUtc { get; set; }

        public string? PasswordResetCode { get; set; }
        public DateTime? PasswordResetCodeExpiryUtc { get; set; }


        // Roles & created date
        public List<string> Roles { get; set; } = new List<string> { "User" };
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
