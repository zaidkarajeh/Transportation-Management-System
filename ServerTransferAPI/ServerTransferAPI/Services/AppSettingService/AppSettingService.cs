using AutoMapper;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.AppSettingService
{
    public class AppSettingService : IAppSettingService
    {
        private readonly TransferContext context;
        private readonly IMapper mapper;

        public AppSettingService(TransferContext _context, IMapper _mapper)
        {
            context = _context;
            mapper = _mapper;
        }

      
        public List<AppSettingDTO> GetAll()
        {
            return context.AppSettings
                .Select(s => new AppSettingDTO
                {
                    Id = s.Id,
                    Key = s.Key,
                    Value = s.Value,
                    Description = s.Description,
                    UpdatedAt = s.UpdatedAt
                }).ToList();
        }

    
        public AppSettingDTO GetByKey(string key)
        {
            var setting = context.AppSettings
                .FirstOrDefault(s => s.Key == key);

            if (setting == null)
                throw new Exception($"الإعداد '{key}' غير موجود");

            return mapper.Map<AppSettingDTO>(setting);
        }

    
        public void Update(AppSettingDTO dto)
        {
            var existing = context.AppSettings.Find(dto.Id);
            if (existing == null)
                throw new Exception("الإعداد غير موجود");

            // بنغير القيمة والوصف بس، الـ Key ما يتغير
            existing.Value = dto.Value;
            existing.Description = dto.Description;
            existing.UpdatedAt = DateTime.Now;

            context.SaveChanges();
        }
    }
}
