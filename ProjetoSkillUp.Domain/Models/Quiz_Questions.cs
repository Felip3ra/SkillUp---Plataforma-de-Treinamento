using System;
using System.Collections.Generic;

namespace ProjetoSkillUp.Domain.Models
{
    public class Quiz_Questions
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string Question_Text { get; set; }
        public TypeQuizzQuestion Type { get; set; }
        public int Order_Index { get; set; }

        public Quiz Quiz { get; set; }
        public ICollection<Quiz_Options> Options { get; set; } = new List<Quiz_Options>();
    }
}
