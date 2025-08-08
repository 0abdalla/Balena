using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Orders;
using Balena.Entities.Models;
using Balena.Interfaces.SystemSettings;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers.SystemSettings
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("GetAllOrders")]
        public async Task<ApiResponseModel<List<Order>>> GetAllOrders(PagingFilterModel Model)
        {
            var results = await _orderService.GetAllOrders(Model);
            return results;
        }

        [HttpGet("GetOrderDetailsByOrderId")]
        public async Task<ApiResponseModel<List<OrderDetailsResponse>>> GetOrderDetailsByOrderId(int OrderId)
        {
            var results = await _orderService.GetOrderDetailsByOrderId(OrderId);
            return results;
        }

        [HttpPost("AddNewOrder")]
        public async Task<ApiResponseModel<string>> AddNewOrder(OrderWithDetailsDto Model)
        {
            var results = await _orderService.AddNewOrder(Model);
            return results;
        }

        [HttpPost("UpdateOrder")]
        public async Task<ApiResponseModel<string>> UpdateOrder(OrderWithDetailsDto Model)
        {
            var results = await _orderService.UpdateOrder(Model);
            return results;

        }

        [HttpGet("CancelOrder")]
        public async Task<ApiResponseModel<string>> CancelOrder(string VoidReason, string Action, string VoidNotes, int OrderId)
        {
            var results = await _orderService.CancelOrder(VoidReason, Action, VoidNotes, OrderId);
            return results;
        }
    }
}
