using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimilarHadithsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SimilarHadithsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<similar_hadiths>>> GetSimilarHadiths()
    {
        return await _context.similar_hadiths.ToListAsync();
    }
}
