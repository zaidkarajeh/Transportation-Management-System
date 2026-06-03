using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Data
{
    [Table("InstantOrders")]

    public class InstantOrder
    {

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();


        public Guid? DriverId { get; set; } // معرف السائق المرتبط بالطلب

        public Driver Driver { get; set; }
        public Guid ClientId { get; set; } // معرف العميل (الموظف) اللي طلب التوصيلة
        public Client Client { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string PickupAddress { get; set; } // عنوان نقطة الانطلاق (وين السائق يروح)

        public DateTime PickupTime { get; set; } // تاريخ ووقت الانطلاق المطلوب
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string DropoffAddress { get; set; } // عنوان نقطة الوصول (وين العميل بدو ينزل)
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public int PassengerCount { get; set; } // عدد الركاب (مهم جداً لحسبة مقاعد الباص)
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; } // المبلغ الإجمالي اللي بدفعه العميل
        [Column(TypeName = "decimal(18,2)")]
        public decimal CompanyCommission { get; set; } // صافي ربح السائق (العمولة اللي رح تروحله)
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Status { get; set; } // حالة الطلب: (قيد الانتظار، تم التعيين، تم التوصيل، ملغي)

        public DateTime CreatedAt { get; set; } = DateTime.Now; // وقت إنشاء الطلب تلقائياً (للتوثيق والترتيب)

        public DriverPaymentLog DriverPaymentLog { get; set; }
    }

}