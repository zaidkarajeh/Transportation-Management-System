using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.DriverPaymentService
{
    public interface IDriverPaymentService
    {
        List<DriverPaymentLogDTO> GetAll();
        List<DriverPaymentLogDTO> GetByDriver(Guid driverId);
        List<DriverPaymentLogDTO> GetUnpaid();
        void MarkAsPaid(Guid id);
    }
}