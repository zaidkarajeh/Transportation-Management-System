using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Data
{
    [Table("Subscriptions")]
    public class Subscription
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();


        public Guid? DriverId { get; set; } // معرف السائق الملتزم بالاشتراك

        public Driver Driver { get; set; }

        public Guid ClientId { get; set; } // معرف العميل (الموظف)

        public Client Client { get; set; }


        // --- المواعيد اليومية الثابتة ---
        // عنوان نقطة الانطلاق )

        public string PickupAddress { get; set; }


        // موعد نقطة الانطلاق )
        public TimeSpan PickUpTime { get; set; }


        // عنوان نقطة الترويحة )

        public string ReturnPickupAddress { get; set; }
        // موعد نقطة الترويحة )

        public TimeSpan ReturnPickUpTime { get; set; }
        //  ايام العطل  )

        public string OffDays { get; set; }

        // --- فترة التعاقد (Contract Period) ---
        public DateTime StartDate { get; set; } // تاريخ بداية الاشتراك
        public DateTime EndDate { get; set; }   // تاريخ نهاية الاشتراك



        public int SeatsCount { get; set; } // عدد المقاعد المحجوزة
        // --- الجانب المالي (Financials) ---
        // سعر الاشتراك الشهري الكامل

        [Column(TypeName = "decimal(18,2)")]

        public decimal TotalMonthlyPrice { get; set; }

        // عمولة الشركة  
        [Column(TypeName = "decimal(18,2)")]
        public decimal CompanyCommission { get; set; } 

        // --- الحالة والتوثيق ---
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Status { get; set; } 
        public DateTime CreatedAt { get; set; } = DateTime.Now; // وقت إنشاء العقد

        public List<DriverPaymentLog> DriverPaymentLogs { get; set; }

    }

}
