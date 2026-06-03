using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;

namespace ServerTransferAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly TransferContext context;

        public ReportsController(TransferContext _context)
        {
            context = _context;
        }

        // GET: api/reports/summary
        [HttpGet]
        [Route("summary")]

        public IActionResult GetSummary()
        {
            // --- Instant Orders ---
            var instantOrders = context.InstantOrders.AsNoTracking();
            var totalInstantOrders = instantOrders.Count();
            var completedInstant = instantOrders.Count(o => o.Status == "تم التوصيل");
            var cancelledInstant = instantOrders.Count(o => o.Status == "ملغي");
            var totalInstantRevenue = instantOrders.Where(o => o.Status == "تم التوصيل").Sum(o => (decimal?)o.Price) ?? 0;
            var totalInstantCommission = instantOrders.Where(o => o.Status == "تم التوصيل").Sum(o => (decimal?)o.CompanyCommission) ?? 0;

            // --- Subscriptions ---
            var subscriptions = context.Subscriptions.AsNoTracking();
            var totalSubscriptions = subscriptions.Count();
            var activeSubscriptions = subscriptions.Count(s => s.Status == "الاشتراك نشط");
            var completedSubscriptions = subscriptions.Count(s => s.Status == "الاشتراك مكتمل");
            var cancelledSubscriptions = subscriptions.Count(s => s.Status == "الاشتراك ملغي");
            var totalSubRevenue = subscriptions.Where(s => s.Status == "الاشتراك مكتمل").Sum(s => (decimal?)s.TotalMonthlyPrice) ?? 0;
            var totalSubCommission = subscriptions.Where(s => s.Status == "الاشتراك مكتمل").Sum(s => (decimal?)s.CompanyCommission) ?? 0;

            // --- Payments ---

            var logs = context.DriverPaymentLogs.AsNoTracking();
            var totalCommissionDue = logs.Sum(l => (decimal?)l.CommissionAmount) ?? 0;
            var totalCommissionPaid = logs.Where(l => l.IsPaid).Sum(l => (decimal?)l.CommissionAmount) ?? 0;
            var totalCommissionUnpaid = logs.Where(l => !l.IsPaid).Sum(l => (decimal?)l.CommissionAmount) ?? 0;
            var unpaidDriversCount = logs.Where(l => !l.IsPaid).Select(l => l.DriverId).Distinct().Count();

            return Ok(new
            {
                // --- Instant Orders ---

                instantOrders = new
                {
                    total = totalInstantOrders,
                    completed = completedInstant,
                    cancelled = cancelledInstant,
                    revenue = totalInstantRevenue,
                    commission = totalInstantCommission
                },
                // --- Subscriptions ---
                subscriptions = new
                {
                    total = totalSubscriptions,
                    active = activeSubscriptions,
                    completed = completedSubscriptions,
                    cancelled = cancelledSubscriptions,
                    revenue = totalSubRevenue,
                    commission = totalSubCommission
                },
                // --- Payments ---

                payments = new
                {
                    totalDue = totalCommissionDue,
                    totalPaid = totalCommissionPaid,
                    totalUnpaid = totalCommissionUnpaid,
                    unpaidDrivers = unpaidDriversCount
                },
                // Totals
                totals = new
                {
                    revenue = totalInstantRevenue + totalSubRevenue,
                    commission = totalInstantCommission + totalSubCommission
                }
            });
        }

        // GET: api/reports/monthly?year=2026
        // Monthly report: revenue and commissions per month

        [HttpGet]
        [Route("monthly")]

        public IActionResult GetMonthly([FromQuery] int year = 0)
        {
            if (year == 0) year = DateTime.Now.Year;

            // Monthly instant orders
            var instantMonthly = context.InstantOrders
                .AsNoTracking()
                .Where(o => o.Status == "تم التوصيل" && o.CreatedAt.Year == year)
                .GroupBy(o => o.CreatedAt.Month)
                .Select(g => new
                {
                    month = g.Key,
                    revenue = g.Sum(o => o.Price),
                    commission = g.Sum(o => o.CompanyCommission),
                    count = g.Count()
                }).ToList();

            // Monthly subscriptions
            var subMonthly = context.Subscriptions
                .AsNoTracking()
                .Where(s => s.Status == "الاشتراك مكتمل" && s.EndDate.Year == year)
                .GroupBy(s => s.EndDate.Month)
                .Select(g => new
                {
                    month = g.Key,
                    revenue = g.Sum(s => s.TotalMonthlyPrice),
                    commission = g.Sum(s => s.CompanyCommission),
                    count = g.Count()
                }).ToList();

            // Merge both into 12 months
            var months = Enumerable.Range(1, 12).Select(m => new
            {
                month = m,
                instantRevenue = instantMonthly.FirstOrDefault(x => x.month == m)?.revenue ?? 0,
                instantCommission = instantMonthly.FirstOrDefault(x => x.month == m)?.commission ?? 0,
                instantCount = instantMonthly.FirstOrDefault(x => x.month == m)?.count ?? 0,
                subRevenue = subMonthly.FirstOrDefault(x => x.month == m)?.revenue ?? 0,
                subCommission = subMonthly.FirstOrDefault(x => x.month == m)?.commission ?? 0,
                subCount = subMonthly.FirstOrDefault(x => x.month == m)?.count ?? 0,
                totalRevenue = (instantMonthly.FirstOrDefault(x => x.month == m)?.revenue ?? 0)
                                    + (subMonthly.FirstOrDefault(x => x.month == m)?.revenue ?? 0),
                totalCommission = (instantMonthly.FirstOrDefault(x => x.month == m)?.commission ?? 0)
                                    + (subMonthly.FirstOrDefault(x => x.month == m)?.commission ?? 0)
            }).ToList();

            return Ok(new { year, months });
        }

        // GET: api/reports/drivers
        // Driver report: how much each driver owes
        [HttpGet]
        [Route("drivers")]

        public IActionResult GetDriversReport()
        {
            var report = (from log in context.DriverPaymentLogs.AsNoTracking()
                          join driver in context.Drivers.AsNoTracking()
                          on log.DriverId equals driver.Id
                          group log by new { log.DriverId, driver.Name } into g
                          select new
                          {
                              driverId = g.Key.DriverId,
                              driverName = g.Key.Name,
                              totalCollected = g.Sum(l => l.TotalCollected),
                              totalCommission = g.Sum(l => l.CommissionAmount),
                              totalPaid = g.Where(l => l.IsPaid).Sum(l => l.CommissionAmount),
                              totalUnpaid = g.Where(l => !l.IsPaid).Sum(l => l.CommissionAmount),
                              logsCount = g.Count(),
                              unpaidCount = g.Count(l => !l.IsPaid)
                          }).ToList();

            return Ok(report);
        }

        // GET: api/reports/recentorders
        [HttpGet]
        [Route("recentorders")]

        public IActionResult GetRecentOrders()
        {
            var orders = (from order in context.InstantOrders.AsNoTracking()
                          join client in context.Clients.AsNoTracking()
                          on order.ClientId equals client.Id
                          join driver in context.Drivers.AsNoTracking()
                          on order.DriverId equals driver.Id into driverGroup
                          from driver in driverGroup.DefaultIfEmpty()
                          orderby order.CreatedAt descending
                          select new
                          {
                              id = order.Id,
                              clientName = client.Name,
                              driverName = driver != null ? driver.Name : null,
                              pickupAddress = order.PickupAddress,
                              price = order.Price,
                              status = order.Status,
                              createdAt = order.CreatedAt
                          }).Take(5).ToList();

            return Ok(orders);
        }
        // GET: api/reports/expiringsubscriptions
        // Modify the existing and add details
        [HttpGet]
        [Route("expiringsubscriptions")]

        public IActionResult GetExpiringSubscriptions()
        {
            var today = DateTime.Today;
            var endOfMonth = new DateTime(today.Year, today.Month,
                DateTime.DaysInMonth(today.Year, today.Month));

            var subscriptions = (from sub in context.Subscriptions.AsNoTracking()
                                 join client in context.Clients.AsNoTracking()
                                 on sub.ClientId equals client.Id
                                 where sub.Status == "الاشتراك نشط"
                                    && sub.EndDate >= today
                                    && sub.EndDate <= endOfMonth
                                 orderby sub.EndDate ascending
                                 select new
                                 {
                                     id = sub.Id,
                                     clientName = client.Name,
                                     endDate = sub.EndDate,
                                     daysLeft = (sub.EndDate - today).Days,
                                     price = sub.TotalMonthlyPrice
                                 }).ToList();

            return Ok(new
            {
                count = subscriptions.Count,
                subscriptions = subscriptions
            });
        }

        // GET: api/reports/recentactivity
        [HttpGet]
        [Route("recentactivity")]

        public IActionResult GetRecentActivity()
        {
            var activities = new List<object>();

            // Last 3 instant orders
            var recentOrders = (from o in context.InstantOrders.AsNoTracking()
                                join c in context.Clients.AsNoTracking()
                                on o.ClientId equals c.Id
                                orderby o.CreatedAt descending
                                select new
                                {
                                    type = "order",
                                    icon = "pi pi-car",
                                    color = "blue",
                                    title = "طلب فوري جديد",
                                    desc = c.Name,
                                    createdAt = o.CreatedAt
                                }).Take(3).ToList<object>();

            // Last 3 subscriptions
            var recentSubs = (from s in context.Subscriptions.AsNoTracking()
                              join c in context.Clients.AsNoTracking()
                              on s.ClientId equals c.Id
                              orderby s.CreatedAt descending
                              select new
                              {
                                  type = "subscription",
                                  icon = "pi pi-calendar",
                                  color = "purple",
                                  title = "اشتراك جديد",
                                  desc = c.Name,
                                  createdAt = s.CreatedAt
                              }).Take(3).ToList<object>();

            // Last 3 payments
            var recentPayments = (from l in context.DriverPaymentLogs.AsNoTracking()
                                  join d in context.Drivers.AsNoTracking()
                                  on l.DriverId equals d.Id
                                  where l.IsPaid == true
                                  orderby l.PaidAt descending
                                  select new
                                  {
                                      type = "payment",
                                      icon = "pi pi-wallet",
                                      color = "green",
                                      title = "دفعة مسددة",
                                      desc = d.Name,
                                      createdAt = l.PaidAt
                                  }).Take(3).ToList<object>();

            // Merge and sort by date
            activities.AddRange(recentOrders);
            activities.AddRange(recentSubs);
            activities.AddRange(recentPayments);

            return Ok(activities);
        }
    }
}
