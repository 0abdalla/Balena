using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Orders;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Orders;
using Balena.Interfaces.Repositories;
using Balena.Interfaces.SystemSettings;
using Balena.Services.Common;

namespace Balena.Services.SystemSettings
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponseModel<List<Order>>> GetAllOrders(PagingFilterModel Model)
        {
            var SearchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var Spec = new OrderSpecification(SearchText);
            var results = await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(Spec);
            var Count = await _unitOfWork.Repository<Order>().CountAsync();
            return ApiResponseModel<List<Order>>.Success(GenericErrors.GetSuccess, results, Count);
        }

        public async Task<ApiResponseModel<Order>> GetOrderDetailsByOrderId(int OrderId)
        {
            var Spec = new OrderDetailsSpecification(OrderId);
            var results = await _unitOfWork.Repository<Order>().GetByIdWithSpecAsync(Spec);
            return ApiResponseModel<Order>.Success(GenericErrors.GetSuccess, results);
        }

        public async Task<ApiResponseModel<string>> AddNewOrder(OrderWithDetailsDto dto)
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

                await _unitOfWork.Repository<Order>().AddAsync(order);
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
                    await _unitOfWork.Repository<OrderDetail>().AddAsync(orderDetail);
                }

                await _unitOfWork.CompleteAsync();
                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateOrder(OrderWithDetailsDto order)
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
                    return ApiResponseModel<string>.Success(GenericErrors.UpdateSuccess);
                }

                return ApiResponseModel<string>.Failure(GenericErrors.NotFound);


            }
            catch (Exception ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }

        }

        public async Task<ApiResponseModel<string>> DeleteOrder(int OrderId)
        {
            try
            {
                var order = await _unitOfWork.Repository<Order>().GetByIdAsync(OrderId);
                if (order != null)
                {
                    _unitOfWork.Repository<Order>().Delete(order);
                    await _unitOfWork.Repository<OrderDetail>().DeleteWhereAsync(i => i.OrderId == OrderId);
                    await _unitOfWork.CompleteAsync();
                    return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
                }

                return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

            }
            catch (Exception)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
    }
}
