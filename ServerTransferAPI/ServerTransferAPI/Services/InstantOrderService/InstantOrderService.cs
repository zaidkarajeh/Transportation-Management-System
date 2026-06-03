using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.InstantOrderService
{
    public class InstantOrderService : IInstantOrderService
    {
        private readonly TransferContext context;
        private readonly IMapper mapper;

        public InstantOrderService(TransferContext _context, IMapper _mapper)
        {
            context = _context;
            mapper = _mapper;
        }

        public void Insert(InstantOrderDTO orderDTO)
        {
            try
            {
                var newOrder = mapper.Map<InstantOrder>(orderDTO);
                newOrder.Client = null;
                newOrder.Driver = null;

                var setting = context.AppSettings
                    .AsNoTracking()
                    .FirstOrDefault(x => x.Key == "InstantOrderCommissionRate");
                decimal rate = setting != null ? decimal.Parse(setting.Value) : 0.10m;
                newOrder.CompanyCommission = Math.Round(newOrder.Price * rate, 2);

                context.InstantOrders.Add(newOrder);
                context.SaveChanges();

                // ✅ لو اتنشأ مباشرة بحالة "تم التوصيل"، انشئ سجل مالي
                if (newOrder.Status == "تم التوصيل" && newOrder.DriverId.HasValue)
                {
                    var log = new DriverPaymentLog
                    {
                        DriverId = newOrder.DriverId.Value,
                        PaymentType = "Instant",
                        InstantOrderId = newOrder.Id,
                        TotalCollected = newOrder.Price,
                        CommissionAmount = newOrder.CompanyCommission,
                        DriverNet = newOrder.Price - newOrder.CompanyCommission,
                        IsPaid = false
                    };

                    context.DriverPaymentLogs.Add(log);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.InnerException?.Message ?? ex.Message);
            }
        }

        public List<InstantOrderDTO> GetAllOrders()
        {
            var orders = (from order in context.InstantOrders
                          join driver in context.Drivers
                          on order.DriverId equals driver.Id into driverGroup
                          from driver in driverGroup.DefaultIfEmpty()
                          join client in context.Clients
                          on order.ClientId equals client.Id
                          select new InstantOrderDTO
                          {
                              Id = order.Id,
                              PickupAddress = order.PickupAddress,
                              DropoffAddress = order.DropoffAddress,
                              PickupTime = order.PickupTime,
                              PassengerCount = order.PassengerCount,
                              Price = order.Price,
                              CompanyCommission = order.CompanyCommission,
                              Status = order.Status,
                              DriverId = order.DriverId,
                              DriverName = driver != null ? driver.Name : null,
                              ClientId = client.Id,
                              ClientName = client.Name
                          }).ToList();

            return orders;
        }

        public void Delete(Guid id)
        {
            InstantOrder order = context.InstantOrders.Find(id);
            if (order == null) throw new Exception("الطلب غير موجود");

            bool hasPaymentLog = context.DriverPaymentLogs
                .Any(x => x.InstantOrderId == id);

            if (hasPaymentLog)
                throw new Exception("لا يمكن حذف الطلب لأن له سجل مالي مرتبط");

            context.InstantOrders.Remove(order);
            context.SaveChanges();
        }

        public InstantOrderDTO GetOrder(Guid id)
        {
            InstantOrder order = context.InstantOrders.Find(id);
            if (order == null) throw new Exception("الطلب غير موجود");
            return mapper.Map<InstantOrderDTO>(order);
        }

        public void UpdateOrder(InstantOrderDTO orderDTO)
        {
            InstantOrder existing = context.InstantOrders.Find(orderDTO.Id);
            if (existing == null) throw new Exception("الطلب غير موجود");

            string oldStatus = existing.Status;

            mapper.Map(orderDTO, existing);
            existing.Driver = null;
            existing.Client = null;

            var setting = context.AppSettings
                .AsNoTracking()
                .FirstOrDefault(x => x.Key == "InstantOrderCommissionRate");
            decimal rate = setting != null ? decimal.Parse(setting.Value) : 0.10m;
            existing.CompanyCommission = Math.Round(existing.Price * rate, 2);

            context.SaveChanges();

            // ✅ لو الطلب مكتمل وتغير السعر، حدّث السجل المالي
            if (existing.Status == "تم التوصيل")
            {
                var paymentLog = context.DriverPaymentLogs
                    .FirstOrDefault(x => x.InstantOrderId == existing.Id);

                if (paymentLog != null)
                {
                    paymentLog.TotalCollected = existing.Price;
                    paymentLog.CommissionAmount = existing.CompanyCommission;
                    paymentLog.DriverNet = existing.Price - existing.CompanyCommission;
                    context.SaveChanges();
                }
            }

            // ✅ لما تصير "تم التوصيل" لأول مرة، انشئ سجل مالي
            if (oldStatus != "تم التوصيل" && existing.Status == "تم التوصيل")
            {
                bool alreadyLogged = context.DriverPaymentLogs
                    .Any(x => x.InstantOrderId == existing.Id);

                if (!alreadyLogged && existing.DriverId.HasValue)
                {
                    var log = new DriverPaymentLog
                    {
                        DriverId = existing.DriverId.Value,
                        PaymentType = "Instant",
                        InstantOrderId = existing.Id,
                        TotalCollected = existing.Price,
                        CommissionAmount = existing.CompanyCommission,
                        DriverNet = existing.Price - existing.CompanyCommission,
                        IsPaid = false
                    };

                    context.DriverPaymentLogs.Add(log);
                    context.SaveChanges();
                }
            }
        }
    }
}