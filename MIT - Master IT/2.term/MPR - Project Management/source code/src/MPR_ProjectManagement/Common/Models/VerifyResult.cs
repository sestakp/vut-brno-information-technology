using Common.Enums;

namespace Common.Models
{
    public class VerifyResult
    {
        public string Email { get; set; } = null!;
        public RoleEnum Role { get; set; }

    }
}
