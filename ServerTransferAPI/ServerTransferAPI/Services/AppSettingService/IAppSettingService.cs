using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.AppSettingService
{
    public interface IAppSettingService
    {
        List<AppSettingDTO> GetAll();
        AppSettingDTO GetByKey(string key);
        void Update(AppSettingDTO dto);
    }
}