using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IFacultiesService
    {
        public bool Exists(int id);
        public IEnumerable<Faculty> GetAll();
        public Faculty Get(int id);
        public bool Create(Faculty faculty);
        public bool Update(Faculty faculty);
        public bool Delete(int id);
    }

    public class FacultiesService : IFacultiesService
    {

        private DormContext context;

        public FacultiesService(DormContext context)
        {
            this.context = context;
        }

        public bool Create(Faculty faculty)
        {
            context.Faculty.Add(faculty);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Faculty faculty = context.Faculty.Find(id);

            if (faculty != null)
            {
                context.Faculty.Remove(faculty);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Faculty.Any(obj => obj.Id == id);
        }

        public Faculty Get(int id)
        {
            return context.Faculty.Find(id);
        }

        public IEnumerable<Faculty> GetAll()
        {
            return context.Faculty.ToList();
        }

        public bool Update(Faculty faculty)
        {
            context.Entry(faculty).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
