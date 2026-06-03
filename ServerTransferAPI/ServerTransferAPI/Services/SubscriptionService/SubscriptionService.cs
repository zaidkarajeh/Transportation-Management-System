using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.SubscriptionService
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly TransferContext context;
        private readonly IMapper mapper;

        public SubscriptionService(TransferContext _context, IMapper _mapper )
        {
            context = _context;
            mapper = _mapper;
        }

        public void Insert(SubscriptionDTO subscriptionDTO)
        {
            try
            {
                var newOrder = mapper.Map<Subscription>(subscriptionDTO);
                newOrder.Client = null;
                newOrder.Driver = null;

                // ✅ احسب العمولة تلقائياً
                var setting = context.AppSettings
       .AsNoTracking()
       .FirstOrDefault(x => x.Key == "SubscriptionCommissionRate");

                decimal rate = setting != null ? decimal.Parse(setting.Value) : 0.10m;
                newOrder.CompanyCommission = Math.Round(newOrder.TotalMonthlyPrice * rate, 2);

                context.Subscriptions.Add(newOrder);
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
        }

        public List<SubscriptionDTO> GetAllSubscriptions()

        {
            var subscriptions = (from sub in context.Subscriptions

                                 join driver in context.Drivers
                                 on sub.DriverId equals driver.Id into driverGroup
                                 from driver in driverGroup.DefaultIfEmpty()

                                 join client in context.Clients
                                 on sub.ClientId equals client.Id

                                 select new SubscriptionDTO
                                 {
                                     Id = sub.Id,
                                     PickupAddress = sub.PickupAddress,
                                     PickUpTime = sub.PickUpTime,
                                     ReturnPickupAddress = sub.ReturnPickupAddress,
                                     ReturnPickUpTime = sub.ReturnPickUpTime,
                                     OffDays = sub.OffDays,
                                     StartDate = sub.StartDate,
                                     EndDate = sub.EndDate,
                                     SeatsCount = sub.SeatsCount,
                                     TotalMonthlyPrice = sub.TotalMonthlyPrice,
                                     CompanyCommission = sub.CompanyCommission,
                                     Status = sub.Status,
                                     DriverId = sub.DriverId,
                                     DriverName = driver != null ? driver.Name : null,
                                     ClientId = client.Id,
                                     ClientName = client.Name
                                 }).ToList();

            return subscriptions;
        }

        // في SubscriptionService
        public void Delete(Guid id)
        {
            Subscription sub = context.Subscriptions.Find(id);
            if (sub == null) throw new Exception("الاشتراك غير موجود");

            // ✅ تحقق إذا في سجل مالي
            bool hasPaymentLog = context.DriverPaymentLogs
                .Any(x => x.SubscriptionId == id);

            if (hasPaymentLog)
                throw new Exception("لا يمكن حذف الاشتراك لأن له سجل مالي مرتبط");

            context.Subscriptions.Remove(sub);
            context.SaveChanges();
        }

        public SubscriptionDTO GetSubscription(Guid id)
        {
            Subscription sub = context.Subscriptions.Find(id);
            if (sub == null) throw new Exception("الاشتراك غير موجود");
            return mapper.Map<SubscriptionDTO>(sub);
        }

        public void UpdateSubscription(SubscriptionDTO subscriptionDTO)
        {
            Subscription existing = context.Subscriptions.Find(subscriptionDTO.Id);
            if (existing == null) throw new Exception("الاشتراك غير موجود");

            string oldStatus = existing.Status;
            var oldDriverId = existing.DriverId;

            mapper.Map(subscriptionDTO, existing);
            existing.Driver = null;
            existing.Client = null;

            // ✅ إعادة حساب العمولة
            var setting = context.AppSettings
       .AsNoTracking()
       .FirstOrDefault(x => x.Key == "SubscriptionCommissionRate");

            decimal rate = setting != null ? decimal.Parse(setting.Value) : 0.10m;
            existing.CompanyCommission = Math.Round(existing.TotalMonthlyPrice * rate, 2);

            context.SaveChanges();

            // ✅ لما تصير "الاشتراك مكتمل" بس، انشئ سجل مالي
            if (oldStatus != "الاشتراك مكتمل" && existing.Status == "الاشتراك مكتمل")
            {
                if (existing.DriverId.HasValue)
                {
                    int month = existing.EndDate.Month;
                    int year = existing.EndDate.Year;

                    bool alreadyLogged = context.DriverPaymentLogs
                        .Any(x => x.SubscriptionId == existing.Id
                                && x.SubscriptionMonth == month
                                && x.SubscriptionYear == year);

                    if (!alreadyLogged)
                    {
                        var log = new DriverPaymentLog
                        {
                            DriverId = existing.DriverId.Value,
                            PaymentType = "Subscription",
                            SubscriptionId = existing.Id,
                            SubscriptionMonth = month,
                            SubscriptionYear = year,
                            TotalCollected = existing.TotalMonthlyPrice,
                            CommissionAmount = existing.CompanyCommission,
                            DriverNet = existing.TotalMonthlyPrice - existing.CompanyCommission,
                            IsPaid = false
                        };

                        context.DriverPaymentLogs.Add(log);
                        context.SaveChanges();
                    }
                }
            }

            // ✅ إعادة حساب المقاعد
            if (oldDriverId.HasValue && oldDriverId != subscriptionDTO.DriverId)
                RecalculateAvailableSeats(oldDriverId.Value);

            if (subscriptionDTO.DriverId.HasValue)
                RecalculateAvailableSeats(subscriptionDTO.DriverId.Value);
        }
        private void RecalculateAvailableSeats(Guid driverId)
        {
            var driver = context.Drivers.Find(driverId);
            if (driver == null) return;

            // مجموع المقاعد المحجوزة في الاشتراكات النشطة فقط
            var usedSeats = context.Subscriptions
                .Where(s => s.DriverId == driverId && s.Status == "الاشتراك نشط")
                .Sum(s => (int?)s.SeatsCount) ?? 0;

            // المقاعد المتاحة = الكلية - المستخدمة
            driver.AvailableSeats = driver.TotalSeats - usedSeats;

            context.SaveChanges();
        }

     
    }
}