using AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(Client), ReverseMap = true)]

    public class ClientDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();


        [Required(ErrorMessage = "الاسم مطلوب")]
        public string Name { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string Phone { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}