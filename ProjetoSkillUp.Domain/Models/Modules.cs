using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Models
{
    public class Module
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public TypeModules Type { get; set; }
        public string? ContentUrl { get; set; }
        public int OrderIndex { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;


        // FK
        public Course Course { get; set; }

        // Relacionamentos
        public Quiz Quiz { get; set; } // 1:1
        public ICollection<Module_Progress> ModuleProgress { get; set; }
    }

}
