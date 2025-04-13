using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IProfilesService
    {
        public bool Exists(int id);
        public IEnumerable<Profile> GetAll();
        public Profile Get(int id);
        public bool Create(Profile profile);
        public bool Update(Profile profile);
        public bool Delete(int id);
    }

    public class ProfilesService : IProfilesService
    {

        private DormContext context;

        public ProfilesService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(Profile profile)
        {
            context.Profile.Add(profile);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Profile profile = context.Profile.Find(id);

            if (profile != null)
            {
                context.Profile.Remove(profile);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Profile.Any(obj => obj.Id == id);
        }

        public Profile Get(int id)
        {
            return context.Profile.Find(id);
        }

        public IEnumerable<Profile> GetAll()
        {
            return context.Profile.ToList();
        }

        public bool Update(Profile profile)
        {
            context.Entry(profile).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
