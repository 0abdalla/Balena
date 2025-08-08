using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Interfaces.SystemSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers.SystemSettings
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderTableController : ControllerBase
    {
        private readonly IOrderTableService _orderTableService;
        public OrderTableController(IOrderTableService orderTableService)
        {
            _orderTableService = orderTableService;
        }

        [HttpPost("GetAllOrderTables")]
        public async Task<ApiResponseModel<List<OrderTable>>> GetAllOrderTables(PagingFilterModel Model)
        {
            var results = await _orderTableService.GetAllOrderTables(Model);
            return results;
        }

        [HttpPost("AddNewOrderTable")]
        public async Task<ApiResponseModel<string>> AddNewOrderTable(OrderTable Model)
        {
            var results = await _orderTableService.AddNewOrderTable(Model);
            return results;

        }

        [HttpPost("UpdateOrderTable")]
        public async Task<ApiResponseModel<string>> UpdateOrderTable(OrderTable Model)
        {
            var results = await _orderTableService.UpdateOrderTable(Model);
            return results;

        }

        [HttpGet("DeleteOrderTable")]
        public async Task<ApiResponseModel<string>> DeleteOrderTable(int TableId)
        {
            var results = await _orderTableService.DeleteOrderTable(TableId);
            return results;
        }

        [HttpGet("FinishOrderTable")]
        public async Task<ApiResponseModel<string>> FinishOrderTable(int TableId)
        {
            var results = await _orderTableService.FinishOrderTable(TableId);
            return results;
        }
    }
}
