using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Contracts.DTOs.Orders
{
    public class OrderDetailsResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
        public decimal TotalValue { get; set; }
        
    }

    public class OrderWithDetailsResponse
    {
        public string TableNumber { get; set; }
        public string Notes { get; set; }
        public decimal? TotalValue { get; set; }
        public double Tax { get; set; }
        public List<OrderDetailsResponse> OrderDetails { get; set; }
    }
}
