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
}
