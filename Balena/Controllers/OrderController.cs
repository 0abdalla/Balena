using Balena.DTO;
using Balena.Entities.Models;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Balena.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public OrderController(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll() => Ok(await _unitOfWork.Orders.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id) => Ok(await _unitOfWork.Orders.GetByIdAsync(id));

        [HttpPost("add")]
        public async Task<IActionResult> Add(Order order)
        {
            order.OrderDate = DateTime.Now;
            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();
            return Ok(order);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, Order order)
        {
            var existing = await _unitOfWork.Orders.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.CustomerId = order.CustomerId;
            existing.TotalAmount = order.TotalAmount;
            existing.PaymentMethod = order.PaymentMethod;
            await _unitOfWork.CompleteAsync();
            return Ok(existing);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(id);
            if (order == null) return NotFound();
            _unitOfWork.Orders.Delete(order);
            await _unitOfWork.CompleteAsync();
            return Ok();
        }

        [HttpPost("save-with-details")]
        public async Task<IActionResult> SaveWithDetails([FromBody] OrderWithDetailsDto dto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var order = new Order
            {
                CustomerId = dto.CustomerID,
                EmployeeId = int.Parse(userId ?? "0"),
                OrderDate = DateTime.Now,
                TotalAmount = dto.TotalAmount,
                PaymentMethod = dto.PaymentMethod
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.CompleteAsync();

            foreach (var detail in dto.Details)
            {
                var orderDetail = new OrderDetail
                {
                    OrderId = order.OrderId,
                    ProductId = detail.ProductID,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice
                };
                await _unitOfWork.OrderDetails.AddAsync(orderDetail);
            }

            await _unitOfWork.CompleteAsync();
            return Ok(order);
        }
    }
}
