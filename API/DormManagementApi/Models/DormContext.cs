using Microsoft.EntityFrameworkCore;

namespace DormManagementApi.Models
{
    public class DormContext : DbContext
    {
        public DormContext() { }

        public DormContext(DbContextOptions<DormContext> options) : base(options)
        {
            //Database.EnsureDeleted();
            //Database.EnsureCreated();
        }

        public virtual DbSet<Role> Role { get; set; }
    }
}
