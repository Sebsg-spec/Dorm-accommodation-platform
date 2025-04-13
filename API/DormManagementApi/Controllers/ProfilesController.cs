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
    [Route("api/Profiles")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly IProfilesService profilesService;
        public ProfilesController(IProfilesService profilesService)
        {
            this.profilesService = profilesService;
        }

        // GET: api/Profiles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Profile>>> GetProfile()
        {
            var profilesList = profilesService.GetAll();
            return Ok(profilesList);
        }

        // GET: api/Profiles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Profile>> GetProfile(int id)
        {
            var profile = profilesService.Get(id);

            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        // PUT: api/Profiles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfile(int id, Profile profile)
        {
            if (id != profile.Id)
            {
                return BadRequest();
            }

            bool updated = profilesService.Update(profile);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!profilesService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Profiles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Profile>> PostProfile(Profile profile)
        {
            bool created = profilesService.Create(profile);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }

        // DELETE: api/Profiles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            bool deleted = profilesService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
