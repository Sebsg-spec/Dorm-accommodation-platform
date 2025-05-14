using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using DormManagementApi.Validators;
using DormManagementApi.Services.Interfaces;
using DormManagementApi.Attributes;

namespace DormManagementApi.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly UserValidator _validator;
        private readonly byte[] _jwtSecret;

        public UsersController(IUsersService usersService, IOptions<JwtSettings> jwtSettings)
        {
            _usersService = usersService;
            _validator = new UserValidator();

            if (string.IsNullOrWhiteSpace(jwtSettings.Value.Secret))
                throw new ArgumentException("Invalid JWT settings");

            _jwtSecret = Encoding.ASCII.GetBytes(jwtSettings.Value.Secret);
        }

        // POST: api/Users/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserRegisterDto userDto)
        {
            var validationResult = _validator.validateRegisterDto(userDto);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            if (_usersService.Exists(userDto.Email))
                return BadRequest("Email already registered");

            bool created = _usersService.Create(userDto);


            if (!created)
            {
                return InternalServerError("Could not create user.");
            }

            var user = _usersService.Get(userDto.Email);

            try
            {
                var token = GenerateToken(user);
                return Ok(new { token });
            }
            catch
            {
                return InternalServerError("An error occurred while generating the token");
            }
        }

        // POST: api/Users/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userDto)
        {
            var validationResult = _validator.ValidateUserDto(userDto);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            var user = _usersService.Authenticate(userDto);

            if (user == null)
                return Unauthorized("Invalid email or password");

            try
            {
                var token = GenerateToken(user);
                return Ok(new { token });
            }
            catch
            {
                return InternalServerError("An error occurred while generating the token");
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDetailsDto>>> GetUser()
        {
            var usersList = _usersService.GetAllDetails();
            return Ok(usersList);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users/UpdateRole
        [HttpPatch("UpdateRole")]
        [Role(RoleLevel.Admin)]
        public async Task<IActionResult> UpdateRole(UpdateRoleDto updateRoleDto)
        {
            var user = _usersService.Get(updateRoleDto.Id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Role = updateRoleDto.Role;

            bool updated = _usersService.Update(user);
            if (!updated)
            {
                return StatusCode(500, "Could not update user role");
            }

            return Ok();
        }

        // POST: api/Users/ProcessApplications
        [HttpPost("ProcessApplications")]
        [Role(RoleLevel.Secretar)]
        public async Task<IActionResult> ProcessApplications()
        {
            var userData = ExtractToken(HttpContext.User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }

            if (_usersService.ProcessApplications(userData.Id))
            {
                return Ok();
            }
            else
            {
                // No applications to process
                return NoContent();
            }
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            bool updated = _usersService.Update(user);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!_usersService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            bool created = _usersService.Create(user);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            bool deleted = _usersService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }

        private ObjectResult InternalServerError(string? error = null)
        {
            return StatusCode(500, error);
        }

        private string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                ]),
                Expires = DateTime.UtcNow.AddHours(JwtSettings.ExpirationTimeHours),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(_jwtSecret),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static UserData? ExtractToken(ClaimsPrincipal claimsPrincipal)
        {
            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            var emailClaim = claimsPrincipal.FindFirst(ClaimTypes.Email);
            if (emailClaim == null || string.IsNullOrWhiteSpace(emailClaim.Value))
                return null;

            var roleLevelClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
            if (roleLevelClaim == null || !int.TryParse(roleLevelClaim.Value, out int userRole))
                return null;

            return new UserData
            {
                Id = userId,
                Email = emailClaim.Value,
                Role = userRole
            };
        }
    }
}
