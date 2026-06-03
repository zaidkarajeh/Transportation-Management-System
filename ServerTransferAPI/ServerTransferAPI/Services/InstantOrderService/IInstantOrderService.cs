using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.InstantOrderService
{
    public interface IInstantOrderService
    {
        void Insert(InstantOrderDTO orderDTO);

        List<InstantOrderDTO> GetAllOrders();


        void Delete(Guid id);
        InstantOrderDTO GetOrder(Guid id);
        void UpdateOrder(InstantOrderDTO orderDTO);
    }
}