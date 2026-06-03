using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.AppSettingService;

namespace ServerTransferAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]

    public class AppSettingController : ControllerBase
    {
        private readonly IAppSettingService service;

        public AppSettingController(IAppSettingService _service)
        {
            service = _service;
        }

        // GET: api/appsetting
        [HttpGet]
        public IActionResult GetAll()
        {
            var result = service.GetAll();
            return Ok(result);
        }

        // GET: api/appsetting/key/InstantOrderCommissionRate
        [HttpGet("key/{key}")]
        public IActionResult GetByKey(string key)
        {
            try
            {
                var result = service.GetByKey(key);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PUT: api/appsetting
        [HttpPut]
        public IActionResult Update([FromBody] AppSettingDTO dto)
        {
            try
            {
                service.Update(dto);
                return Ok(new { message = "The setting has been updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
