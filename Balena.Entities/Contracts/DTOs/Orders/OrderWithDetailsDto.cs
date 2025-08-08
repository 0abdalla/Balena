using Balena.Entities.Common;

namespace Balena.Entities.Contracts.DTOs.Orders
{
    public class OrderWithDetailsDto
    {
        public int? OrderId { get; set; }
        public int? CustomerID { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string? Notes { get; set; }
        public double Tax { get; set; }
        public string? UserId { get; set; }
        public string? TableNumber { get; set; }
        public List<OrderDetailDto> Details { get; set; }
    }

    public class OrderDetailDto
    {
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
