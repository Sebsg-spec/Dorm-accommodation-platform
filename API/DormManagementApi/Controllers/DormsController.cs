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
    [Route("api/Dorms")]
    [ApiController]
    public class DormsController : ControllerBase
    {
        private readonly DormContext _context;

        public DormsController(DormContext context)
        {
            _context = context;
        }

        // GET: api/Dorms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dorm>>> GetDorm()
        {
            return await _context.Dorm.ToListAsync();
        }

        // GET: api/Dorms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dorm>> GetDorm(int id)
        {
            var dorm = await _context.Dorm.FindAsync(id);

            if (dorm == null)
            {
                return NotFound();
            }

            return dorm;
        }

        // PUT: api/Dorms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDorm(int id, Dorm dorm)
        {
            if (id != dorm.Id)
            {
                return BadRequest();
            }

            _context.Entry(dorm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DormExists(id))
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

        // POST: api/Dorms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Dorm>> PostDorm(Dorm dorm)
        {
            _context.Dorm.Add(dorm);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDorm", new { id = dorm.Id }, dorm);
        }

        // DELETE: api/Dorms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDorm(int id)
        {
            var dorm = await _context.Dorm.FindAsync(id);
            if (dorm == null)
            {
                return NotFound();
            }

            _context.Dorm.Remove(dorm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DormExists(int id)
        {
            return _context.Dorm.Any(e => e.Id == id);
        }
    }
}
