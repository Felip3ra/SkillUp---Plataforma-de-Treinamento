using System;

namespace ProjetoSkillUp.Domain.Models
{
    public class Quiz_Attempts
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public int Score { get; set; }
        public bool Passed { get; set; }
        public int Attempts_Number { get; set; }
        public DateTime Created_at { get; set; } = DateTime.UtcNow;


        public Quiz Quiz { get; set; }
        public Users User { get; set; }
    }
}
