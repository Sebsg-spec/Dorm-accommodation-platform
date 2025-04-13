using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using DormManagementApi.Repositories.Interfaces;

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
            var application = applicationService.Get(id);

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

            var userApplications = applicationService.GetByUserId(userData.Id);

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
        public async Task<ActionResult<Application>> PostApplication(Application application)
        {
            bool created = applicationService.Create(application);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
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
