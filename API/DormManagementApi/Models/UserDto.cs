
using Microsoft.IdentityModel.Tokens;

namespace DormManagementApi.Models
{
    public class UserDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }

    }

    public class UserRegisterDto : UserDto
    {
        public string first_name { get; set; }
        public string last_name { get; set; }

    }

    public class UserLoginDto : UserDto
    {

    }

    public class UserApplicationDto
    {
        public int ApplicationId { get; set; }
        public string ApplicationName { get; set; }
        public string StudentName { get; set; }
        public string Faculty { get; set; }
        public int Year { get; set; }
        public DateTime LastUpdate { get; set; }
        public Status Status { get; set; }
        public string? Comment { get; set; }
        public int? AssignedDorm { get; set; }
        public string? AssignedDormName { get; set; }
        public Dictionary<int,string> Preferences { get; set; }


        public UserApplicationDto(int applicationId, string applicationName, string studentName, string faculty, int year, DateTime lastUpdate, Status status, string? comment, int? assignedDorm, string? assignedDormName, Dictionary<int, string> preferences)
        {
            ApplicationId = applicationId;
            ApplicationName = applicationName == null || applicationName.Length == 0 ? "???" : applicationName;
            StudentName = studentName;
            Faculty = faculty;
            Year = year;
            LastUpdate = lastUpdate;
            Status = status;
            Comment = comment;
            AssignedDorm = assignedDorm;
            AssignedDormName = assignedDormName;
            Preferences = preferences;
        }
    }
}
