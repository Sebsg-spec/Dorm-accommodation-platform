using DormManagementApi.Models;
using DormManagementApi.Utils;
using NuGet.Protocol.Plugins;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IUsersService
    {

        public User Authenticate(UserLoginDto userLoginDto);
        public bool Exists(int id);
        public bool Exists(string email);
        public IEnumerable<User> GetAll();
        public IEnumerable<UserDetailsDto> GetAllDetails();
        public User Get(int id);
        public User Get(string email);
        public bool Create(User user);
        public bool Create(UserRegisterDto userRegisterDto);
        public bool Update(User user);
        public bool Delete(int id);

        public int? GetFaculty(int id);
        public IEnumerable<Models.Application> GetDormApplications(int? faculty, int status);

        public bool ProcessApplications(int userId);
    }

    public class UsersService : IUsersService
    {
        private readonly DormContext context;

        public UsersService(DormContext context)
        {
            this.context = context;
        }

        public User Authenticate(UserLoginDto userLoginDto)
        {
            var passwordHash = AuthUtils.HashPassword(userLoginDto.Password);
            var user = context.User.SingleOrDefault(us =>  us.Email == userLoginDto.Email && us.Password == passwordHash);

            return user;
        }

        public bool Create(User user)
        {
            context.User.Add(user);
            int saved = context.SaveChanges();

            return saved > 0;
        }

        public bool Create(UserRegisterDto userRegisterDto)
        {
            var user = new User
            {
                Email = userRegisterDto.Email,
                Password = AuthUtils.HashPassword(userRegisterDto.Password),
                Role = (int)RoleLevel.Student  // Default role for now, change to 'Neverificat' later
            };

            context.User.Add(user);
            int userSaved = context.SaveChanges();

            if (userSaved == 0)
            {
                return false;
            }

            user = context.User.FirstOrDefault(us => us.Email == userRegisterDto.Email);
            var profile = new Profile
            {
                Id = user.Id,
                FirstName = userRegisterDto.first_name,
                LastName = userRegisterDto.last_name,
            };

            context.Profile.Add(profile);
            int profileSaved = context.SaveChanges();

            if (profileSaved == 0)
            {
                context.User.Remove(user);
                context.SaveChanges();
                return false;
            }

            return true;
        }

        public bool Delete(int id)
        {
            User user = context.User.Find(id);

            if (user != null)
            {
                context.User.Remove(user);
                int deleted = context.SaveChanges();
                return deleted > 0;
            }
            return false;
        }

        public bool Exists(int id)
        {
            return context.User.Any(obj => obj.Id == id);
        }

        public bool Exists(string email)
        {
            return context.User.Any(us => us.Email == email);
        }

        public User Get(int id)
        {
            return context.User.Find(id);
        }

        public User Get(string email)
        {
            return context.User.FirstOrDefault(us => us.Email == email);
        }

        public IEnumerable<User> GetAll()
        {
            return context.User.ToList();
        }

        public IEnumerable<UserDetailsDto> GetAllDetails()
        {
            var users = context.User.ToList();
            var profiles = context.Profile.ToList();
            var userDetails = from user in users
                              join profile in profiles on user.Id equals profile.Id
                              select new UserDetailsDto
                              {
                                  Id = user.Id,
                                  Email = user.Email,
                                  FirstName = profile.FirstName,
                                  LastName = profile.LastName,
                                  Role = user.Role
                              };

            return userDetails.ToList();
        }

        public bool Update(User user)
        {
            context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }

        public int? GetFaculty(int id)
        {
            var profile = context.Profile.Find(id);
            if (profile == null)
            {
                return null;
            }

            return profile.Faculty;
        }

        public IEnumerable<Models.Application> GetDormApplications(int? faculty, int status)
        {
            if (faculty == null)
            {
                return [];
            }

            var applications = context.Application
                .Where(a => a.Faculty == faculty && a.Status == status)
                .OrderByDescending(a => a.MedieAdmitere)
                .ThenByDescending(a => a.MedieAnAnterior)
                .ThenByDescending(a => a.Grade)
                .ToList();

            return applications;
        }

        public bool ProcessApplications(int userId)
        {
            // Get user faculty (secretary can only process applications from the same faculty)
            var faculty = GetFaculty(userId);
            if (faculty == null)
            {
                return false;
            }

            // Get dorm applications for the user's faculty that have a validated application
            var dormApplications = GetDormApplications(faculty, (int)ApplicationStatus.Validat);
            if (!dormApplications.Any())
            {
                return false;
            }

            // Loop through the students and check each preference
            foreach (var application in dormApplications)
            {
                // Get the preferences for the application from the relationship
                // The preferences are the result of the intermediary table of the many-to-many
                // relationship between the dorm table and the application table
                var preferences = context.DormPreference
                    .Where(preference => preference.Application == application.Id)
                    .OrderBy(dp => dp.Preference)
                    .ToList();

                // Check each preference one by one and assign the student to the first dorm that has capacity
                // If there is no capacity, the application will change it's status to 6 (rejected)
                bool assigned = false;
                foreach (var preference in preferences)
                {
                    var dorm = context.Dorm.Find(preference.Dorm);
                    if (dorm != null && dorm.Capacity > 0)
                    {
                        // Assign the student to the dorm
                        application.AssignedDorm = dorm.Id;
                        dorm.Capacity--;
                        assigned = true;
                        break;
                    }
                }

                application.Status = assigned ?
                    (int)ApplicationStatus.Repartizat :
                    (int)ApplicationStatus.Respins;

                application.Comment = assigned ?
                    $"Repartizat la căminul {application.AssignedDorm}" :
                    "Nu exista locuri disponibile in lista de preferinte";

                application.LastUpdate = DateTime.Now;
            }

            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
