using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;

namespace ServerTransferAPI.Data
{
    public class TransferContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IConfiguration _config;

        public TransferContext(IConfiguration config) : base() { _config = config; }
        public TransferContext(DbContextOptions<TransferContext> options, IConfiguration config) : base(options) { _config = config; }

        // --- الجداول ---
        public DbSet<Person> People { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<InstantOrder> InstantOrders { get; set; }
        public DbSet<DriverPaymentLog> DriverPaymentLogs { get; set; }

        public DbSet<AppSetting> AppSettings { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_config.GetConnectionString("TransferConn"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. إجبار EF Core على إنشاء جداول منفصلة (نظام TPT)
            // هذا السطر هو الذي سيجعل جدول "People" يظهر فعلياً في SQL Server
            modelBuilder.Entity<Person>().ToTable("People");
            modelBuilder.Entity<Client>().ToTable("Clients");
            modelBuilder.Entity<Driver>().ToTable("Drivers");

            // 2. إعدادات InstantOrders
            modelBuilder.Entity<InstantOrder>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.HasOne(o => o.Driver).WithMany(d => d.InstantOrders).HasForeignKey(o => o.DriverId).OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(o => o.Client).WithMany(c => c.InstantOrders).HasForeignKey(o => o.ClientId).OnDelete(DeleteBehavior.NoAction);
            });

            // 3. إعدادات Subscriptions
            modelBuilder.Entity<Subscription>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.HasOne(s => s.Driver).WithMany(d => d.Subscriptions).HasForeignKey(s => s.DriverId).OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(s => s.Client).WithMany(c => c.Subscriptions).HasForeignKey(s => s.ClientId).OnDelete(DeleteBehavior.NoAction);
            });

            // 4. إعدادات DriverPaymentLog
            modelBuilder.Entity<DriverPaymentLog>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.HasOne(t => t.Driver).WithMany().HasForeignKey(t => t.DriverId).OnDelete(DeleteBehavior.NoAction);
            });

            // ✅ وحط هاد مكانه
            modelBuilder.Entity<AppSetting>().HasData(
                new AppSetting
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Key = "InstantOrderCommissionRate",
                    Value = "0.10",
                    Description = "نسبة عمولة الشركة من الطلبات الفورية (10%)",
                    UpdatedAt = new DateTime(2025, 1, 1)
                },
                new AppSetting
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Key = "SubscriptionCommissionRate",
                    Value = "0.10",
                    Description = "نسبة عمولة الشركة من الاشتراكات الشهرية (10%)",
                    UpdatedAt = new DateTime(2025, 1, 1)
                }
            );

        }


    }
}