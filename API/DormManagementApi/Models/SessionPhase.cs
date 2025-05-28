using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DormManagementApi.Models
{
    [Table("session_phase")]
    public class SessionPhase
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
