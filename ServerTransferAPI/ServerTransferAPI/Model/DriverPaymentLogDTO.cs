using AutoMapper;
using ServerTransferAPI.Data;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(DriverPaymentLog), ReverseMap = true)]
    public class DriverPaymentLogDTO
    {
        public Guid Id { get; set; }

        // --- السائق ---
        public Guid DriverId { get; set; }
        public string? DriverName { get; set; }

        // --- نوع العملية ---
        public string PaymentType { get; set; } // "Instant" أو "Subscription"

        // --- الربط ---
        public Guid? InstantOrderId { get; set; }
        public Guid? SubscriptionId { get; set; }

        // بس للاشتراكات
        public int? SubscriptionMonth { get; set; }
        public int? SubscriptionYear { get; set; }

        // --- الأرقام المالية ---
        public decimal TotalCollected { get; set; }
        public decimal CommissionAmount { get; set; }
        public decimal DriverNet { get; set; }

        // --- حالة الدفع ---
        public bool IsPaid { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}