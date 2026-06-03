using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.DriverService;
using System.Net;

namespace ServerTransferAPI.Services.DriverService
{
    public class DriverService : IDriverService
    {
        private readonly TransferContext context;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment env;

        public DriverService(TransferContext _context, IMapper _mapper, IWebHostEnvironment _env)
        {
            context = _context;
            mapper = _mapper;
            env = _env;
        }

        public async Task InsertAsync(DriverDTO driverDTO)
        {
            string? imagePath = null;

            if (driverDTO.VehicleImageFile != null && driverDTO.VehicleImageFile.Length > 0) // ✅ VehicleImageFile
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                string ext = Path.GetExtension(driverDTO.VehicleImageFile.FileName).ToLower(); // ✅

                if (!allowedExtensions.Contains(ext))
                    throw new BadHttpRequestException("نوع الملف غير مسموح به", 400);

                string uploadsFolder = Path.Combine(env.ContentRootPath, "wwwroot", "uploads", "vehicles");
                Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + ext;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await driverDTO.VehicleImageFile.CopyToAsync(stream); // ✅

                imagePath = $"/uploads/vehicles/{uniqueFileName}";
            }

            Driver newDriver = mapper.Map<Driver>(driverDTO);
            newDriver.Id = Guid.NewGuid();
            newDriver.VehicleImage = imagePath; // ✅ احفظ المسار
            newDriver.AvailableSeats = driverDTO.TotalSeats;
            newDriver.PersonType = "Driver"; // ✅ أضف هاد السطر

            await context.Drivers.AddAsync(newDriver);
            await context.SaveChangesAsync();
        }


        public async Task<List<DriverDTO>> GetAllDriverAsync()
        {
            List<Driver> allDrivers = await context.Drivers.ToListAsync();
            return mapper.Map<List<DriverDTO>>(allDrivers);
        }
        public async Task Delete(Guid Id)
        {
            var driver = await context.Drivers.FindAsync(Id);

            if (driver == null)
                throw new Exception("الكابتن غير موجود");

            // 🔥 تحقق إذا عليه اشتراكات
            var hasSubscriptions = await context.Subscriptions
                .AnyAsync(s => s.DriverId == Id);

            if (hasSubscriptions)
                throw new Exception("لا يمكن حذف الكابتن لأنه مرتبط بمشتركين");

            context.Drivers.Remove(driver);
            await context.SaveChangesAsync();
        }

        public async Task<DriverDTO> GetDrive(Guid Id)
        {
            Driver driver = await context.Drivers.FindAsync(Id);

            DriverDTO driverDTO = mapper.Map<DriverDTO>(driver);
            return driverDTO;
        }

        public async Task Update(DriverDTO driverDTO)
        {
            Driver driver = await context.Drivers.FindAsync(driverDTO.Id);
            if (driver == null)
                throw new KeyNotFoundException($"Driver with ID {driverDTO.Id} not found.");

            string? currentImage = driver.VehicleImage;
            string? newImagePath = null;

            if (driverDTO.VehicleImageFile != null && driverDTO.VehicleImageFile.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                string ext = Path.GetExtension(driverDTO.VehicleImageFile.FileName).ToLower();
                if (!allowedExtensions.Contains(ext))
                    throw new BadHttpRequestException("نوع الملف غير مسموح به", 400);

                string uploadsFolder = Path.Combine(env.ContentRootPath, "wwwroot", "uploads", "vehicles");
                Directory.CreateDirectory(uploadsFolder);
                string uniqueFileName = Guid.NewGuid().ToString() + ext;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await driverDTO.VehicleImageFile.CopyToAsync(stream);
                newImagePath = $"/uploads/vehicles/{uniqueFileName}";
            }

            mapper.Map(driverDTO, driver);
            driver.PersonType = "Driver";
            driver.VehicleImage = newImagePath ?? currentImage;

            // ══════════════════════════════════════════════════
            // لما يتغير TotalSeats — أعد حساب AvailableSeats
            // AvailableSeats = TotalSeats - مجموع المقاعد المحجوزة
            // ══════════════════════════════════════════════════
            var usedSeats = await context.Subscriptions
                .Where(s => s.DriverId == driverDTO.Id && s.Status == "الاشتراك نشط")
                .SumAsync(s => (int?)s.SeatsCount) ?? 0;

            driver.AvailableSeats = driver.TotalSeats - usedSeats;

            await context.SaveChangesAsync();
        }





    }
}


