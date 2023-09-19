using Common.Enums;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;

namespace EmployeesMicroservice.Models
{
    public class ChangePasswordFormModel
    {

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string OldPassword { get; set; } = string.Empty;

        [Required]
        [Compare(nameof(NewPasswordAgain), ErrorMessage = "Passwords do not match!")]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        public string NewPasswordAgain { get; set; } = string.Empty;
    }
}
