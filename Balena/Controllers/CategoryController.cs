using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Categories;
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

        [HttpPost("GetAllCategories")]
        public async Task<IActionResult> GetAll(PagingFilterModel Model)
        {
            var searchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var Spec = new CategorySpecification(searchText);
            var results = await _unitOfWork.Categories.GetAllWithSpecAsync(Spec);
            return Ok(results);
        }

        [HttpPost("AddNewCategory")]
        public async Task<IActionResult> Add(Category category)
        {
            try
            {
                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ez)
            {
                return BadRequest(false);
            }

        }

        [HttpPost("UpdateCategory")]
        public async Task<IActionResult> Edit(Category category)
        {
            try
            {
                var existing = await _unitOfWork.Categories.GetByIdAsync(category.CategoryId);
                if (existing == null) return NotFound(false);
                existing.CategoryName = category.CategoryName;
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }
            
        }

        [HttpGet("DeleteCategory")]
        public async Task<IActionResult> Delete(int CategoryId)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(CategoryId);
                if (category == null) return NotFound(false);
                _unitOfWork.Categories.Delete(category);
                await _unitOfWork.CompleteAsync();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(false);
            }
        }
    }

}
