using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Categories;
using Balena.Entities.Specifications.Admin.OrderTables;
using Balena.Interfaces.Repositories;
using Balena.Interfaces.SystemSettings;
using Balena.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Services.SystemSettings
{
    public class OrderTableService : IOrderTableService
    {
        private readonly IUnitOfWork _unitOfWork;
        public OrderTableService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponseModel<List<OrderTable>>> GetAllOrderTables(PagingFilterModel Model)
        {
            var DataSpec = new OrderTableSpecification(Model);
            var CountSpec = new OrderTableSpecification(Model, false);
            var Results = await _unitOfWork.Repository<OrderTable>().GetAllWithSpecAsync(DataSpec);
            var Count = await _unitOfWork.Repository<OrderTable>().GetCountAsync(CountSpec);
            return ApiResponseModel<List<OrderTable>>.Success(GenericErrors.GetSuccess, Results, Count);
        }

        public async Task<ApiResponseModel<string>> AddNewOrderTable(OrderTable Model)
        {
            try
            {
                var TableIsExist = await _unitOfWork.Repository<OrderTable>().FirstOrDefaultAsync(i => i.TableNumber == Model.TableNumber);
                if (TableIsExist != null)
                    return ApiResponseModel<string>.Failure(GenericErrors.TableNumberExist);

                Model.InsertDate = DateTime.UtcNow;
                await _unitOfWork.Repository<OrderTable>().AddAsync(Model);
                await _unitOfWork.CompleteAsync();
                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ez)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }

        }

        public async Task<ApiResponseModel<string>> UpdateOrderTable(OrderTable Model)
        {
            try
            {
                var TableIsExist = await _unitOfWork.Repository<OrderTable>().FirstOrDefaultAsync(i => i.TableNumber == Model.TableNumber);
                if (TableIsExist != null)
                    return ApiResponseModel<string>.Failure(GenericErrors.TableNumberExist);

                var Entity = await _unitOfWork.Repository<OrderTable>().GetByIdAsync(Model.TableId);
                if (Entity != null)
                {
                    Entity.TableNumber = Model.TableNumber;
                    Entity.IsActive = true;
                    Entity.UpdateUser = Model.InsertUser;
                    Entity.UpdateDate = DateTime.UtcNow;
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

        public async Task<ApiResponseModel<string>> DeleteOrderTable(int TableId)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<OrderTable>().GetByIdAsync(TableId);
                if (Entity != null)
                {
                    _unitOfWork.Repository<OrderTable>().Delete(Entity);
                    await _unitOfWork.CompleteAsync();
                    return ApiResponseModel<string>.Success(GenericErrors.DeleteSuccess);
                }

                return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

            }
            catch (Exception ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> FinishOrderTable(int TableId)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<OrderTable>().GetByIdAsync(TableId);
                if (Entity != null)
                {
                    Entity.IsActive = true;
                    await _unitOfWork.CompleteAsync();
                    return ApiResponseModel<string>.Success(GenericErrors.FinishOrderTable);
                }

                return ApiResponseModel<string>.Failure(GenericErrors.NotFound);

            }
            catch (Exception ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }
    }
}
