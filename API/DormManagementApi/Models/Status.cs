namespace DormManagementApi.Models
{
    public enum ApplicationStatus
    {
        InCursDeVerificare = 1,
        InAsteptare = 2,
        Validat = 3,
        Repartizat = 4,
        CaminAcceptat = 5,
        Respins = 6,
        CaminRefuzat = 7,
    }

    public class Status
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
