using ProjetoSkillUp.Domain.Models;

namespace ProjetoSkillUp.Domain.DTOs
{
    public class CreateCourseDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public Level Level { get; set; }
        public int EstimatedDurationMinutes { get; set; }
        public bool IsMandatory { get; set; }
        public int CreatedById { get; set; }
        public List<int>? CollaboratorIds { get; set; }
    }
}
