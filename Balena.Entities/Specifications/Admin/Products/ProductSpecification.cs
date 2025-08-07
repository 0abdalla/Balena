using Balena.Entities.Common;
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
        public ProductSpecification(PagingFilterModel filterModel, bool applyPaging = true) : base()
        {
            var searchText = filterModel.FilterList.FirstOrDefault(f => f.CategoryName == "SearchText")?.ItemId;

            if (!string.IsNullOrEmpty(searchText))
                AddCriteria(fc => fc.CategoryName.Contains(searchText));

            AddInclude(i => i.Category);

            if (applyPaging)
                ApplyPaging((filterModel.Currentpage - 1) * filterModel.Pagesize, filterModel.Pagesize);


        }
    }
}
