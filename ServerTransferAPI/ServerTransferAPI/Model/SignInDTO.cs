using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Model
{
    public class SignInDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
