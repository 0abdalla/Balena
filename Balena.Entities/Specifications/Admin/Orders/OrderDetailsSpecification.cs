using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Specifications.Admin.Orders
{
    public class OrderDetailsSpecification:BaseSpecification<Order>
    {
        public OrderDetailsSpecification(int OrderId) :base(i => i.OrderId == OrderId)
        {
            AddInclude(i => i.OrderDetails);
            AddInclude("OrderDetails.Product");
            AddInclude("OrderDetails.Product.Category");

        }
    }
}
