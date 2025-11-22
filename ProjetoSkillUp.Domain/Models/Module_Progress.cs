using System;

namespace ProjetoSkillUp.Domain.Models
{
    public class Module_Progress
    {
        public int Id { get; set; }
        public int EnrollmentId { get; set; }
        public int ModuleId { get; set; }
        public Status Status { get; set; }
        public DateTime? Last_Accessed_At { get; set; }
        public DateTime? Completed_At { get; set; }

        public Enrollment Enrollment { get; set; }
        public Module Module { get; set; }
    }
}
