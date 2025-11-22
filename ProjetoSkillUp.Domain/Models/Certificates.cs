using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Models
{
    public class Certificates
    {
        public int Id { get; set; }
        public int EnrollmentId { get; set; }
        public string Certificate_Code { get; set; }
        public DateTime Issued_At { get; set; }
        public string File_Url { get; set; }

        public Enrollment Enrollment { get; set; }
    }
}
