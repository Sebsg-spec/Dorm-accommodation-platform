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
    [Route("api/Faculties")]
    [ApiController]
    public class FacultiesController : ControllerBase
    {
        private readonly IFacultiesService facultiesService;

        public FacultiesController(IFacultiesService facultiesService)
        {
            this.facultiesService = facultiesService;
        }

        // GET: api/Faculties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Faculty>>> GetFaculty()
        {
            var facultiesList = facultiesService.GetAll();
            return Ok(facultiesList);
        }

        // GET: api/Faculties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Faculty>> GetFaculty(int id)
        {
            var faculty = facultiesService.Get(id);

            if (faculty == null)
            {
                return NotFound();
            }

            return faculty;
        }

        // PUT: api/Faculties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFaculty(int id, Faculty faculty)
        {
            if (id != faculty.Id)
            {
                return BadRequest();
            }

            bool updated = facultiesService.Update(faculty);

            if (updated)
            {
                return Ok();
            }
            else
            {
                if (!facultiesService.Exists(id))
                {
                    return NotFound();
                }
            }
            return NoContent();
        }

        // POST: api/Faculties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Faculty>> PostFaculty(Faculty faculty)
        {
            bool created = facultiesService.Create(faculty);
            if (!created)
            {
                return StatusCode(500, "Could not create status object");
            }
            return Created();
        }

        // DELETE: api/Faculties/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            bool deleted = facultiesService.Delete(id);

            if (!deleted)
            {
                return StatusCode(500, "Could not delete status object");
            }
            return Ok();
        }
    }
}
