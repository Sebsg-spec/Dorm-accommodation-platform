using System.ComponentModel.DataAnnotations.Schema;

namespace DormManagementApi.Models
{
    [Table("accommodation_session_details")]
    public class AccommodationSessionDetails
    {
        public int Id { get; set; }
        [Column("accommodation_session_id")]
        public int AccommodationSessionId { get; set; }
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        [Column("end_date")]
        public DateTime EndDate { get; set; }
        [Column("session_phase")]
        public int SessionPhase {  get; set; }

        public AccommodationSessionDetails(int accommodationSessionId, DateTime startDate, DateTime endDate, int sessionPhase)
        {
            AccommodationSessionId = accommodationSessionId;
            StartDate = startDate;
            EndDate = endDate;
            SessionPhase = sessionPhase;
        }
    }
}
