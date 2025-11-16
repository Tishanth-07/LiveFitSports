using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LiveFitSports.API.Utilities
{
    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpiresMinutes { get; set; } = 60;
    }

    public static class JwtTokenGenerator
    {
        public static string GenerateToken(Models.User user, JwtSettings settings)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(settings.Secret);

            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim("given_name", user.FirstName ?? ""),
                new Claim("family_name", user.LastName ?? ""),
            };

            var identity = new ClaimsIdentity(claims);

            var roleClaims = new System.Collections.Generic.List<Claim>();
            if (user.Roles != null)
            {
                foreach (var r in user.Roles)
                    roleClaims.Add(new Claim(ClaimTypes.Role, r));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(identity.Claims.Concat(roleClaims)),
                Expires = DateTime.UtcNow.AddMinutes(settings.ExpiresMinutes > 0 ? settings.ExpiresMinutes : 60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = settings.Issuer,
                Audience = settings.Audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
