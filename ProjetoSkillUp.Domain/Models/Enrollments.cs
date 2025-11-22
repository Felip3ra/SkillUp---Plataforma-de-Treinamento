using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        public Users User { get; set; }
        public Course Course { get; set; }
        public ICollection<Module_Progress> ModuleProgress { get; set; }
        public Certificates Certificate { get; set; }  // 1:1
    }

}
