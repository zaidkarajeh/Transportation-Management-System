using AutoMapper;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.ClientService
{
    public class ClientService : IClientService
    {
        private readonly TransferContext context;
        private readonly IMapper mapper;

        public ClientService(TransferContext _context, IMapper _mapper)
        {
            context = _context;
            mapper = _mapper;
        }

        public void Insert(ClientDTO clientDTO)
        {
            Client newClient = mapper.Map<Client>(clientDTO);
            newClient.PersonType = "Client"; // ✅ تأكد هاد موجود

            context.Clients.Add(newClient);

            context.SaveChanges();
        }

        public List<ClientDTO> GetAllClients()
        {
            List<Client> Allclients = context.Clients.ToList();

            List<ClientDTO> clients = mapper.Map<List<ClientDTO>>(Allclients);

            return clients;
        }

        public void Delete(Guid Id)
        {
            Client client = context.Clients.Find(Id);

            context.Clients.Remove(client);

            context.SaveChanges();
        }

        public ClientDTO GetClient(Guid Id)
        {
            Client client = context.Clients.Find(Id);

            ClientDTO clientDTO = mapper.Map<ClientDTO> (client);

            return clientDTO;
        }

        public void UpdateClient(ClientDTO dTO)
        {
            var existing = context.Clients.Find(dTO.Id);
            if (existing == null) throw new Exception("العميل غير موجود");

            mapper.Map(dTO, existing);
            context.SaveChanges();
        }



    }
}
