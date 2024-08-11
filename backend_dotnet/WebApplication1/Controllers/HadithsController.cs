using Microsoft.AspNetCore.Mvc;
        using Microsoft.EntityFrameworkCore;
        using WebApplication1.Data;
        using WebApplication1.Models;
        
using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using OfficeOpenXml;
using CsvHelper;
using System.Globalization;
using System.Net.Quic;

namespace WebApplication1.Controllers;

        [ApiController]
        [Route("api/[controller]")]
        public class HadithsController : ControllerBase
        {
            private readonly AppDbContext _context;

            public HadithsController(AppDbContext context)
            {
                _context = context;
            }
[HttpGet]
public async Task<IActionResult> GetHadiths(
    [FromQuery] int page = 1,
    [FromQuery] string search = "",
    [FromQuery] List<string> musannif = null,
    [FromQuery] List<string> book = null,
    [FromQuery] int? chainLength = null,
    [FromQuery] int? chainIndex = null,
    [FromQuery] string narratorName = null)
{
    int perPage = 10;
    var query = _context.Hadiths.AsQueryable();

    // Arama terimi ile filtreleme
    if (!string.IsNullOrEmpty(search))
    {
        query = query.Where(h =>
            EF.Functions.ILike(h.arabic, $"%{search}%") ||
            EF.Functions.ILike(h.turkish, $"%{search}%") ||
            EF.Functions.ILike(h.musannif, $"%{search}%") ||
            EF.Functions.ILike(h.book, $"%{search}%") ||
            EF.Functions.ILike(h.topic, $"%{search}%")
        );
    }

    // Musannif listesi ile filtreleme
    if (musannif != null && musannif.Count > 0)
    {
        query = query.Where(h => musannif.Contains(h.musannif));
    }

    // Kitap listesi ile filtreleme
    if (book != null && book.Count > 0)
    {
        query = query.Where(h => book.Contains(h.book));
    }

     if (chainLength.HasValue && chainLength.Value > 0)
    {
        query = query.Where(h => h.chain_length == chainLength.Value);
    }

    var hadiths = await query
        .Skip((page - 1) * perPage)
        .Take(perPage)
        .ToListAsync(); 

 
    return Ok(hadiths);
}

            [HttpGet("hadith-by-book")]
            public async Task<IActionResult> GetHadithByBook()
            {
                var result = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.book))
                    .GroupBy(h => h.book)
                    .Select(g => new { Book = g.Key!, HadithCount = g.Count() })
                    .OrderByDescending(x => x.HadithCount)
                    .ToListAsync();

                return Ok(result);
            }

            [HttpGet("hadith-by-musannif")]
            public async Task<IActionResult> GetHadithByMusannif()
            {
                var result = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.musannif))
                    .GroupBy(h => h.musannif)
                    .Select(g => new { Musannif = g.Key!, HadithCount = g.Count() })
                    .OrderByDescending(x => x.HadithCount)
                    .ToListAsync();

                return Ok(result);
            }

            [HttpGet("musannif-list")]
            public async Task<IActionResult> GetMusannifList()
            {
                var musannifList = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.musannif))
                    .Select(h => h.musannif)
                    .Distinct()
                    .ToListAsync();

                return Ok(musannifList);
            }

            [HttpGet("book-list")]
            public async Task<IActionResult> GetBookList()
            {
                var bookList = await _context.Hadiths
                    .Where(h => !string.IsNullOrEmpty(h.book))
                    .Select(h => h.book)
                    .Distinct()
                    .ToListAsync();

                return Ok(bookList);
            }
        [HttpGet("count")]
        public async Task<IActionResult> GetHadithsCount(
            [FromQuery] string search = "", 
            [FromQuery] List<string> musannif = null, 
            [FromQuery] List<string> book = null,
            [FromQuery] int? chainLength = null)
        {
            var query = _context.Hadiths.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h =>
                    EF.Functions.ILike(h.arabic, $"%{search}%") ||
                    EF.Functions.ILike(h.turkish, $"%{search}%") ||
                    EF.Functions.ILike(h.musannif, $"%{search}%") ||
                    EF.Functions.ILike(h.book, $"%{search}%") ||
                    EF.Functions.ILike(h.topic, $"%{search}%")
                );
            }

            if (musannif != null && musannif.Count > 0)
            {
                query = query.Where(h => musannif.Contains(h.musannif));
            }

            if (book != null && book.Count > 0)
            {
                query = query.Where(h => book.Contains(h.book));
            }

            if (chainLength.HasValue && chainLength.Value > 0)
            {
                query = query.Where(h => h.chain_length == chainLength.Value);
            }

            var totalCount = await query.CountAsync();
            
            Console.WriteLine(totalCount);

            return Ok(totalCount);
        }
        [HttpGet("chain-length/{length}")]
        public async Task<IActionResult> GetHadithsByChainLength(int length, int page = 1, int pageSize = 20)
        {
            var query = _context.Hadiths
                .Where(h => h.chain_length == length)
                .Select(h => new
                {
                    h.id,
                    h.chain_length
                });

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var filteredHadiths = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Hadiths = filteredHadiths
            };

            return Ok(result);
        }
        [HttpGet("isnad-network")]
        public async Task<IActionResult> GetIsnadNetwork()
        {
            var hadiths = await _context.Hadiths
                .Where(h => h.chain != null && h.chain_length != null)
                .Select(h => new
                {
                    h.id,
                    h.chain,
                    h.chain_length
                })
                .Take(1000) // Başlangıç için sınırlı sayıda hadis alalım
                .ToListAsync();

            var nodes = new List<object>();
            var links = new List<object>();
            var nodeIds = new HashSet<string>();

            foreach (var hadith in hadiths)
            {
                // Hadisi düğüm olarak ekle
                nodes.Add(new { id = hadith.id.ToString(), group = 1, label = hadith.id.ToString() });
                nodeIds.Add(hadith.id.ToString());

                if (!string.IsNullOrEmpty(hadith.chain))
                {
                    var narratorIds = hadith.chain.Split(';', StringSplitOptions.RemoveEmptyEntries)
                                                .Take(hadith.chain_length ?? 0)
                                                .Select(n => n.Trim())
                                                .ToList();

                    // Ravileri düğüm olarak ekle ve hadisle bağlantılarını oluştur
                    for (int i = 0; i < narratorIds.Count; i++)
                    {
                        var narratorId = $"narrator_{narratorIds[i]}";
                        if (!nodeIds.Contains(narratorId))
                        {
                            nodes.Add(new { id = narratorId, group = 2, label = narratorIds[i] });
                            nodeIds.Add(narratorId);
                        }

                        links.Add(new 
                        { 
                            source = i == 0 ? hadith.id.ToString() : $"narrator_{narratorIds[i-1]}", 
                            target = narratorId 
                        });
                    }
                }
            }

            return Ok(new { nodes, links });
        }
        [HttpGet("all-hadiths")]
        public async Task<IActionResult> GetAllHadiths(
            [FromQuery] string search = "", 
            [FromQuery] List<string> musannif = null, 
            [FromQuery] List<string> book = null, 
            [FromQuery] int? chainLength = null)
        {
            var query = _context.Hadiths.AsQueryable();

            var totalCount = await query.CountAsync(); 
            Response.Headers.Append("x", totalCount.ToString());

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(h =>
                    EF.Functions.ILike(h.arabic, $"%{search}%") ||
                    EF.Functions.ILike(h.turkish, $"%{search}%") ||
                    EF.Functions.ILike(h.musannif, $"%{search}%") ||
                    EF.Functions.ILike(h.book, $"%{search}%") ||
                    EF.Functions.ILike(h.topic, $"%{search}%")
                );
            }

            if (musannif != null && musannif.Count > 0)
            {
                query = query.Where(h => musannif.Contains(h.musannif));
            }

            if (book != null && book.Count > 0)
            {
                query = query.Where(h => book.Contains(h.book));
            }

            if (chainLength.HasValue && chainLength.Value > 0)
            {
                query = query.Where(h => h.chain_length == chainLength.Value);
            }

            var hadiths = await query
                .ToListAsync(); 

        
            return Ok(hadiths);
        }
        [HttpGet("download")]
