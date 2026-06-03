using System.ComponentModel.DataAnnotations;

namespace ServerTransferAPI.Data
{
    public abstract class Person // استخدمنا abstract لأنه لا يمكن إنشاء كائن من Person مباشرة
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Name { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Gender { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Phone { get; set; }
        [StringLength(50)] // الاسم مثلاً حده 100 حرف

        public string Email { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string PersonType { get; set; } // ✅ أضف هاد



    }
}