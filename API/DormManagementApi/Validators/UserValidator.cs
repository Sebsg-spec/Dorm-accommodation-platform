using DormManagementApi.Models;
using System.Text.RegularExpressions;

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

            if (userDto.Email == null || !Regex.IsMatch(userDto.Email, @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                errors.Add("Email must contain at least 4 characters");

            if (string.IsNullOrWhiteSpace(userDto.Password) || userDto.Password.Length < 8)
                errors.Add("Password must contain at least 4 characters");

            return string.Join("\n", errors);
        }

        public string validateRegisterDto(UserRegisterDto userRegisterDto)
        {
            List<string> errors = [ValidateUserDto(userRegisterDto)];

            if (string.IsNullOrWhiteSpace(userRegisterDto.first_name) || userRegisterDto.first_name.Length < 2)
                errors.Add("First name must contain at least 2 characters");

            if (string.IsNullOrWhiteSpace(userRegisterDto.last_name) || userRegisterDto.last_name.Length < 2)
                errors.Add("Last name must contain at least 2 characters");

            return string.Join("\n", errors);
        }
    }
}