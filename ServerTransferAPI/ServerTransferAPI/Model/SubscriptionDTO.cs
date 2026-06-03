using AutoMapper;
using ServerTransferAPI.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(Subscription), ReverseMap = true)]
    public class SubscriptionDTO
    {
        public Guid Id { get; set; }

        // معلومات السائق
        public Guid? DriverId { get; set; }
        public string? DriverName { get; set; } // مفيد للعرض المباشر دون عمل Load للـ Object كامل

        // معلومات العميل
        public Guid ClientId { get; set; }
        public string? ClientName { get; set; }

        // المواعيد
        // الوصول

        public string PickupAddress { get; set; }
        public TimeSpan PickUpTime { get; set; }
        // الترويحة 

        public string ReturnPickupAddress { get; set; }
        public TimeSpan ReturnPickUpTime { get; set; }
        // ايام العطل 

        public string OffDays { get; set; }


        // فترة التعاقد
        [DataType(DataType.Date)]
        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }
        [DataType(DataType.Date)]
        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }

        public int SeatsCount { get; set; } // عدد المقاعد المحجوزة

        // مالي وحالة
        public decimal TotalMonthlyPrice { get; set; }
        public decimal CompanyCommission { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
