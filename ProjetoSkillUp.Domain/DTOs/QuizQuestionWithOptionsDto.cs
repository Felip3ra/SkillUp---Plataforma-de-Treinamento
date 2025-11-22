using ProjetoSkillUp.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.DTOs
{
    public class QuizQuestionWithOptionsDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; }
        public TypeQuizzQuestion Type { get; set; }
        public int OrderIndex { get; set; }
        public List<Quiz_Options> Options { get; set; }
    }
}
