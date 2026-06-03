using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.ClientService;

namespace ServerTransferAPI.Controllers.Client
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientController : ControllerBase
    {
        private readonly IClientService clientService;

        public ClientController(IClientService _clientService)
        {
            clientService = _clientService;
        }
        [HttpPost]
        [Route("AddClient")]
        public void AddClient(ClientDTO dTO)
        {

            clientService.Insert(dTO);
        }

        [HttpGet]
        [Route("LoadAllClients")]
        public List<ClientDTO> LoadAllClients()
        {
           return clientService.GetAllClients();
        }

        [HttpDelete]
        [Route("DeleteClients")]
        public void DeleteClients(Guid Id)
        {
            clientService.Delete(Id);
        }

        [HttpGet]
        [Route("LoadClient")]
        public ClientDTO LoadClient(Guid Id)
        {
            return clientService.GetClient(Id);
        }

        [HttpPut]
        [Route("UpdateClient")]
        public IActionResult UpdateClient([FromBody] ClientDTO dTO)
        {
            try
            {
                clientService.UpdateClient(dTO);
                return Ok("Client updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


    }
}
