using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Specifications.Admin.Categories
{
    public class CategorySpecification : BaseSpecification<Category>
    {
        public CategorySpecification(string SearchText) : base()
        {
            if (!string.IsNullOrEmpty(SearchText))
                AddCriteria(i => i.CategoryName.Contains(SearchText));
        }
    }
}
