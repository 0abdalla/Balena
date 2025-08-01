using Balena.Entities.Models;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers
{
   
        [ApiController]
        [Route("api/[controller]")]
        public class CategoryController : ControllerBase
        {
            private readonly IUnitOfWork _unitOfWork;

            public CategoryController(IUnitOfWork unitOfWork)
            {
                _unitOfWork = unitOfWork;
            }

            [HttpGet("all")]
            public async Task<IActionResult> GetAll() => Ok(await _unitOfWork.Categories.GetAllAsync());

            [HttpPost("add")]
            public async Task<IActionResult> Add(Category category)
            {
                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.CompleteAsync();
                return Ok(category);
            }

            [HttpPut("edit/{id}")]
            public async Task<IActionResult> Edit(int id, Category category)
            {
                var existing = await _unitOfWork.Categories.GetByIdAsync(id);
                if (existing == null) return NotFound();
                existing.CategoryName = category.CategoryName;
                await _unitOfWork.CompleteAsync();
                return Ok(existing);
            }

            [HttpDelete("delete/{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null) return NotFound();
                _unitOfWork.Categories.Delete(category);
                await _unitOfWork.CompleteAsync();
                return Ok();
            }
        }
    
}
