using Microsoft.AspNetCore.Identity;
using ServerTransferAPI.Data;
using ServerTransferAPI.Model;

namespace ServerTransferAPI.Services.AccountServices
{
    public interface IAccountServices
    {
        Task<IdentityResult> AddRole(RoleDTO roleDTO);
        Task<IdentityResult> CreateAccount(SignUpDTO User);
        Task<object> GetLoggedUserInfoById(string userId);
        Task<List<RoleDTO>> GetRoles();
        Task<ApplicationUser> getUserInfo(string username);
        List<string> getUserRole(ApplicationUser user);
        Task Logout();
        Task<SignInResult> SigIn(SignInDTO signInDTO);
        Task<List<object>> GetAllUsers();

        Task<IdentityResult> DeleteUser(string userId);
    }
}