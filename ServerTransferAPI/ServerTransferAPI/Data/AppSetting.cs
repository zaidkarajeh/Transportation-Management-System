using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTransferAPI.Data
{
  
    [Table("AppSettings")]
    public class AppSetting
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Key { get; set; }

        [Required]
        [StringLength(200)]
        public string Value { get; set; }

        [StringLength(300)]
        public string Description { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}