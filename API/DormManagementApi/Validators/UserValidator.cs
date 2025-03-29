using DormManagementApi.Models;

namespace DormManagementApi.Validators
{
    public class UserValidator
    {
        public UserValidator() { }

        public string ValidateUserDto(UserDto userDto)
        {
            if (userDto == null)
                return "User can't be null";

            List<string> errors = [];

            if (string.IsNullOrWhiteSpace(userDto.Email) || userDto.Email.Length < 4)
                errors.Add("Email must contain at least 4 characters");

            if (string.IsNullOrWhiteSpace(userDto.Password) || userDto.Password.Length < 4)
                errors.Add("Password must contain at least 4 characters");

            return string.Join("\n", errors);
        }
    }
}
