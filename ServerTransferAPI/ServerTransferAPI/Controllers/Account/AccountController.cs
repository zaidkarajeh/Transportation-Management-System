using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ServerTransferAPI.Model;
using ServerTransferAPI.Services.AccountServices;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ServerTransferAPI.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]

    public class AccountController : ControllerBase
    {
        private readonly IAccountServices accountServices;
        private readonly IConfiguration configuration;

        public AccountController(IAccountServices _accountServices, IConfiguration _configuration)
        {
            accountServices = _accountServices;
            configuration = _configuration;
        }

        // POST: api/account/AddRoles
        [HttpPost("AddRoles")]
        public async Task<IActionResult> AddRoles(RoleDTO role)
        {
            try
            {
                var result = await accountServices.AddRole(role);
                if (result.Succeeded)
                    return Ok(new { message = "The permission has been added successfully." });

                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = "Permission addition failed.", errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/account/GetAllRoles
        [HttpGet("GetAllRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await accountServices.GetRoles();
            return Ok(roles);
        }

        // POST: api/account/AddAccount
        [HttpPost("AddAccount")]
        public async Task<IActionResult> AddAccount(SignUpDTO sign)
        {
            try
            {
                var result = await accountServices.CreateAccount(sign);
                if (result.Succeeded)
                    return Ok(new { message = "The account has been created successfully." });

                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { message = "Account creation failed.", errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/account/login
        [AllowAnonymous] 
        [HttpPost("login")]
        public async Task<IActionResult> Login(SignInDTO signIn)
        {
            try
            {
                var result = await accountServices.SigIn(signIn);

                if (!result.Succeeded)
                    return Unauthorized(new { message = "Incorrect username or password." });

                var user = await accountServices.getUserInfo(signIn.Username);
                if (user == null)
                    return Unauthorized(new { message = "Invalid username or password." });

                List<string> roles = accountServices.getUserRole(user);

                List<Claim> authClaim = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, signIn.Username),
                    new Claim("uniqueValue", Guid.NewGuid().ToString())
                };

                foreach (var item in roles)
                {
                    authClaim.Add(new Claim(ClaimTypes.Role, item));
                }

                var authSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: configuration["JWT:ValidIssuer"],
                    audience: configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddDays(15),
                    claims: authClaim,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    message = "Logged in successfully",
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    name = user.Name,
                    email = user.Email,
                    role = roles.FirstOrDefault(),
                    expiresAt = token.ValidTo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/account/GetInfoUser
        [HttpGet("GetInfoUser")]
        public async Task<IActionResult> GetInfoUser()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new { message = "Authentication required." });
            var user = await accountServices.getUserInfo(username);
            if (user == null)
                return Unauthorized(new { message = "The user was not found." });
            var roles = accountServices.getUserRole(user);

            return Ok(new
            {
                name = user.Name,
                email = user.Email,
                role = roles.FirstOrDefault()
            });
        }
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await accountServices.GetAllUsers();
            return Ok(users);
        }

        [HttpDelete("DeleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var result = await accountServices.DeleteUser(userId);
                if (result.Succeeded)
                    return Ok(new { message = "The user has been deleted successfully." });

                return BadRequest(new { message = "User deletion failed." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}