using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Orders;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Orders;
using Balena.Interfaces.Common;
using Balena.Interfaces.Repositories;
using Balena.Interfaces.SystemSettings;
using Balena.Services.Common;

namespace Balena.Services.SystemSettings
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppSettings _appSettings;
        private string ApiLocalUrl;
        public OrderService(IUnitOfWork unitOfWork, IAppSettings appSettings)
        {
            _unitOfWork = unitOfWork;
            _appSettings = appSettings;
            ApiLocalUrl = _appSettings.ApiUrlLocal;
        }

        public async Task<ApiResponseModel<List<Order>>> GetAllOrders(PagingFilterModel Model)
        {
            var SearchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var Spec = new OrderSpecification(SearchText);
            var results = await _unitOfWork.Repository<Order>().GetAllWithSpecAsync(Spec);
            var Count = await _unitOfWork.Repository<Order>().CountAsync();
            return ApiResponseModel<List<Order>>.Success(GenericErrors.GetSuccess, results, Count);
        }

        public async Task<ApiResponseModel<List<OrderDetailsResponse>>> GetOrderDetailsByOrderId(int OrderId)
        {
            var Spec = new OrderDetailsSpecification(OrderId);
            var results = await _unitOfWork.Repository<Order>().GetByIdWithSpecAsync(Spec);
            var data = results.OrderDetails.Select(i => new OrderDetailsResponse
            {
                ProductId = i.Product.ProductId,
                ProductName = i.Product.ProductName,
                CategoryName = i.Product.Category.CategoryName,
                Image = Path.Combine(ApiLocalUrl, "Images", ImageFiles.Items.ToString(), i.Product.Image ?? string.Empty),
                Price = i.Product.Price,
                Quantity = i.Quantity,
                TotalValue = i.Product.Price * i.Quantity,
            }).ToList();
            return ApiResponseModel<List<OrderDetailsResponse>>.Success(GenericErrors.GetSuccess, data);
        }

        public async Task<ApiResponseModel<string>> AddNewOrder(OrderWithDetailsDto dto)
        {
            try
            {
                if (!string.IsNullOrEmpty(dto.TableNumber))
                {
                    var TableEntity = await _unitOfWork.Repository<OrderTable>().FirstOrDefaultAsync(i => i.TableNumber == dto.TableNumber);
                    if (TableEntity != null)
                    {
                        if (!TableEntity.IsActive)
                            return ApiResponseModel<string>.Failure(GenericErrors.TableIsBusy);

                        TableEntity.IsActive = false;
                    }

                }

                var Spec = new OrderNumberSpecification(DateTime.UtcNow);
                var OrderNumber = await _unitOfWork.Repository<Order>().MaxAsync(i =>
                i.OrderDate.Value.Year == DateTime.UtcNow.Year
                && i.OrderDate.Value.Month == DateTime.UtcNow.Month
                && i.OrderDate.Value.Day == DateTime.UtcNow.Day
                , i => (int?)i.OrderNumber) ?? 0;
                var order = new Order
                {
                    CustomerId = dto.CustomerID,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = dto.TotalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    StatusId = (int)OrderStatus.Finished,
                    Notes = dto.Notes,
                    Tax = dto.Tax,
                    InsertUser = dto.UserId,
                    TableNumber = dto.TableNumber,
                    InsertDate = DateTime.UtcNow,
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
                if (!string.IsNullOrEmpty(order.TableNumber))
                {
                    var TableEntity = await _unitOfWork.Repository<OrderTable>().FirstOrDefaultAsync(i => i.TableNumber == order.TableNumber);
                    if (TableEntity != null)
                    {
                        if (!TableEntity.IsActive)
                            return ApiResponseModel<string>.Failure(GenericErrors.TableIsBusy);

                        TableEntity.IsActive = false;
                    }
                }

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

                    entity.TotalAmount = order.TotalAmount;
                    entity.TableNumber = order.TableNumber;
                    entity.Tax = order.Tax;
                    entity.Notes = order.Notes;
                    entity.UpdateUser = order.UserId;
                    entity.UpdateDate = DateTime.UtcNow;

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

        public async Task<ApiResponseModel<string>> CancelOrder(string VoidReason, string Action, string? VoidNotes, int OrderId)
        {
            try
            {
                var Order = await _unitOfWork.Repository<Order>().GetByIdAsync(OrderId);

                if (Order != null)
                {
                    Order.VoidReason = VoidReason;
                    Order.VoidNotes = VoidNotes;
                    Order.StatusId = (int)OrderStatus.Canceled;

                    await _unitOfWork.CompleteAsync();
                    return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
                }

                return ApiResponseModel<string>.Failure(GenericErrors.NotFound);
            }
            catch (Exception Ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<OrderWithDetailsResponse>> GetOrderWithDetailsByOrderId(int OrderId)
        {
            var Spec = new OrderDetailsSpecification(OrderId);
            var results = await _unitOfWork.Repository<Order>().GetByIdWithSpecAsync(Spec);
            var data = new OrderWithDetailsResponse();
            if (results != null)
            {
                data.TableNumber = results.TableNumber;
                data.Notes = results.Notes;
                data.TotalValue = results.TotalAmount;
                data.Tax = results.Tax;
                data.OrderDetails = results.OrderDetails.Select(i => new OrderDetailsResponse
                {
                    ProductId = i.Product.ProductId,
                    ProductName = i.Product.ProductName,
                    Image = Path.Combine(ApiLocalUrl, "Images", ImageFiles.Items.ToString(), i.Product.Image ?? string.Empty),
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    TotalValue = i.Product.Price * i.Quantity,
                }).ToList();
            }

            return ApiResponseModel<OrderWithDetailsResponse>.Success(GenericErrors.GetSuccess, data);
        }
    }
}
