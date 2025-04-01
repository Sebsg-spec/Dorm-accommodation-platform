using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DormManagementApi.Models;

namespace DormManagementApi.Controllers
{
    [Route("api/DormPreferences")]
    [ApiController]
    public class DormPreferencesController : ControllerBase
    {
        private readonly DormContext _context;

        public DormPreferencesController(DormContext context)
        {
            _context = context;
        }

        // GET: api/DormPreferences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DormPreference>>> GetDormPreference()
        {
            return await _context.DormPreference.ToListAsync();
        }

        // GET: api/DormPreferences/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DormPreference>> GetDormPreference(int id)
        {
            var dormPreference = await _context.DormPreference.FindAsync(id);

            if (dormPreference == null)
            {
                return NotFound();
            }

            return dormPreference;
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

            _context.Entry(dormPreference).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DormPreferenceExists(id))
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

        // POST: api/DormPreferences
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DormPreference>> PostDormPreference(DormPreference dormPreference)
        {
            _context.DormPreference.Add(dormPreference);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DormPreferenceExists(dormPreference.Application))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetDormPreference", new { id = dormPreference.Application }, dormPreference);
        }

        // DELETE: api/DormPreferences/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDormPreference(int id)
        {
            var dormPreference = await _context.DormPreference.FindAsync(id);
            if (dormPreference == null)
            {
                return NotFound();
            }

            _context.DormPreference.Remove(dormPreference);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DormPreferenceExists(int id)
        {
            return _context.DormPreference.Any(e => e.Application == id);
        }
    }
}
