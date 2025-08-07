using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Products;
using Balena.Entities.Models;

namespace Balena.Interfaces.SystemSettings
{
    public interface IProductService
    {
        Task<ApiResponseModel<List<ProductsResponseDto>>> GetAllProducts(PagingFilterModel Model);
        Task<ApiResponseModel<string>> AddNewProduct(Product Model);
        Task<ApiResponseModel<string>> UpdateProduct(Product Model);
        Task<ApiResponseModel<string>> DeleteProduct(int ProductId);
        Task<ApiResponseModel<List<Product>>> GetProductsByCategoryId(int CategoryId);
    }
}
