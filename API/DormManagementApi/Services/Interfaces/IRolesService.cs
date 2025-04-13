using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IRolesService
    {

        public bool Exists(long id);
        public IEnumerable<Role> GetAll();
        public Role Get(long id);
        public bool Create(Role role);
        public bool Update(Role role);
        public bool Delete(long id);
    }

    public class RolesService : IRolesService
    {

        private readonly DormContext context;

        public RolesService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(Role role)
        {
            context.Role.Add(role);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(long id)
        {
            Role role = context.Role.Find(id);

            if (role != null)
            {
                context.Role.Remove(role);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(long id)
        {
            return context.Role.Any(obj => obj.Id == id);
        }

        public Role Get(long id)
        {
            return context.Role.Find(id);
        }

        public IEnumerable<Role> GetAll()
        {
            return context.Role.ToList();
        }

        public bool Update(Role role)
        {
            context.Entry(role).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
