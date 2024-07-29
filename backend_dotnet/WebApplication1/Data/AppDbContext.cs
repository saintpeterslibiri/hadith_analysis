using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Hadith> Hadiths { get; set; }
    public DbSet<Ravi> Ravis { get; set; }
    public DbSet<similar_hadiths> similar_hadiths { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("hadisler");
        modelBuilder.Entity<Hadith>().ToTable("hadith_t");
        modelBuilder.Entity<Ravi>().ToTable("narrators");
        modelBuilder.Entity<similar_hadiths>().ToTable("similar_hadiths");
    }
}