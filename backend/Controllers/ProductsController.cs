using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly MarketplaceContext _context;

    public ProductsController(MarketplaceContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category.Name == category);

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        var products = await query.ToListAsync();

        return Ok(products.Select(p => new ProductResponse(
            p.Id,
            p.Name,
            p.Description,
            p.Price,
            p.Category.Name,
            p.ImageUrl,
            p.CreatedAt
        )));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return NotFound();

        return Ok(new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Category.Name,
            product.ImageUrl,
            product.CreatedAt
        ));
    }
}
