using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.DTOs
{
    public class CreateQuestionDto
    {
        public string Text { get; set; }
        public int CorrectIndex { get; set; }
        public List<CreateOptionDto> Options { get; set; }
    }

}
