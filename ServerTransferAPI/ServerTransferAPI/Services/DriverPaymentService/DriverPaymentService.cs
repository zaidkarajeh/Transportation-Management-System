using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.DriverPaymentService
{
    public class DriverPaymentService : IDriverPaymentService
    {
        private readonly TransferContext context;

        public DriverPaymentService(TransferContext _context)
        {
            context = _context;
        }

     
        public List<DriverPaymentLogDTO> GetAll()
        {
            return (from log in context.DriverPaymentLogs
                    join driver in context.Drivers
                    on log.DriverId equals driver.Id
                    select new DriverPaymentLogDTO
                    {
                        Id = log.Id,
                        DriverId = log.DriverId,
                        DriverName = driver.Name,
                        PaymentType = log.PaymentType,
                        InstantOrderId = log.InstantOrderId,
                        SubscriptionId = log.SubscriptionId,
                        SubscriptionMonth = log.SubscriptionMonth,
                        SubscriptionYear = log.SubscriptionYear,
                        TotalCollected = log.TotalCollected,
                        CommissionAmount = log.CommissionAmount,
                        DriverNet = log.DriverNet,
                        IsPaid = log.IsPaid,
                        PaidAt = log.PaidAt,
                        CreatedAt = log.CreatedAt
                    }).ToList();
        }

   
        public List<DriverPaymentLogDTO> GetByDriver(Guid driverId)
        {
            return (from log in context.DriverPaymentLogs
                    join driver in context.Drivers
                    on log.DriverId equals driver.Id
                    where log.DriverId == driverId
                    select new DriverPaymentLogDTO
                    {
                        Id = log.Id,
                        DriverId = log.DriverId,
                        DriverName = driver.Name,
                        PaymentType = log.PaymentType,
                        InstantOrderId = log.InstantOrderId,
                        SubscriptionId = log.SubscriptionId,
                        SubscriptionMonth = log.SubscriptionMonth,
                        SubscriptionYear = log.SubscriptionYear,
                        TotalCollected = log.TotalCollected,
                        CommissionAmount = log.CommissionAmount,
                        DriverNet = log.DriverNet,
                        IsPaid = log.IsPaid,
                        PaidAt = log.PaidAt,
                        CreatedAt = log.CreatedAt
                    }).ToList();
        }

       
        public List<DriverPaymentLogDTO> GetUnpaid()
        {
            return (from log in context.DriverPaymentLogs
                    join driver in context.Drivers
                    on log.DriverId equals driver.Id
                    where log.IsPaid == false
                    select new DriverPaymentLogDTO
                    {
                        Id = log.Id,
                        DriverId = log.DriverId,
                        DriverName = driver.Name,
                        PaymentType = log.PaymentType,
                        InstantOrderId = log.InstantOrderId,
                        SubscriptionId = log.SubscriptionId,
                        SubscriptionMonth = log.SubscriptionMonth,
                        SubscriptionYear = log.SubscriptionYear,
                        TotalCollected = log.TotalCollected,
                        CommissionAmount = log.CommissionAmount,
                        DriverNet = log.DriverNet,
                        IsPaid = log.IsPaid,
                        PaidAt = log.PaidAt,
                        CreatedAt = log.CreatedAt
                    }).ToList();
        }


        public void MarkAsPaid(Guid id)
        {
            var log = context.DriverPaymentLogs.Find(id);
            if (log == null) throw new Exception("السجل غير موجود");
            if (log.IsPaid) throw new Exception("هاد السجل مدفوع مسبقاً");

            log.IsPaid = true;
            log.PaidAt = DateTime.Now;
            context.SaveChanges();
        }
    }
}