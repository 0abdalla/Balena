using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Specifications.Admin.Orders
{
    public class OrderSpecification : BaseSpecification<Order>
    {
        public OrderSpecification(string SearchText) : base()
        {
            if (!string.IsNullOrEmpty(SearchText))
                AddCriteria(i => i.OrderNumber.ToString().Contains(SearchText));
        }
    }
}
