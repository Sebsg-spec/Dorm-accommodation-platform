using System.ComponentModel.DataAnnotations.Schema;

namespace DormManagementApi.Models
{
    public class Application
    {
        public int Id { get; set; }
        [Column("application_name")]
        public string ApplicationName {  get; set; }
        public int User { get; set; }
        public int Faculty { get; set; }
        public float Grade { get; set; }
        [Column("last_year_grade")]
        public int? MedieAnAnterior { get; set; }
        [Column("admission_grade")]
        public int? MedieAdmitere { get; set; }
        public string Uuid { get; set; }
        public int Year { get; set; }
        [Column("last_update")]
        public DateTime LastUpdate { get; set; }
        public int Status { get; set; }
        public string? Comment { get; set; }
        [Column("assigned_dorm")]
        public int? AssignedDorm { get; set; }
    }
}
