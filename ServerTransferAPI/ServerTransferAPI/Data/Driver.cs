using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Data
{
    [Table("Drivers")]
    public class Driver : Person
    {
        [StringLength(50)] // الاسم مثلاً حده 100 حرف
        public string CarType { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string CarNumber { get; set; }
        [NotMapped] // ✅ هيك ما بيروح لقاعدة البيانات

        public IFormFile? VehicleImageFile { get; set; } // للرفع بس

        public string VehicleImage { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Status { get; set; } // Active / Inactive

        public DateTime? JoinDate { get; set; }

        public int TotalSeats { get; set; } // السعة الكلية (مثلاً 15)

        public int? AvailableSeats { get; set; } // المقاعد الفاضية حالياً

        // Relationships
        public List<Subscription> Subscriptions { get; set; }
        public List<InstantOrder> InstantOrders { get; set; }
    }
}