using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Services.DriverPaymentService;

namespace ServerTransferAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]

    public class DriverPaymentController : ControllerBase
    {
        private readonly IDriverPaymentService driverPaymentService;

        public DriverPaymentController(IDriverPaymentService _driverPaymentService)
        {
            driverPaymentService = _driverPaymentService;
        }

    
        [HttpGet]
        [Route("GetAll")]

        public IActionResult GetAll()
        {
            var result = driverPaymentService.GetAll();
            return Ok(result);
        }

        // GET: api/driverpayment/driver/{{driverId}}
        // Get records for a specific driver
        [HttpGet("GetDriver/{driverId}")]
        public IActionResult GetByDriver(Guid driverId)
        {
            var result = driverPaymentService.GetByDriver(driverId);
            return Ok(result);
        }

        // GET: api/driverpayment/unpaid
        // Get only unpaid records
        [HttpGet("unpaid")]
        public IActionResult GetUnpaid()
        {
            var result = driverPaymentService.GetUnpaid();
            return Ok(result);
        }

        // PUT: api/driverpayment/markpaid/{{id}}
        // Record that the driver has paid the company
        [HttpPut("markpaid/{id}")]
        public IActionResult MarkAsPaid(Guid id)
        {
            try
            {
                driverPaymentService.MarkAsPaid(id);
                return Ok(new { message = "Payment recorded successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}