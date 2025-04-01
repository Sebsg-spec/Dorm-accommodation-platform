using System.ComponentModel.DataAnnotations.Schema;

namespace DormManagementApi.Models
{
    public class Dorm
    {
        public int Id { get; set; }
        [Column("dorm_group")]
        public int DormGroup { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }

    }
}
