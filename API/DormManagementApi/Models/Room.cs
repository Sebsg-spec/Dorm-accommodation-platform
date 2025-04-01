namespace DormManagementApi.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int Dorm { get; set; }
        public string Number { get; set; }
        public int Capacity { get; set; }
        public double Size { get; set; }
    }
}
