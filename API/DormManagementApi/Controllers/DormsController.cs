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
    [Route("api/Dorms")]
    [ApiController]
    public class DormsController : ControllerBase
    {
        private readonly IDormsService dormsService;

        public DormsController(IDormsService dormsService)
        {
            this.dormsService = dormsService;
        }

        // GET: api/Dorms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dorm>>> GetDorm()
        {
            var dormsList = dormsService.GetAll();
            return Ok(dormsList);
        }

        // GET: api/Dorms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Dorm>> GetDorm(int id)
        {
            var dorm = dormsService.Get(id);

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

            bool updated = dormsService.Update(dorm);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!dormsService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Dorms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Dorm>> PostDorm(Dorm dorm)
        {
            bool created = dormsService.Create(dorm);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }

        // DELETE: api/Dorms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDorm(int id)
        {
            bool deleted = dormsService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
