using AutoMapper;
using ServerTransferAPI.Data;
using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(InstantOrder), ReverseMap = true)]
    public class InstantOrderDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? DriverId { get; set; }

        [Required(ErrorMessage = "العميل مطلوب")]
        public Guid ClientId { get; set; }

        [Required(ErrorMessage = "عنوان الانطلاق مطلوب")]
        public string PickupAddress { get; set; }

        public DateTime? PickupTime { get; set; }

        [Required(ErrorMessage = "عنوان الوصول مطلوب")]
        public string DropoffAddress { get; set; }

        [Required(ErrorMessage = "عدد الركاب مطلوب")]
        public int PassengerCount { get; set; }

        [Required(ErrorMessage = "السعر مطلوب")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "عمولة الكابتن مطلوبة")]
        public decimal CompanyCommission { get; set; }

        [Required(ErrorMessage = "حالة الطلب مطلوبة")]
        public string Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;


        public string? DriverName { get; set; }
        public string? ClientName { get; set; }
    }
}