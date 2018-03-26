using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuotationAPI.Models;

namespace QuotationAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/categories")]
    public class CategoriesController : Controller
    {
        private readonly ModelsContext _context;

        public CategoriesController(ModelsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Category> GetCategories()
        {
            return _context.Categories;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _context.Categories.SingleOrDefaultAsync(m => m.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }    
    }
}