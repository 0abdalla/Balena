using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Products;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Products;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("GetAllProducts")]
        public async Task<IActionResult> GetAll(PagingFilterModel Model)
        {
            var SearchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var Spec = new ProductSpecification(SearchText);
            var results = await _unitOfWork.Products.GetAllWithSpecAsync(Spec);
            var data = results.Select(i => new ProductsResponseDto
            {
                ProductId = i.ProductId,
                CategoryId = i.CategoryId,
                ProductName = i.ProductName,
                CategoryName = i.Category.CategoryName,
                Price = i.Price,
                Description = i.Description
            }).ToList();
            return Ok(data);
        }

        [HttpPost("AddNewProduct")]
        public async Task<IActionResult> Add(Product product)
        {
            try
            {
                await _unitOfWork.Products.AddAsync(product);
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }
        }

        [HttpPost("UpdateProduct")]
        public async Task<IActionResult> Edit(Product product)
        {
            try
            {
                var existing = await _unitOfWork.Products.GetByIdAsync(product.ProductId);
                if (existing == null) return NotFound(false);
                existing.ProductName = product.ProductName;
                existing.Price = product.Price;
                existing.Description = product.Description;
                existing.CategoryId = product.CategoryId;
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }

        }

        [HttpGet("DeleteProduct")]
        public async Task<IActionResult> Delete(int ProductId)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(ProductId);
                if (product == null) return NotFound(false);
                _unitOfWork.Products.Delete(product);
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }

        }

        [HttpGet("GetProductsByCategoryId")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId);
            return Ok(products);
        }
    }
}
