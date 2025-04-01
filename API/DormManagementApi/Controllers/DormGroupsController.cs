using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DormManagementApi.Models;

namespace DormManagementApi.Controllers
{
    [Route("api/DormGroups")]
    [ApiController]
    public class DormGroupsController : ControllerBase
    {
        private readonly DormContext _context;

        public DormGroupsController(DormContext context)
        {
            _context = context;
        }

        // GET: api/DormGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DormGroup>>> GetDormGroup()
        {
            return await _context.DormGroup.ToListAsync();
        }

        // GET: api/DormGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DormGroup>> GetDormGroup(int id)
        {
            var dormGroup = await _context.DormGroup.FindAsync(id);

            if (dormGroup == null)
            {
                return NotFound();
            }

            return dormGroup;
        }

        // PUT: api/DormGroups/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDormGroup(int id, DormGroup dormGroup)
        {
            if (id != dormGroup.Id)
            {
                return BadRequest();
            }

            _context.Entry(dormGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DormGroupExists(id))
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

        // POST: api/DormGroups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DormGroup>> PostDormGroup(DormGroup dormGroup)
        {
            _context.DormGroup.Add(dormGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDormGroup", new { id = dormGroup.Id }, dormGroup);
        }

        // DELETE: api/DormGroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDormGroup(int id)
        {
            var dormGroup = await _context.DormGroup.FindAsync(id);
            if (dormGroup == null)
            {
                return NotFound();
            }

            _context.DormGroup.Remove(dormGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DormGroupExists(int id)
        {
            return _context.DormGroup.Any(e => e.Id == id);
        }
    }
}
