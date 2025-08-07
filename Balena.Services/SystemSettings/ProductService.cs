using Balena.Entities.Common;
using Balena.Entities.Contracts.DTOs.Products;
using Balena.Entities.Models;
using Balena.Entities.Specifications.Admin.Products;
using Balena.Interfaces.Common;
using Balena.Interfaces.Repositories;
using Balena.Interfaces.SystemSettings;
using Balena.Services.Common;
using Microsoft.Extensions.Options;

namespace Balena.Services.SystemSettings
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppSettings _appSettings;
        private readonly IManageFileService _manageFileService;
        private readonly string _webRootPath;
        private string ApiLocalUrl;

        public ProductService(IUnitOfWork unitOfWork, IManageFileService manageFileService, IOptions<AppPaths> options, IAppSettings appSettings)
        {
            _unitOfWork = unitOfWork;
            _appSettings = appSettings;
            _manageFileService = manageFileService;
            _webRootPath = options.Value.WebRootPath;
            ApiLocalUrl = _appSettings.ApiUrlLocal;

        }

        public async Task<ApiResponseModel<List<ProductsResponseDto>>> GetAllProducts(PagingFilterModel Model)
        {
            var DataSpec = new ProductSpecification(Model);
            var CountSpec = new ProductSpecification(Model, false);
            var results = await _unitOfWork.Repository<Product>().GetAllWithSpecAsync(DataSpec);
            var Count = await _unitOfWork.Repository<Product>().GetCountAsync(CountSpec);
            var data = results.Select(i => new ProductsResponseDto
            {
                ProductId = i.ProductId,
                CategoryId = i.CategoryId,
                ProductName = i.ProductName,
                CategoryName = i.Category.CategoryName,
                Image = Path.Combine(ApiLocalUrl, "Images", ImageFiles.Items.ToString(), i.Image ?? string.Empty),
                Price = i.Price,
                Description = i.Description
            }).ToList();
            return ApiResponseModel<List<ProductsResponseDto>>.Success(GenericErrors.GetSuccess, data, Count);
        }

        public async Task<ApiResponseModel<string>> AddNewProduct(Product Model)
        {
            try
            {
                if (Model.Files != null)
                {
                    var FileName = await _manageFileService.UploadFile(Model.Files, "", ImageFiles.Items);
                    if (FileName.IsSuccess)
                        Model.Image = FileName.Results;
                    else
                        return FileName;
                }

                await _unitOfWork.Repository<Product>().AddAsync(Model);
                await _unitOfWork.CompleteAsync();
                return ApiResponseModel<string>.Success(GenericErrors.AddSuccess);
            }
            catch (Exception ex)
            {
                return ApiResponseModel<string>.Failure(GenericErrors.TransFailed);
            }
        }

        public async Task<ApiResponseModel<string>> UpdateProduct(Product Model)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Product>().GetByIdAsync(Model.ProductId);
                if (Entity != null)
                {
                    Entity.ProductName = Model.ProductName;
                    Entity.Price = Model.Price;
                    Entity.Description = Model.Description;
                    Entity.CategoryId = Model.CategoryId;
                    if (Model.Files != null)
                    {
                        var FileName = await _manageFileService.UploadFile(Model.Files, Model.OldFileName, ImageFiles.Items);
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

        public async Task<ApiResponseModel<string>> DeleteProduct(int ProductId)
        {
            try
            {
                var Entity = await _unitOfWork.Repository<Product>().GetByIdAsync(ProductId);
                if (Entity != null)
                {
                    _unitOfWork.Repository<Product>().Delete(Entity);
                    DeleteCategoryFile(Entity.Image);
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

        public async Task<ApiResponseModel<List<Product>>> GetProductsByCategoryId(int CategoryId)
        {
            var results = await _unitOfWork.Repository<Product>().FindAsync(p => p.CategoryId == CategoryId);
            var data = results.Select(i => new Product
            {
                ProductId = i.ProductId,
                CategoryId = i.CategoryId,
                ProductName = i.ProductName,
                Image = Path.Combine(ApiLocalUrl, ImageFiles.Items.ToString(), i.Image ?? string.Empty),
                Description = i.Description,
            }).ToList();
            return ApiResponseModel<List<Product>>.Success(GenericErrors.GetSuccess, results);
        }

        private void DeleteCategoryFile(string ItemImageName)
        {
            var ItemImagePaths = Directory.GetFiles(Path.Combine(_webRootPath, "Images", ImageFiles.Items.ToString()));

            if (ItemImagePaths.Count() > 0)
            {
                var File = ItemImagePaths.FirstOrDefault(i => i.Contains(ItemImageName));
                if (File != null)
                    System.IO.File.Delete(File);
            }
        }
    }
}
