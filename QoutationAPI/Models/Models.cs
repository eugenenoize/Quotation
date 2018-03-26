using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace QuotationAPI.Models
{
    public class Quote
    {
        public Quote()
        {

        }

        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Укажите автора цитаты")]
        [Display(Name = "Автор")]
        [StringLength(20, ErrorMessage = "Цитата должна составлять не более 20 символов")]
        public string Author { get; set; }
        [Required(ErrorMessage = "Укажите текст цитаты")]
        [Display(Name = "Текст")]
        [StringLength(40, ErrorMessage = "Цитата должна составлять не более 40 символов")]
        public string Text { get; set; }
        [Display(Name ="Дата создания")]
        public DateTime DateCreate { get; set; }
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        [Display(Name ="Категория")]
        public virtual Category Category { get; set; }
    }

    public class Category
    {
        public Category()
        {

        }
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
