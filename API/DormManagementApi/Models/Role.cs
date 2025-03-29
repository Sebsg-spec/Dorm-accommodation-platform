namespace DormManagementApi.Models
{
    public enum RoleLevel
    {
        Student = 1,
        Secretar = 2,
        Admin = 3
    }

    public class Role
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}
