using System.Threading.Tasks;

namespace LiveFitSports.API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlContent);
    }
}
