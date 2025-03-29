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

        public virtual DbSet<Application> Application { get; set; }
        public virtual DbSet<Dorm> Dorm { get; set; }
        public virtual DbSet<DormPreference> DormPreference { get; set; }
        public virtual DbSet<Faculty> Faculty { get; set; }
        public virtual DbSet<Profile> Profile { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<Room> Room { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<User> User { get; set; }
    }
}
