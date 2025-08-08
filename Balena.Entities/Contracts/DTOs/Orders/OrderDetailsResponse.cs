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
        public string productName { get; set; }
        public string categoryName { get; set; }
        public int quantity { get; set; }
        public decimal price { get; set; }
        public string image { get; set; }
        public decimal totalValue { get; set; }
    }
}
