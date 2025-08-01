using Balena.Entities.Models;
using Balena.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Services.Repositories
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        //private readonly IUnitOfWork _unitOfWork;

        //public ItemController(IUnitOfWork unitOfWork)
        //{
        //    _unitOfWork = unitOfWork;
        //}

        //[HttpGet("all")]
        //public async Task<IActionResult> GetAll()
        //{
        //    var items = await _unitOfWork.Products.GetAllAsync();
        //    return Ok(items);
        //}

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    var item = await _unitOfWork.Products.GetByIdAsync(id);
        //    if (item == null)
        //        return NotFound();
        //    return Ok(item);
        //}

        //[HttpGet("by-category/{categoryId}")]
        //public async Task<IActionResult> GetByCategory(int categoryId)
        //{
        //    var items = await _unitOfWork.Products.FindAsync(p => p.CategoryId == categoryId);
        //    return Ok(items);
        //}

        //[HttpPost("add")]
        //public async Task<IActionResult> Add(Product product)
        //{
        //    await _unitOfWork.Products.AddAsync(product);
        //    await _unitOfWork.CompleteAsync();
        //    return Ok(product);
        //}

        //[HttpPut("edit/{id}")]
        //public async Task<IActionResult> Edit(int id, Product product)
        //{
        //    var existing = await _unitOfWork.Products.GetByIdAsync(id);
        //    if (existing == null)
        //        return NotFound();

        //    existing.ProductName = product.ProductName;
        //    existing.Price = product.Price;
        //    existing.Description = product.Description;
        //    existing.CategoryId = product.CategoryId;

        //    await _unitOfWork.CompleteAsync();
        //    return Ok(existing);
        //}

        //[HttpDelete("delete/{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var item = await _unitOfWork.Products.GetByIdAsync(id);
        //    if (item == null)
        //        return NotFound();

        //    _unitOfWork.Products.Delete(item);
        //    await _unitOfWork.CompleteAsync();
        //    return Ok();
        //}
    }
}
