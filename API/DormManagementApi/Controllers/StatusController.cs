using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using DormManagementApi.Repositories.Interfaces;

namespace DormManagementApi.Controllers
{
    [Route("api/Status")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IStatusService statusService;

        public StatusController(IStatusService statusService)
        {
            this.statusService = statusService;
        }

        // GET: api/Status
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Status>>> GetStatus()
        {
            var statusList = statusService.GetAll();
            return Ok(statusList);
        }

        // GET: api/Status/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Status>> GetStatus(int id)
        {
            var status = statusService.Get(id);

            if (status == null)
            {
                return NotFound();
            }

            return status;
        }

        // PUT: api/Status/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatus(int id, Status status)
        {
            if (id != status.Id)
            {
                return BadRequest();
            }

            bool updated = statusService.Update(id, status);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!statusService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Status
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Status>> PostStatus(Status status)
        {
            bool created = statusService.Create(status);

            if (created)
            {
                return Created();
            }
            return StatusCode(500, "Could not create status object");
        }

        // DELETE: api/Status/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            bool deleted = statusService.Delete(id);

            if (deleted)
            {
                return Ok();
            }
            return StatusCode(500, "Could not delete status object");
        }
    }
}
