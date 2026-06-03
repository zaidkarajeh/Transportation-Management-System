using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.InstantOrderService;

namespace ServerTransferAPI.Controllers.InstantOrder
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class InstantOrderController : ControllerBase
    {
        private readonly IInstantOrderService instantOrderService;

        public InstantOrderController(IInstantOrderService _instantOrderService)
        {
            instantOrderService = _instantOrderService;
        }


        // add new order
        [HttpPost]
        [Route("AddOrder")]
        public IActionResult AddOrder(InstantOrderDTO dTO)
        {
            try
            {
                instantOrderService.Insert(dTO);
                return Ok("Order added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // get all orders
        [HttpGet]
        [Route("LoadAllOrders")]
        public IActionResult LoadAllOrders()
        {
            try
            {
                return Ok(instantOrderService.GetAllOrders());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // delete order by id
        [HttpDelete]
        [Route("DeleteOrder")]
        public IActionResult DeleteOrder(Guid id)
        {
            try
            {
                instantOrderService.Delete(id);
                return Ok("Order deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // get single order by id
        [HttpGet]
        [Route("LoadOrder")]
        public IActionResult LoadOrder(Guid id)
        {
            try
            {
                return Ok(instantOrderService.GetOrder(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // update existing order
        [HttpPut]
        [Route("UpdateOrder")]
        public IActionResult UpdateOrder([FromBody] InstantOrderDTO dTO)
        {
            try
            {
                instantOrderService.UpdateOrder(dTO);
                return Ok("Order updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

