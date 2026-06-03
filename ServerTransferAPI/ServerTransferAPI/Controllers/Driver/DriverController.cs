using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.ClientService;
using ServerTransferAPI.Services.DriverService;

namespace ServerTransferAPI.Controllers.Driver
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class DriverController : ControllerBase
    {
        private readonly IDriverService driverService;
        private readonly IWebHostEnvironment env;

        public DriverController(IDriverService driverService, IWebHostEnvironment env)
        {
            this.driverService = driverService; // ✅
            this.env = env;
        }

        

        [HttpPost]
        [Route("AddDriver")]
        public async Task<IActionResult> AddDriver([FromForm] DriverDTO dTO)
        {
            try
            {
                await driverService.InsertAsync(dTO);
                return Ok("Driver added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred");
            }
        }

        [HttpGet("LoadAllDrivers")]
        public async Task<IActionResult> LoadAllDrivers()
        {
            var drivers = await driverService.GetAllDriverAsync();
            return Ok(drivers);
        }

        [HttpDelete]
        [Route("DeleteDriver")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await driverService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet]
        [Route("loadDriver")]
        public async Task<DriverDTO> loadDriver(Guid Id)
        {
            return await driverService.GetDrive(Id);
        }


        [HttpPut]
        [Route("UpdateDriver")]
        public async Task<IActionResult> UpdateDriver([FromForm] DriverDTO dTO)
        {
            await driverService.Update(dTO);
            return Ok("Driver updated successfully");
        }
       
    }
}