using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.DTOs
{
    public class QuizWithQuestionsDto
    {
        public Quiz Quiz { get; set; }
        public List<QuizQuestionWithOptionsDto> Questions { get; set; }
    }
}
