using DormManagementApi.Models;

namespace DormManagementApi.Repositories.Interfaces
{
    public interface IStatusService
    {
        public bool Exists(int id);
        public IEnumerable<Status> GetAll();
        public Status Get(int id);
        public bool Create(Status status);
        public bool Update(int id, Status status);
        public bool Delete(int id);


    }

    public class StatusService : IStatusService
    {
        private readonly DormContext context;
        public StatusService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(Status status)
        {
            context.Status.Add(status);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Status status = context.Status.Find(id);

            if (status != null)
            {
                context.Status.Remove(status);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Status.Any( obj => obj.Id == id); 
        }

        public Status Get(int id)
        {
            return context.Status.Find(id);
        }

        public IEnumerable<Status> GetAll()
        {
            return context.Status.ToList();
        }

        public bool Update(int id, Status status)
        {
            context.Entry(status).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
