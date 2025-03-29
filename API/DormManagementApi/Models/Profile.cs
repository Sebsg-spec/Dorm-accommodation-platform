using System.ComponentModel.DataAnnotations.Schema;

namespace DormManagementApi.Models
{
    public class Profile
    {
        public int Id { get; set; }
        public string Pin { get; set; }
        public string Sex { get; set; }
        [Column("first_name")]
        public string FirstName { get; set; }
        [Column("last_name")]
        public string LastName { get; set; }
        public int Faculty { get; set; }
    }
}
