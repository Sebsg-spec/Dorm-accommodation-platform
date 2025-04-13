using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IRoomsService
    {
        public bool Exists(int id);
        public IEnumerable<Room> GetAll();
        public Room Get(int id);
        public bool Create(Room room);
        public bool Update(Room room);
        public bool Delete(int id);
    }

    public class RoomsService : IRoomsService
    {

        private readonly DormContext context;

        public RoomsService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(Room room)
        {
            context.Room.Add(room);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Room room = context.Room.Find(id);

            if (room != null)
            {
                context.Room.Remove(room);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Room.Any(obj => obj.Id == id);
        }

        public Room Get(int id)
        {
            return context.Room.Find(id);
        }

        public IEnumerable<Room> GetAll()
        {
            return context.Room.ToList();
        }

        public bool Update(Room room)
        {
            context.Entry(room).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
