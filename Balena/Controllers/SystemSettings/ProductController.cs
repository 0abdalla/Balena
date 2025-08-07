using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Products;
using Balena.Entities.Models;
using Balena.Interfaces.SystemSettings;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers.SystemSettings
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("GetAllProducts")]
        public async Task<ApiResponseModel<List<ProductsResponseDto>>> GetAllProducts(PagingFilterModel Model)
        {
            var results = await _productService.GetAllProducts(Model);
            return results;
        }

        [HttpPost("AddNewProduct")]
        public async Task<ApiResponseModel<string>> AddNewProduct([FromForm] Product Model)
        {
            var results = await _productService.AddNewProduct(Model);
            return results;
        }

        [HttpPost("UpdateProduct")]
        public async Task<ApiResponseModel<string>> UpdateProduct([FromForm] Product Model)
        {
            var results = await _productService.UpdateProduct(Model);
            return results;

        }

        [HttpGet("DeleteProduct")]
        public async Task<ApiResponseModel<string>> DeleteProduct(int ProductId)
        {
            var results = await _productService.DeleteProduct(ProductId);
            return results;

        }

        [HttpGet("GetProductsByCategoryId")]
        public async Task<ApiResponseModel<List<Product>>> GetProductsByCategoryId(int CategoryId)
        {
            var results = await _productService.GetProductsByCategoryId(CategoryId);
            return results;
        }
    }
}
