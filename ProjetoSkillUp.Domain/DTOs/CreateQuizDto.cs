using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.DTOs
{
    public class CreateQuizDto
    {
        public int ModuleId { get; set; }
        public int PassingScore { get; set; }
        public List<CreateQuestionDto> Questions { get; set; }
    }

}
