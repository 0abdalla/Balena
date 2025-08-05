using Balena.DTO;
using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Orders;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public OrderController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("GetAllOrders")]
        public async Task<IActionResult> GetAll(PagingFilterModel Model)
        {
            var SearchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var Spec = new OrderSpecification(SearchText);
            var results = await _unitOfWork.Orders.GetAllWithSpecAsync(Spec);
            return Ok(results);
        }

        [HttpGet("GetOrderDetailsByOrderId")]
        public async Task<IActionResult> GetOrderDetailsById(int OrderId)
        {
            var Spec = new OrderDetailsSpecification(OrderId);
            var results = await _unitOfWork.Orders.GetByIdWithSpecAsync(Spec);
            return Ok(results);
        }

        [HttpPost("UpdateOrder")]
        public async Task<IActionResult> Edit(OrderWithDetailsDto order)
        {
            try
            {
                var Spec = new OrderDetailsSpecification(order.OrderId.Value);
                var entity = await _unitOfWork.Repository<Order>().GetByIdWithSpecAsync(Spec);
                if (entity != null)
                {
                    await _unitOfWork.Repository<OrderDetail>().DeleteWhereAsync(i => i.OrderId == order.OrderId);
                    foreach (var detail in order.Details)
                    {
                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.OrderId.Value,
                            ProductId = detail.ProductID,
                            Quantity = detail.Quantity,
                            UnitPrice = detail.UnitPrice
                        };
                        await _unitOfWork.Repository<OrderDetail>().AddAsync(orderDetail);
                    }
                    entity.CustomerId = order.CustomerID;
                    entity.TotalAmount = order.TotalAmount;
                    entity.PaymentMethod = order.PaymentMethod;

                    await _unitOfWork.CompleteAsync();
                    return Ok(entity);
                }
                else
                    return BadRequest(false);


            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }

        }

        [HttpGet("DeleteOrder")]
        public async Task<IActionResult> Delete(int OrderId)
        {
            try
            {
                var order = await _unitOfWork.Orders.GetByIdAsync(OrderId);
                if (order == null) return NotFound(false);
                _unitOfWork.Orders.Delete(order);
                await _unitOfWork.Repository<OrderDetail>().DeleteWhereAsync(i => i.OrderId == OrderId);
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest(false);
            }
           
        }

        [HttpPost("AddNewOrder")]
        public async Task<IActionResult> SaveWithDetails([FromBody] OrderWithDetailsDto dto)
        {
            try
            {
                var Spec = new OrderNumberSpecification(DateTime.UtcNow);
                var OrderNumber = await _unitOfWork.Repository<Order>().MaxAsync(i =>
                i.OrderDate.Value.Year == DateTime.UtcNow.Year
                && i.OrderDate.Value.Month == DateTime.UtcNow.Month
                && i.OrderDate.Value.Day == DateTime.UtcNow.Day
                , i => (int?)i.OrderNumber) ?? 0;
                var order = new Order
                {
                    CustomerId = dto.CustomerID,
                    //EmployeeId = dto.UserId,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = dto.TotalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    OrderNumber = OrderNumber + 1
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
                return Ok(true);
            }
            catch (Exception)
            {
                return BadRequest(false);
            }

        }
    }
}
