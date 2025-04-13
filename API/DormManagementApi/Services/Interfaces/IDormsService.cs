using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IDormsService
    {
        public bool Exists(int id);
        public IEnumerable<Dorm> GetAll();
        public Dorm Get(int id);
        public bool Create(Dorm dorm);
        public bool Update(Dorm dorm);
        public bool Delete(int id);
    }

    public class DormsService : IDormsService
    {

        private DormContext context;

        public DormsService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(Dorm dorm)
        {
            context.Dorm.Add(dorm);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Dorm dorm = context.Dorm.Find(id);

            if (dorm != null)
            {
                context.Dorm.Remove(dorm);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Dorm.Any(obj => obj.Id == id);
        }

        public Dorm Get(int id)
        {
            return context.Dorm.Find(id);
        }

        public IEnumerable<Dorm> GetAll()
        {
            return context.Dorm.ToList();
        }

        public bool Update(Dorm dorm)
        {
            context.Entry(dorm).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
