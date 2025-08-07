using Balena.Entities.Common;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Categories;
using Balena.Interfaces.Common;
using Balena.Interfaces.Repositories;
using Balena.Interfaces.SystemSettings;
using Balena.Services.Common;
using Microsoft.Extensions.Options;
using System.Diagnostics;

namespace Balena.Services.SystemSettings
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppSettings _appSettings;
        private readonly IManageFileService _manageFileService;
        private readonly string _webRootPath;
        private string ApiLocalUrl;
        public CategoryService(IUnitOfWork unitOfWork, IManageFileService manageFileService, IOptions<AppPaths> options, IAppSettings appSettings)
        {
            _unitOfWork = unitOfWork;
            _appSettings = appSettings;
            _manageFileService = manageFileService;
            _webRootPath = options.Value.WebRootPath;
            ApiLocalUrl = _appSettings.ApiUrlLocal;

        }

        public async Task<ApiResponseModel<List<Category>>> GetAllCategories(PagingFilterModel Model)
        {
            var SearchText = Model.FilterList.FirstOrDefault(i => i.CategoryName == "SearchText")?.ItemId;
            var DataSpec = new CategorySpecification(Model);
            var CountSpec = new CategorySpecification(Model, false);
            var Results = await _unitOfWork.Repository<Category>().GetAllWithSpecAsync(DataSpec);
            var Count = await _unitOfWork.Repository<Category>().GetCountAsync(CountSpec);
            var data = Results.Select(i => new Category
            {
                CategoryId = i.CategoryId,
                CategoryName = i.CategoryName,
                Image = Path.Combine(ApiLocalUrl, "Images", ImageFiles.Categories.ToString(), i.Image ?? string.Empty),
            }).ToList();
            return ApiResponseModel<List<Category>>.Success(GenericErrors.GetSuccess, data, Count);
        }

        public async Task<ApiResponseModel<string>> AddNewCategory(Category Model)
        {
            try
            {
                if (Model.Files != null)
                {
                    var FileName = await _manageFileService.UploadFile(Model.Files, "", ImageFiles.Categories);
                    if (FileName.IsSuccess)
                        Model.Image = FileName.Results;
                    else
                        return FileName;
                }

                await _unitOfWork.Repository<Category>().AddAsync(Model);
                await _unitOfWork.CompleteAsync();
                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ez)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }

        }

        public async Task<ApiResponseModel<string>> UpdateCategory(Category Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Category>().GetByIdAsync(Model.CategoryId);
                if (Entity != null)
                {
                    Entity.CategoryName = Model.CategoryName;
                    if (Model.Files != null)
                    {
                        var FileName = await _manageFileService.UploadFile(Model.Files, Model.OldFileName, ImageFiles.Categories);
                        if (FileName.IsSuccess)
                            Entity.Image = FileName.Results;
                        else
                            return FileName;
                    }
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

        public async Task<ApiResponseModel<string>> DeleteCategory(int CategoryId)
        {
            try
            {
                var category = await _unitOfWork.Repository<Category>().GetByIdAsync(CategoryId);
                if (category != null)
                {
                    _unitOfWork.Repository<Category>().Delete(category);
                    DeleteCategoryFile(category.Image);
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

        private void DeleteCategoryFile(string CategoryImageName)
        {
            var CategoryImagePaths = Directory.GetFiles(Path.Combine(_webRootPath, "Images", ImageFiles.Categories.ToString()));

            if (CategoryImagePaths.Count() > 0)
            {
                var File = CategoryImagePaths.FirstOrDefault(i => i.Contains(CategoryImageName));
                if (File != null)
                    System.IO.File.Delete(File);
            }
        }
    }
}
