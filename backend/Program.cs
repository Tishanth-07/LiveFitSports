using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using LiveFitSports.API.Data;
using LiveFitSports.API.Repositories;
using LiveFitSports.API.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using LiveFitSports.API.Utilities;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
// Listen on all network interfaces for dev access from devices
builder.WebHost.UseUrls("http://0.0.0.0:5126");
var configuration = builder.Configuration;

// Add services
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("MongoSettings"));
builder.Services.AddSingleton<MongoContext>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<MatchRepository>();
builder.Services.AddSingleton<FavoriteRepository>();
builder.Services.AddSingleton<IHealthRepository, HealthRepository>();
builder.Services.AddSingleton<HealthService>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LiveFitSports API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token like: **Bearer your_token_here**"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Jwt settings
var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtSettings == null)
{
    // create a default to avoid null refs; ensure to set in appsettings.json
    jwtSettings = new JwtSettings { Secret = "REPLACE_ME_WITH_SECRET", Issuer = "LiveFitSportsAPI", Audience = "LiveFitSportsClient", ExpiresMinutes = 60 };
}



// CORS (allow the local mobile IP)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});


// configure auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(jwtSettings.Secret);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true,
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "images")),
    RequestPath = "/images"
});

// Seed matches
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MongoContext>();
    var seeder = new MatchSeeder(context);
    await seeder.SeedAsync();
}

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MongoContext>();
    await SeedData.SeedAsync(context);
}

app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
