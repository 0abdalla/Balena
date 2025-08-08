using Balena.Entities.Common;
using Balena.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Interfaces.SystemSettings
{
    public interface IOrderTableService
    {
        Task<ApiResponseModel<List<OrderTable>>> GetAllOrderTables(PagingFilterModel Model);
        Task<ApiResponseModel<string>> AddNewOrderTable(OrderTable Model);
        Task<ApiResponseModel<string>> UpdateOrderTable(OrderTable Model);
        Task<ApiResponseModel<string>> DeleteOrderTable(int TableId);
        Task<ApiResponseModel<string>> FinishOrderTable(int TableId);
    }
}
