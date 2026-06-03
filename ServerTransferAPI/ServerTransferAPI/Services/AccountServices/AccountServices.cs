using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;
namespace ServerTransferAPI.Services.AccountServices
{
    public class AccountServices : IAccountServices
    {
        UserManager<ApplicationUser> userManager;
        SignInManager<ApplicationUser> signInManager;
        RoleManager<IdentityRole> roleManager;
        public AccountServices(UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager, RoleManager<IdentityRole> _roleManager)
        {
            userManager = _userManager;
            signInManager = _signInManager;
            roleManager = _roleManager;
        }
        public async Task<IdentityResult> CreateAccount(SignUpDTO User)
        {
            ApplicationUser newUser = new ApplicationUser();
            newUser.UserName = User.Email;
            newUser.Email = User.Email;
            newUser.Name = User.Name;
            newUser.DOB = User.DOB;
            newUser.Gender = User.Gender;
            // newUser.PasswordHash = User.Password;
            var result = await userManager.CreateAsync(newUser, User.Password);
            if (result.Succeeded)
            {
                var roleResult = await userManager.AddToRoleAsync(newUser, User.RoleName);
                {
                    if (!roleResult.Succeeded)
                    {
                        await userManager.DeleteAsync(newUser);
                    }
                }
            }
            return result;
        }
        public async Task<SignInResult> SigIn(SignInDTO signInDTO)
        {
            var result = await signInManager.PasswordSignInAsync(signInDTO.Username, signInDTO.Password, false, false);
            return result;
        }
        public async Task<IdentityResult> AddRole(RoleDTO roleDTO)
        {
            IdentityRole role = new IdentityRole();
            role.Name = roleDTO.Name;
            var result = await roleManager.CreateAsync(role);
            return result;
        }
        public async Task<List<RoleDTO>> GetRoles()
        {
            List<IdentityRole> allRoles = await roleManager.Roles.ToListAsync();
            List<RoleDTO> roles = new List<RoleDTO>();
            foreach (IdentityRole item in allRoles)
            {
                RoleDTO role = new RoleDTO();
                role.Name = item.Name;
                roles.Add(role);
            }
            return roles;
        }
        public async Task Logout()
        {
            await signInManager.SignOutAsync();
        }
        public List<string> getUserRole(ApplicationUser user)
        {
            var roles = userManager.GetRolesAsync(user).Result.ToList();
            return roles;
        }
        public async Task<ApplicationUser> getUserInfo(string username)
        {
            var result = await userManager.FindByNameAsync(username);
            return result;
        }
        public async Task<object> GetLoggedUserInfoById(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return null;
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                return null;
            var roles = await userManager.GetRolesAsync(user);
            return new
            {
                Name = user.Name,
                Email = user.Email,
                Role = roles.FirstOrDefault()
            };
        }

        // ✅ جديد فقط - جيب كل المستخدمين
        public async Task<List<object>> GetAllUsers()
        {
            var users = await userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                result.Add(new
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = roles.FirstOrDefault()
                });
            }

            return result;
        }

        public async Task<IdentityResult> DeleteUser(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) throw new Exception("المستخدم غير موجود");
            return await userManager.DeleteAsync(user);
        }
    }
}