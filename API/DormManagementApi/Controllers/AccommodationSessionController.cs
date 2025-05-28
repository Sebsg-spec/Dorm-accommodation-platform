using Microsoft.AspNetCore.Mvc;
using DormManagementApi.Models;
using DormManagementApi.Services.Interfaces;

namespace DormManagementApi.Controllers
{
    [Route("api/AccommodationSessions")]
    [ApiController]
    public class AccommodationSessionsController : ControllerBase
    {
        private readonly IAccommodationSessionService accommodationSessionService;

        public AccommodationSessionsController(IAccommodationSessionService accommodationSessionService)
        {
            this.accommodationSessionService = accommodationSessionService;
        }

        // GET: api/AccommodationSessions
        [HttpGet("GetCurrent")]
        public async Task<ActionResult<IEnumerable<AccommodationSessionDto>>> GetAccommodationSession()
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }


            var accommodationSession = accommodationSessionService.GetActiveSession();
            if (accommodationSession == null)
            {
                return NotFound();
            }

            return Ok(accommodationSession);
        }

        // GET: api/AccommodationSessions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccommodationSession>> GetAccommodationSession(int id)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }

            var accommodationSession = accommodationSessionService.Get(id);

            if (accommodationSession == null)
            {
                return NotFound();
            }

            return Ok(accommodationSession);
        }


        // PUT: api/AccommodationSessions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccommodationSession(int id, AccommodationSessionDto accommodationSessionDto)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }

            if (id != accommodationSessionDto.Id)
            {
                return BadRequest();
            }

            bool updated = accommodationSessionService.Update(accommodationSessionDto);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!accommodationSessionService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/AccommodationSessions
        [HttpPost]
        public async Task<IActionResult> PostAccommodationSession(AccommodationSessionDto accommodationSessionDto)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }

            bool created = accommodationSessionService.Create(accommodationSessionDto);
            if (!created)
            {
                return StatusCode(500, "Could not create object");
            }
            return Created();

        }

        // DELETE: api/AccommodationSessions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccommodationSession(int id)
        {
            var userData = UsersController.ExtractToken(User);
            if (userData == null)
            {
                return Unauthorized("Invalid token");
            }

            bool deleted = accommodationSessionService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }

    
    }
}
