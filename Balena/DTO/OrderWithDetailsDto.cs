namespace Balena.DTO
{
    public class OrderWithDetailsDto
    {
        public int CustomerID { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public List<OrderDetailDto> Details { get; set; }
    }

    public class OrderDetailDto
    {
        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
