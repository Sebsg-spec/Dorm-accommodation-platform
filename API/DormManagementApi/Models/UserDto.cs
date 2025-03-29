namespace DormManagementApi.Models
{
    public class UserDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class UserRegisterDto : UserDto
    {

    }

    public class UserLoginDto : UserDto
    {

    }
}
