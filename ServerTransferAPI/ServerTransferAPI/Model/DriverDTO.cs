using AutoMapper;
using ServerTransferAPI.Data;
using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(Driver), ReverseMap = true)]

    public class DriverDTO
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

        [Required]
        public string CarType { get; set; }
        [Required]

        public string CarNumber { get; set; }

        public string? VehicleImage { get; set; } // ✅ string للقراءة

        public IFormFile? VehicleImageFile { get; set; } // ✅ IFormFile للرفع        [Required]

        public string Status { get; set; } = "Active";
        [Required]

        public int TotalSeats { get; set; } // السعة الكلية (مثلاً 15)
        public int? AvailableSeats { get; set; }

        public DateTime? JoinDate { get; set; } = DateTime.Now;
    }
}
