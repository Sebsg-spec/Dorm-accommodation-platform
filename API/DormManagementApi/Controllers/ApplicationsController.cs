using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using DormManagementApi.Repositories.Interfaces;
using System.Text.Json;

namespace DormManagementApi.Controllers
{
    [Route("api/Applications")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            this.applicationService = applicationService;
        }

        // GET: api/Applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplication()
        {
            var applicationsList = applicationService.GetAll();
            return Ok(applicationsList);
        }

        // GET: api/Applications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
                return Unauthorized("Invalid token");

            var application = applicationService.Get(id);

            if (application == null)
            {
                return NotFound();
            }

            if (application.User != userData.Id && userData.Role < (int)RoleLevel.Secretar)
            {
                return Unauthorized("You are not authorized to view this application");
            }

            return application;
        }

        // GET: api/Applications/Details/5
        [HttpGet("Details/{id}")]
        public async Task<ActionResult<UserApplicationDto>> GetApplicationDetails(int id)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
                return Unauthorized("Invalid token");

            var applicationData = applicationService.Get(id);

            if (applicationData.User != userData.Id && userData.Role < (int)RoleLevel.Secretar)
            {
                return Unauthorized("You are not authorized to view this application");
            }

            var application = applicationService.GetDetails(id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpGet("GetApplications")]
        public async Task<ActionResult<IEnumerable<UserApplicationDto>>> GetApplications()
        {
            // User <= with big U - It contains claims-based 
            // identity information (from the JWT token)
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
                return Unauthorized("Invalid token");

            List<UserApplicationDto> userApplications = [];

            if (userData.Role == (int)RoleLevel.Secretar)
            {
                userApplications = applicationService.GetForSecretary(userData.Id);
            }
            else
            {
                userApplications = applicationService.GetByUserId(userData.Id);
            }

            if (userApplications == null)
            {
                return NotFound();
            }
            return userApplications;
        }

        // PUT: api/Applications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplication(int id, Application application)
        {
            if (id != application.Id)
            {
                return BadRequest();
            }

            bool updated = applicationService.Update(application);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!applicationService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Applications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication([FromForm] List<IFormFile> files, [FromForm] string meta)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded");

            Application? application;
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                application = JsonSerializer.Deserialize<Application>(meta, options);
                if (application == null)
                {
                    throw new Exception("Empty application after deserialization");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Invalid metadata: {ex.Message}");
            }

            bool created = applicationService.Create(ref application);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", application.Uuid);
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            for(int index = 0; index < files.Count; index++)
            {
                var file = files[index];
                string fileName = $"{index + 1}.pdf";

                var filePath = Path.Combine(uploadPath, fileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);
            }

            return application;
        }

        // DELETE: api/Applications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            bool deleted = applicationService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
