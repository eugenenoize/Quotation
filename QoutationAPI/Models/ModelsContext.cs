using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuotationAPI.Models
{
    public class ModelsContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Quote> Quotes { get; set; }

        public ModelsContext(DbContextOptions<ModelsContext> options) : base(options)
        {

        }
    }
}
