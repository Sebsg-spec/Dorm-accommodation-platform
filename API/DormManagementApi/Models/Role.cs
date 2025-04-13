namespace DormManagementApi.Models
{
    public enum RoleLevel
    {
        Neverificat = 1,
        Student = 2,
        Secretar = 3,
        Admin = 4
    }

    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
