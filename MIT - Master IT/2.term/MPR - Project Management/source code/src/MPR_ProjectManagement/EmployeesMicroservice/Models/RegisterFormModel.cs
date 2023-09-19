using System.ComponentModel.DataAnnotations;

namespace EmployeesMicroservice.Models
{
    public class RegisterFormModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int Role { get; set; }

    }
}
