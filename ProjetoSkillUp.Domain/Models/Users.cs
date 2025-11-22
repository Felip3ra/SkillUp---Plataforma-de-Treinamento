using System;
using System.Collections.Generic;

namespace ProjetoSkillUp.Domain.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password_hash { get; set; }
        public Role Role { get; set; }
        public string Department { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;
        public DateTime? Update_at { get; set; }

        // ✔ Relacionamentos
        public ICollection<Course> CoursesCreated { get; set; } = new List<Course>();
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
        public ICollection<Quiz_Attempts> QuizAttempts { get; set; } = new List<Quiz_Attempts>();
        public ICollection<Certificates> Certificates { get; set; } = new List<Certificates>();
        public ICollection<Module_Progress> ModuleProgress { get; set; } = new List<Module_Progress>();
    }
}
