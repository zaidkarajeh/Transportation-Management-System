using AutoMapper;
using ServerTransferAPI.Data;

namespace ServerTransferAPI.Model
{
    [AutoMap(typeof(AppSetting), ReverseMap = true)]
    public class AppSettingDTO
    {
        public Guid Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public string? Description { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
