using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Models;
using System.Collections.Generic;

namespace ProjetoSkillUp.Domain.Interfaces
{
    public interface IQuizRepository
    {
        Quiz GetQuizByModule(int moduleId);
        IEnumerable<Quiz_Questions> GetQuizQuestions(int quizId);
        IEnumerable<Quiz_Options> GetOptionsByQuestion(int questionId);
        QuizWithQuestionsDto GetQuizWithQuestionsByModule(int moduleId);
        Quiz CreateQuizWithQuestions(CreateQuizDto dto);
    }
}
