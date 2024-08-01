//SimilarHadithsController.cs

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
    public async Task<ActionResult<IEnumerable<similar_hadiths>>> GetSimilarHadiths([FromQuery] int limit = 1000)
    {
        var filteredHadiths = await _context.similar_hadiths
                                            .Where(h => !h.hadith1_chain.Contains("nan") && !h.hadith2_chain.Contains("nan"))
                                            .Take(limit)
                                            .ToListAsync();
        return filteredHadiths;
    }

}
