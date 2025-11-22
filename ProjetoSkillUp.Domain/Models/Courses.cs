using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Area { get; set; }
        public Level Level { get; set; }
        public int EstimatedDurationMinutes { get; set; }
        public bool IsMandatory { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }

        // FK do criador do curso
        public int CreatedById { get; set; }
        public Users CreatedBy { get; set; }

        // Relacionamentos
        public ICollection<Module> Modules { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }
    }

}
