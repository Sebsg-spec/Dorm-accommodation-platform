using DormManagementApi.Models;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IDormPreferencesService
    {
        public bool Exists(int id);
        public IEnumerable<DormPreference> GetAll();
        public IEnumerable<DormPreference> Get(int applicationId);
        public bool Create(DormPreference preference);
        public bool Update(DormPreference preference);
        public bool Delete(int id);

    }

    public class DormPreferencesService : IDormPreferencesService
    {
        private readonly DormContext context;

        public DormPreferencesService(DormContext context)
        {
            this.context = context;
        }
        public bool Create(DormPreference preference)
        {
            context.DormPreference.Add(preference);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int applicationId)
        {
            IEnumerable<DormPreference> preferences = context.DormPreference.Where(pref => pref.Application == applicationId).ToList();

            if (preferences != null || preferences.Any())
            {
                foreach (var item in preferences)
                {
                    context.DormPreference.Remove(item);
                }
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int applicationId)
        {
            return context.DormPreference.Any(obj => obj.Application == applicationId);
        }

        public IEnumerable<DormPreference> Get(int applicationId)
        {
            return context.DormPreference.Where(pref => pref.Application == applicationId).ToList();
        }

        public IEnumerable<DormPreference> GetAll()
        {
            return context.DormPreference.ToList();
        }

        public bool Update(DormPreference preference)
        {
            context.Entry(preference).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
