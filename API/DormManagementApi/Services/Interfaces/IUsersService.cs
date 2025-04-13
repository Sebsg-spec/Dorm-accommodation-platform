using DormManagementApi.Models;
using DormManagementApi.Utils;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Services.Interfaces
{
    public interface IUsersService
    {

        public User Authenticate(UserLoginDto userLoginDto);
        public bool Exists(int id);
        public bool Exists(string email);
        public IEnumerable<User> GetAll();
        public User Get(int id);
        public User Get(string email);
        public bool Create(User user);
        public bool Create(UserRegisterDto userRegisterDto);
        public bool Update(User user);
        public bool Delete(int id);
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

        public bool Update(User user)
        {
            context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            int changed = context.SaveChanges();
            return changed > 0;
        }
    }
}
