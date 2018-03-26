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
    [Route("api/quotes")]
    public class QuotesController : Controller
    {
        private readonly ModelsContext _context;

        public QuotesController(ModelsContext context)
        {
            _context = context;
        }

        [Route("sortquote/{sort}")]
        [HttpGet]
        public IEnumerable<Quote> SortQuote(string sort)
        {
            switch (sort)
            {
                case "asc":
                    {
                        return _context.Quotes.OrderBy(q => q.Author).Include(c => c.Category);
                    }
                case "desc":
                    {
                        return _context.Quotes.OrderByDescending(q => q.Author).Include(c => c.Category);
                    }

            }
            return null;
        }

        [HttpGet]
        public IEnumerable<Quote> GetQuotes()
        {
            return _context.Quotes.Include(c => c.Category);
        }

        //Выбор цитаты для редактирования
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuote([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quote = await _context.Quotes.SingleOrDefaultAsync(m => m.Id == id);

            if (quote == null)
            {
                return NotFound();
            }
            return Ok(quote);
        }

        // Редактирование цитаты 
        [HttpPut]
        public async Task<IActionResult> PutQuote([FromBody] Quote quote)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(quote).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Quotes.Any(x => x.Id == quote.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            quote.Category = _context.Categories.Where(c => c.Id == quote.CategoryId).Single();

            return Ok(quote);
        }

        //Создание цитаты
        [HttpPost]
        public IActionResult CreateQuote([FromBody]Quote quote)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            quote.DateCreate = DateTime.UtcNow;
            quote.Category = _context.Categories.Where(c => c.Id == quote.CategoryId).Single();
            _context.Quotes.Add(quote);
            _context.SaveChanges();
            return Ok(quote);
        }

        //Удаление цитаты
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuote([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quote = await _context.Quotes.SingleOrDefaultAsync(m => m.Id == id);
            if (quote == null)
            {
                return NotFound();
            }

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return Ok(quote);
        }
    }
}