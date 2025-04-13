using DormManagementApi.Models;

namespace DormManagementApi.Repositories.Interfaces
{
    public interface IApplicationService
    {
        public bool Exists(int id);
        public IEnumerable<Application> GetAll();
        public Application Get(int id);
        public List<UserApplicationDto> GetByUserId(int userId);
        public bool Create(ref Application application);
        public bool Update(Application application);
        public bool Delete(int id);
    }

    public class ApplicationService : IApplicationService
    {

        private readonly DormContext context;

        public ApplicationService(DormContext context)
        {
            this.context = context;
        }

        public bool Create(ref Application application)
        {
            application.ApplicationName = GenerateApplicationName(application);
            context.Application.Add(application);
            int saved = context.SaveChanges();
            return saved > 0;
        }

        public bool Delete(int id)
        {
            Application application = context.Application.Find(id);

            if (application != null)
            {
                context.Application.Remove(application);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.Application.Any(obj => obj.Id == id);
        }

        public Application Get(int id)
        {
            return context.Application.Find(id);
        }

        public IEnumerable<Application> GetAll()
        {
            return context.Application.ToList();
        }

        public List<UserApplicationDto> GetByUserId(int userId)
        {
            var userProfile = context.Profile.Find(userId);

            var faculty = context.Faculty.Find(userProfile.Faculty);

            var userApplications = context.Application.Where(b => b.User.Equals(userId)).OrderByDescending(x => x.LastUpdate).ToList();

            List<UserApplicationDto> result = ToDto(userApplications, userProfile);
            return result;
        }

        public bool Update(Application application)
        {
            context.Entry(application).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }

        private string GenerateApplicationName(Application application)
        {
            User user = context.User.Find(application.User);
            Profile userProfile = context.Profile.Find(user.Id);
            Faculty faculty = context.Faculty.Find(application.Faculty);

            string userInitials = GetUserInitials(userProfile.FirstName, userProfile.LastName);
            string facultyAbbreviation = GetFacultyAbbreviation(faculty.Name);
            string randomSuffix = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();

            string applicationName = $"{facultyAbbreviation}-{userInitials}{application.Year}-{randomSuffix}";
            return applicationName;
        }

        private List<UserApplicationDto> ToDto(List<Application> applications, Profile userProfile)
        {
            List<UserApplicationDto> result = new List<UserApplicationDto>();
            foreach (Application application in applications)
            {
                var faculty = context.Faculty.Find(application.Faculty);
                var status = context.Status.Find(application.Status);
                List<DormPreference> applicationPreferences = context.DormPreference.Where(x => x.Application.Equals(application.Id)).ToList();
                List<Dorm> dorms = context.Dorm.ToList();
                Dictionary<int, string> preferences = new Dictionary<int, string>();
                foreach (DormPreference pref in applicationPreferences)
                {
                    preferences.Add(pref.Preference, dorms.Where(dorm => dorm.Id.Equals(pref.Dorm)).FirstOrDefault().Name);

                }

                UserApplicationDto userApplicationDto = new UserApplicationDto(application.Id, application.ApplicationName, userProfile.FirstName + " " + userProfile.LastName,
                    faculty.Name, application.Year, application.LastUpdate, status, application.Comment, application.AssignedDorm, preferences);

                result.Add(userApplicationDto);
            }

            return result;
        }

        private string GetUserInitials(string userFirstName, string userLastName)
        {
            string initials = "";
            char[] separators = new char[] { ' ', '-' };
            foreach (var part in userFirstName.Split(separators, StringSplitOptions.RemoveEmptyEntries))
            {
                initials += char.ToUpper(part[0]);
            }

            foreach (var part in userLastName.Split(separators, StringSplitOptions.RemoveEmptyEntries))
            {
                initials += char.ToUpper(part[0]);
            }

            return initials;
        }

        private string GetFacultyAbbreviation(string facultyName)
        {
            string abbreviation = "";
            var smallWords = new HashSet<string> { "de", "și", "the", "ale" };
            var separators = new char[] { ' ', ',' };

            string[] words = facultyName.Split(separators, StringSplitOptions.RemoveEmptyEntries);

            List<string> filteredWords = new List<string>();
            foreach (var word in words)
            {
                if (!smallWords.Contains(word.ToLower()))
                {
                    filteredWords.Add(word.Trim());
                }
            }

            foreach (var word in filteredWords)
            {
                abbreviation += char.ToUpper(word[0]).ToString();
            }

            return abbreviation;
        }
    }
}
