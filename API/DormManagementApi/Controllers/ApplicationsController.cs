using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DormManagementApi.Models;
using DormManagementApi.Attributes;

namespace DormManagementApi.Controllers
{
    [Route("api/Applications")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly DormContext _context;

        public ApplicationsController(DormContext context)
        {
            _context = context;
        }

        // GET: api/Applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplication()
        {
            return await _context.Application.ToListAsync();
        }

        // GET: api/Applications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Application>> GetApplication(int id)
        {
            var application = await _context.Application.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            return application;
        }

        [HttpGet("GetApplications")]
        public async Task<ActionResult<UserApplicationDto>> GetApplications()
        {
            // User <= with big U - It contains claims-based 
            // identity information (from the JWT token)
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
                return Unauthorized("Invalid token");

            var userProfile = await _context.Profile.FindAsync(userData.Id);

            var faculty = await _context.Faculty.FindAsync(userProfile.Faculty);

            var userApplication = await _context.Application.Where(b => b.User.Equals(userData.Id)).ToListAsync();

            var status = await _context.Status.FindAsync(userApplication[0].Status);

            List<DormPreference> applicationPreferences = await _context.DormPreference.Where(x => x.Application.Equals(userApplication[0].Id)).ToListAsync();

            List<Dorm> dorms = await _context.Dorm.ToListAsync();

            Dictionary<int, string> preferences = new Dictionary<int, string>();

            foreach (DormPreference pref in applicationPreferences ){
                preferences.Add(pref.Preference, dorms.Where(dorm => dorm.Id.Equals(pref.Dorm)).FirstOrDefault().Name);

            }


            return new UserApplicationDto(userApplication[0].Id, userProfile.FirstName + " " + userProfile.LastName, faculty.Name, userApplication[0].Year, userApplication[0].LastUpdate, status, userApplication[0].Comment, userApplication[0].AssignedDorm, preferences);
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

            _context.Entry(application).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationExists(id))
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

        // POST: api/Applications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Application>> PostApplication(Application application)
        {
            _context.Application.Add(application);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplication", new { id = application.Id }, application);
        }

        // DELETE: api/Applications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Application.FindAsync(id);
            if (application == null)
            {
                return NotFound();
            }

            _context.Application.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApplicationExists(int id)
        {
            return _context.Application.Any(e => e.Id == id);
        }
    }
}
