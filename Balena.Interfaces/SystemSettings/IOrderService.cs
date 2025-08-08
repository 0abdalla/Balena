using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Orders;
using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Interfaces.SystemSettings
{
    public interface IOrderService
    {
        Task<ApiResponseModel<List<Order>>> GetAllOrders(PagingFilterModel Model);
        Task<ApiResponseModel<List<OrderDetailsResponse>>> GetOrderDetailsByOrderId(int OrderId);
        Task<ApiResponseModel<string>> AddNewOrder(OrderWithDetailsDto dto);
        Task<ApiResponseModel<string>> UpdateOrder(OrderWithDetailsDto order);
        Task<ApiResponseModel<string>> CancelOrder(string VoidReason, string Action, string VoidNotes, int OrderId);
    }
}
