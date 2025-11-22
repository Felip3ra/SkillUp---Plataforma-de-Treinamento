using System;

namespace ProjetoSkillUp.Domain.Models
{
    public class Quiz_Options
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string Option_Text { get; set; }
        public bool Is_Correct { get; set; }

        public Quiz_Questions Question { get; set; }
    }
}
