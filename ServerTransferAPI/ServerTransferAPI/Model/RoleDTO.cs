using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Model
{
    public class RoleDTO
    {
        [Required]
        public string Name { get; set; }
    }
}
