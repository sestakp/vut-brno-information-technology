using System.ComponentModel.DataAnnotations;

namespace EmployeesMicroservice.Models
{
    public class LoginFormModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
