using DormManagementApi.Models;
using DormManagementApi.Services.Interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IDormGroupService
    {

        public bool Exists(int id);
        public IEnumerable<DormGroup> GetAll();
        public DormGroup Get(int id);
        public bool Create(DormGroup group);
        public bool Update(DormGroup group);
        public bool Delete(int id);
    }

    public class DormGroupService : IDormGroupService
    {

        private readonly DormContext context;

        public DormGroupService(DormContext context)
        {
            this.context = context;
        }

        public bool Create(DormGroup group)
        {
            context.DormGroup.Add(group);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            DormGroup dormGroup = context.DormGroup.Find(id);

            if (dormGroup != null)
            {
                context.DormGroup.Remove(dormGroup);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.DormGroup.Any(obj => obj.Id == id);
        }

        public DormGroup Get(int id)
        {
            return context.DormGroup.Find(id);
        }

        public IEnumerable<DormGroup> GetAll()
        {
            return context.DormGroup.ToList();
        }

        public bool Update(DormGroup group)
        {
            context.Entry(group).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}



