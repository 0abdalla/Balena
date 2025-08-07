using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Interfaces.SystemSettings;
using Microsoft.AspNetCore.Mvc;

namespace Balena.Controllers.SystemSettings
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("GetAllCategories")]
        public async Task<ApiResponseModel<List<Category>>> GetAll(PagingFilterModel Model)
        {
            var results = await _categoryService.GetAllCategories(Model);
            return results;
        }

        [HttpPost("AddNewCategory")]
        public async Task<ApiResponseModel<string>> AddNewCategory([FromForm] Category Model)
        {
            var results = await _categoryService.AddNewCategory(Model);
            return results;

        }

        [HttpPost("UpdateCategory")]
        public async Task<ApiResponseModel<string>> UpdateCategory([FromForm] Category Model)
        {
            var results = await _categoryService.UpdateCategory(Model);
            return results;

        }

        [HttpGet("DeleteCategory")]
        public async Task<ApiResponseModel<string>> DeleteCategory(int CategoryId)
        {
            var results = await _categoryService.DeleteCategory(CategoryId);
            return results;
        }
    }

}
