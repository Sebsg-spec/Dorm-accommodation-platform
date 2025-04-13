using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DormManagementApi.Models;
using DormManagementApi.Services.Interfaces;
using DormManagementApi.Repositories.Interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace DormManagementApi.Controllers
{
    [Route("api/DormPreferences")]
    [ApiController]
    public class DormPreferencesController : ControllerBase
    {
        private readonly IDormPreferencesService dormPreferencesService;

        public DormPreferencesController(IDormPreferencesService dormPreferencesService)
        {
            this.dormPreferencesService = dormPreferencesService;
        }

        // GET: api/DormPreferences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DormPreference>>> GetDormPreference()
        {
            var dormPreferenceList = dormPreferencesService.GetAll();
            return Ok(dormPreferencesService);
        }

        // GET: api/DormPreferences/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<DormPreference>>> GetDormPreference(int id)
        {
            IEnumerable<DormPreference> dormPreference = dormPreferencesService.Get(id);

            if (dormPreference == null || !dormPreference.Any())
            {
                return NotFound();
            }

            return Ok(dormPreference);
        }

        // PUT: api/DormPreferences/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDormPreference(int id, DormPreference dormPreference)
        {
            if (id != dormPreference.Application)
            {
                return BadRequest();
            }

            bool updated = dormPreferencesService.Update(dormPreference);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!dormPreferencesService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/DormPreferences
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DormPreference>> PostDormPreference(DormPreference dormPreference)
        {
            bool created = dormPreferencesService.Create(dormPreference);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }
        // POST: api/DormPreferences
        [HttpPost("multiple")]
        public async Task<ActionResult<IEnumerable<DormPreference>>> PostDormPreferences(List<DormPreference> dormPreferences)
        {
            if (dormPreferences == null || dormPreferences.Count == 0)
            {
                return BadRequest("No dorm preferences provided.");
            }

            foreach (var dormPreference in dormPreferences)
            {
                _context.DormPreference.Add(dormPreference);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // Handle potential errors (e.g., constraints violation)
                throw;
            }

            return CreatedAtAction("GetDormPreference", new { id = dormPreferences.First().Application }, dormPreferences);
        }

        // DELETE: api/DormPreferences/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDormPreference(int id)
        {
            bool deleted = dormPreferencesService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
