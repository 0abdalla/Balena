using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Specifications.Admin.Products
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification(string SearchText) : base()
        {
            if (!string.IsNullOrEmpty(SearchText))
                AddCriteria(i => i.ProductName.Contains(SearchText));

            AddInclude(i => i.Category);
        }
    }
}
