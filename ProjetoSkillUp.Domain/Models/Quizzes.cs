using ProjetoSkillUp.Domain.Models;

public class Quiz
{
    public int Id { get; set; }
    public int ModuleId { get; set; }

    public string Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Module Module { get; set; }
    public ICollection<Quiz_Questions> Questions { get; set; }
    public ICollection<Quiz_Attempts> Attempts { get; set; }
}
