using Balena.Entities.Models;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("all")]
        public async Task<IActionResult> GetAll() => Ok(await _unitOfWork.Products.GetAllAsync());

        [HttpPost("add")]
        public async Task<IActionResult> Add(Product product)
        {
            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.CompleteAsync();
            return Ok(product);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, Product product)
        {
            var existing = await _unitOfWork.Products.GetByIdAsync(id);
            if (existing == null) return NotFound();
            existing.ProductName = product.ProductName;
            existing.Price = product.Price;
            existing.Description = product.Description;
            existing.CategoryId = product.CategoryId;
            await _unitOfWork.CompleteAsync();
            return Ok(existing);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null) return NotFound();
            _unitOfWork.Products.Delete(product);
            await _unitOfWork.CompleteAsync();
            return Ok();
        }

        [HttpGet("by-category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId);
            return Ok(products);
        }
    }
}
