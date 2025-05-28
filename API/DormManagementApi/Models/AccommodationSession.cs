using System.ComponentModel.DataAnnotations.Schema;

namespace DormManagementApi.Models
{
    [Table("accommodation_session")]
    public class AccommodationSession
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Active { get; set; }
    }
}
