using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.SubscriptionService
{
    public interface ISubscriptionService
    {
        List<SubscriptionDTO> GetAllSubscriptions();
        void Insert(SubscriptionDTO subscriptionDTO);

        void Delete(Guid id);
        SubscriptionDTO GetSubscription(Guid id);
        void UpdateSubscription(SubscriptionDTO subscriptionDTO);
    }
}