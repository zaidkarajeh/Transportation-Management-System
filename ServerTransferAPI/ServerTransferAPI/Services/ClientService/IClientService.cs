using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.ClientService
{
    public interface IClientService
    {
        void Insert(ClientDTO clientDTO);


        List<ClientDTO> GetAllClients();

        void Delete(Guid Id);

        ClientDTO GetClient(Guid Id);


       void UpdateClient(ClientDTO dTO);
    }
}