public async Task<IActionResult> DownloadHadiths(
    string format,
    [FromQuery] string search = "",
    [FromQuery] List<string> musannif = null,
    [FromQuery] List<string> book = null,
    [FromQuery] int? chainLength = null)
{
    var query = _context.Hadiths.AsQueryable();
    // Filtreleri uygula
    if (!string.IsNullOrEmpty(search))
    {
        query = query.Where(h =>
            EF.Functions.ILike(h.arabic, $"%{search}%") ||
            EF.Functions.ILike(h.turkish, $"%{search}%") ||
            EF.Functions.ILike(h.musannif, $"%{search}%") ||
            EF.Functions.ILike(h.book, $"%{search}%") ||
            EF.Functions.ILike(h.topic, $"%{search}%")
        );
    }
    if (musannif != null && musannif.Count > 0)
    {
        query = query.Where(h => musannif.Contains(h.musannif));
    }
    if (book != null && book.Count > 0)
    {
        query = query.Where(h => book.Contains(h.book));
    }
    if (chainLength.HasValue && chainLength.Value > 0)
    {
        query = query.Where(h => h.chain_length == chainLength.Value);
    }
    // Filtrelenmiş verileri çek
    var hadiths = await query.ToListAsync();

    // Geçici dosya işlemleri
    var tempFile = Path.GetTempFileName();
    var tempDir = Path.GetDirectoryName(tempFile);
    var fileName = format.ToLower() == "excel" ? "hadiths.xlsx" : "hadiths.csv";
    var filePath = Path.Combine(tempDir, fileName);

    // Verileri istenen formatta dosyaya yaz
    if (format.ToLower() == "excel")
    {
        using (var package = new ExcelPackage(new FileInfo(filePath)))
        {
            var worksheet = package.Workbook.Worksheets.Add("Hadiths");
            worksheet.Cells.LoadFromCollection(hadiths, true);
            await package.SaveAsync();
        }
    }
    else if (format.ToLower() == "csv")
    {
        using (var writer = new StreamWriter(filePath))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {
            csv.WriteRecords(hadiths);
        }
    }
    else
    {
        return BadRequest("Unsupported format");
    }

    // ZIP işlemleri
    var zipFile = Path.Combine(tempDir, "hadiths.zip");
    using (var archive = ZipFile.Open(zipFile, ZipArchiveMode.Create))
    {
        archive.CreateEntryFromFile(filePath, fileName);
    }

    // ZIP dosyasını oku ve stream olarak döndür
    var memory = new MemoryStream();
    using (var stream = new FileStream(zipFile, FileMode.Open))
    {
        await stream.CopyToAsync(memory);
    }
    memory.Position = 0;

    // Geçici dosyaları temizle
    System.IO.File.Delete(tempFile);
    System.IO.File.Delete(filePath);
    System.IO.File.Delete(zipFile);

    return File(memory, "application/zip", "hadiths.zip");
}
[HttpGet("hadith-analyze")]
public async Task<IActionResult> GetHadithsAnalyze(
    [FromQuery] List<int>? chainIndex = null, // Opsiyonel liste
    [FromQuery] List<string>? narratorName = null, // Opsiyonel liste
    [FromQuery] List<string> musannif = null,
    [FromQuery] List<string>? bookName = null, // Opsiyonel liste
    [FromQuery] int page = 1, // Sayfa numarası, varsayılan 1
    [FromQuery] int perPage = 10) // Her sayfada gösterilecek kayıt sayısı, varsayılan 10
{
    // Hadisleri çekiyoruz
    var hadithsQuery = _context.Hadiths.AsQueryable();

    // Kitap ismi ile filtreleme
    if (bookName != null && bookName.Any())
    {
        hadithsQuery = hadithsQuery.Where(h => bookName.Contains(h.book));
    }
        // Musannif listesi ile filtreleme
    if (musannif != null && musannif.Count > 0)
    {
        hadithsQuery = hadithsQuery.Where(h => musannif.Contains(h.musannif));
    }

    // ChainIndex ve NarratorName için eşleşme kontrolü
    bool applyChainFilter = chainIndex != null && narratorName != null && chainIndex.Count == narratorName.Count;

    List<Hadith> hadithsList;

    if (applyChainFilter)
    {
        // Ravilere erişiyoruz
        var ravis = await _context.Ravis.ToListAsync();
        var raviDictionary = ravis.ToDictionary(r => r.ravi_id, r => r.narrator_name);

        // Tüm filtreleri uygulayarak hadisleri çekiyoruz
        hadithsList = await hadithsQuery.ToListAsync();

        // ChainIndex ve NarratorName filtrelerini uyguluyoruz
        hadithsList = hadithsList.Where(h =>
        {
            if (string.IsNullOrEmpty(h.chain))
                return false;

            var chainArray = h.chain.Split(';', StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < chainIndex.Count; i++)
            {
                int index = chainIndex[i];
                string name = narratorName[i];

                // Zincirin belirtilen indeksinde ravi olup olmadığını kontrol ediyoruz
                if (index - 1 < 0 || index - 1 >= chainArray.Length)
                    return false;

                if (!int.TryParse(chainArray[index - 1].Trim(), out int raviId))
                    return false;

                if (!raviDictionary.TryGetValue(raviId, out var raviName))
                    return false;

                if (!string.Equals(raviName, name, StringComparison.OrdinalIgnoreCase))
                    return false;
            }

            return true;
        }).ToList();
    }
    else
    {
        // Sadece kitap filtresi uygulanmışsa veya hiç filtre yoksa
        hadithsList = await hadithsQuery.ToListAsync();
    }

    // Toplam kayıt sayısını ve sayfa sayısını hesaplıyoruz
    var totalCount = hadithsList.Count;
    var totalPages = (int)Math.Ceiling((double)totalCount / perPage);

    // HTTP başlıklarına toplam kayıt ve sayfa sayısını ekliyoruz
    Response.Headers.Append("Total-Pages-hadith-analyze", totalPages.ToString());
    Response.Headers.Append("Total-Count-hadith-analyze", totalCount.ToString());

    // Sayfalama işlemini uyguluyoruz
    var pagedHadiths = hadithsList
        .Skip((page - 1) * perPage)
        .Take(perPage)
        .ToList();

    return Ok(pagedHadiths);
}


}