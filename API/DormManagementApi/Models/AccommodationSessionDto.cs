namespace DormManagementApi.Models
{
    public class AccommodationSessionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Active { get; set; }
        public DateOnly ApplicationPhaseStartDate { get; set; }
        public DateOnly ApplicationPhaseEndDate { get; set; }
        public DateOnly AssignmentPhaseStartDate { get; set; }
        public DateOnly AssignmentPhaseEndDate { get; set; }
        public DateOnly ReassignmentPhaseStartDate { get; set; }
        public DateOnly ReassignmentPhaseEndDate { get; set; }


    }
}
