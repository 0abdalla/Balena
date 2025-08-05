using Balena.Entities.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Specifications.Admin.Orders
{
    public class OrderNumberSpecification:BaseSpecification<Order>
    {
        public OrderNumberSpecification(DateTime OrderDate):base(i => i.OrderDate.Value.ToString("yyyy-MM-dd") == OrderDate.ToString("yyyy-MM-dd"))
        {
            
        }
    }
}
