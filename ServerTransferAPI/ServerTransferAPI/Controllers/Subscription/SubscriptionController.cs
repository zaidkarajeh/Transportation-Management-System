using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.InstantOrderService;
using ServerTransferAPI.Services.SubscriptionService;

namespace ServerTransferAPI.Controllers.Subscription
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService subscriptionService;

        public SubscriptionController(ISubscriptionService _subscriptionService)
        {
            subscriptionService = _subscriptionService;
        }
        // add new order
        [HttpPost]
        [Route("AddSubscription")]
        public IActionResult AddSubscription(SubscriptionDTO dTO)
        {
            try
            {
                subscriptionService.Insert(dTO);
                return Ok("تم إضافة الطلب بنجاح");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // get all orders
        [HttpGet]
        [Route("LoadAllSubscription")]
        public IActionResult LoadAllSubscription()
        {
            try
            {
                return Ok(subscriptionService.GetAllSubscriptions());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // delete order by id
        [HttpDelete]
        [Route("DeleteSubscription")]
        public IActionResult DeleteSubscription(Guid id)
        {
            try
            {
                subscriptionService.Delete(id);
                return Ok("تم حذف الطلب بنجاح");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // get single order by id
        [HttpGet]
        [Route("LoadSubscription")]
        public IActionResult LoadSubscription(Guid id)
        {
            try
            {
                return Ok(subscriptionService.GetSubscription(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // update existing order
        [HttpPut]
        [Route("UpdateSubscription")]
        public IActionResult UpdateOrder([FromBody] SubscriptionDTO dTO)
        {
            try
            {
                subscriptionService.UpdateSubscription(dTO);
                return Ok("تم تعديل الطلب بنجاح");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
