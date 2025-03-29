using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DormManagementApi.Models
{
    [Table("dorm_preference")]
    [PrimaryKey(nameof(Application), nameof(Dorm))]
    public class DormPreference
    {
        public int Application { get; set; }
        public int Dorm { get; set; }
        public int Preference { get; set; }
    }
}
