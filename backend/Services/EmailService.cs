using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace LiveFitSports.API.Services
{
    public class SmtpSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string User { get; set; } = string.Empty;
        public string Pass { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
    }

    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _settings;
        public EmailService(IConfiguration config)
        {
            _settings = config.GetSection("SmtpSettings").Get<SmtpSettings>()
                ?? throw new InvalidOperationException("SmtpSettings configuration section is missing or invalid.");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlContent };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.Host, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.User, _settings.Pass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
