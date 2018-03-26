using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuotationAPI.Models
{
    public class SampleData
    {
        public static void Initialize(ModelsContext context)
        {
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category() { Name = "Афоризмы" },
                    new Category() { Name = "Артисты" },
                    new Category() { Name = "Политики" },
                    new Category() { Name = "Писатели" }
                    );
                context.SaveChanges();
            }


        }
    }
}
