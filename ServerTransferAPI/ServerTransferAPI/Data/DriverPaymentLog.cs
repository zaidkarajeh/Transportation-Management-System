using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Data
{
    /// <summary>
    /// يتتبع كل مبلغ مستحق على السائق للشركة
    /// سواء من طلب فوري أو اشتراك شهري
    /// </summary>
    [Table("DriverPaymentLogs")]
    public class DriverPaymentLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // --- السائق ---
        public Guid DriverId { get; set; }
        public Driver Driver { get; set; }

        // --- نوع العملية: "Instant" أو "Subscription" ---
        [Required]
        [StringLength(20)]
        public string PaymentType { get; set; }

        // --- ربط اختياري: واحد منهم بيكون null ---
        public Guid? InstantOrderId { get; set; }
        public InstantOrder InstantOrder { get; set; }

        public Guid? SubscriptionId { get; set; }
        public Subscription Subscription { get; set; }

        // بس للاشتراكات: عن أي شهر/سنة هاد السجل
        public int? SubscriptionMonth { get; set; }  // 1-12
        public int? SubscriptionYear { get; set; }

        // --- الأرقام المالية ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalCollected { get; set; }   // جمعه السائق من العميل

        [Column(TypeName = "decimal(18,2)")]
        public decimal CommissionAmount { get; set; } // حق الشركة (لازم يدفعه)

        [Column(TypeName = "decimal(18,2)")]
        public decimal DriverNet { get; set; }        // صافي السائق = TotalCollected - CommissionAmount

        // --- هل السائق دفع للشركة؟ ---
        public bool IsPaid { get; set; } = false;
        public DateTime? PaidAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}