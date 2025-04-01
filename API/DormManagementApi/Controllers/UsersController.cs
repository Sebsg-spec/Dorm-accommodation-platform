using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DormManagementApi.Models;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using DormManagementApi.Validators;

namespace DormManagementApi.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DormContext _context;
        private readonly UserValidator _validator;
        private readonly byte[] _jwtSecret;

        public UsersController(DormContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
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
            var validationResult = _validator.ValidateUserDto(userDto);
            if (validationResult != string.Empty)
                return BadRequest(validationResult);

            if (await _context.User.AnyAsync(u => u.Email == userDto.Email))
                return BadRequest("Email already registered");

            var user = new User
            {
                Email = userDto.Email,
                Password = HashPassword(userDto.Password),
                Role = (int)RoleLevel.Student
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync(); // Need to save changes to get the user id

            var profile = new Profile
            {
                Id = user.Id,
                FirstName = userDto.first_name,
                LastName = userDto.last_name

            };

            _context.Profile.Add(profile);
            await _context.SaveChangesAsync();

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

            var hashedPassword = HashPassword(userDto.Password);
            var user = await _context.User
                .SingleOrDefaultAsync(u => u.Email == userDto.Email && u.Password == hashedPassword);

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
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.User.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
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

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        private ObjectResult InternalServerError(string? error = null)
        {
            return StatusCode(500, error);
        }

        private static string HashPassword(string password)
        {
            var hash = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
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
    }
}
