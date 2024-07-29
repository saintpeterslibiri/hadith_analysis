using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class similar_hadiths
{
    [Key]
    [Column("id_")]
    public int id_ {get; set;}
    public double similarity { get; set; }
    public Guid hadith1_id { get; set; }
    public Guid hadith2_id { get; set; }
    public string? hadith1_chain { get; set; }
    public string? hadith2_chain { get; set; }

}