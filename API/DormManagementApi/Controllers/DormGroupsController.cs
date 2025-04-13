using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using DormManagementApi.Services.Interfaces;

namespace DormManagementApi.Controllers
{
    [Route("api/DormGroups")]
    [ApiController]
    public class DormGroupsController : ControllerBase
    {
        private readonly IDormGroupService dormGroupService;

        public DormGroupsController(IDormGroupService dormGroupService)
        {
            this.dormGroupService = dormGroupService;
        }

        // GET: api/DormGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DormGroup>>> GetDormGroup()
        {
            var dormGroupList = dormGroupService.GetAll();
            return Ok(dormGroupList);
        }

        // GET: api/DormGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DormGroup>> GetDormGroup(int id)
        {
            var dormGroup = dormGroupService.Get(id);

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

            bool updated = dormGroupService.Update(dormGroup);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!dormGroupService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/DormGroups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DormGroup>> PostDormGroup(DormGroup dormGroup)
        {
            bool created = dormGroupService.Create(dormGroup);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }

        // DELETE: api/DormGroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDormGroup(int id)
        {
            bool deleted = dormGroupService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
