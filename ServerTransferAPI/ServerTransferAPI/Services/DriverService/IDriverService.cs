using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.DriverService
{
    public interface IDriverService
    {
        Task InsertAsync(DriverDTO driverDTO);


         Task<List<DriverDTO>> GetAllDriverAsync();


         Task Delete(Guid Id);


        Task<DriverDTO> GetDrive(Guid Id);


        Task Update(DriverDTO driverDTO);

    }
}