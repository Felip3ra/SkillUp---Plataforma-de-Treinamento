using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Models;
using System.Collections.Generic;

namespace ProjetoSkillUp.Domain.Interfaces
{
    public interface IQuizRepository
    {
        Task<Quiz> GetQuizByModuleAsync(int moduleId);
        Task<IEnumerable<Quiz_Questions>> GetQuizQuestionsAsync(int quizId);
        Task<IEnumerable<Quiz_Options>> GetOptionsByQuestionAsync(int questionId);
        Task<QuizWithQuestionsDto> GetQuizWithQuestionsByModuleAsync(int moduleId);
        Task<Quiz> CreateQuizWithQuestionsAsync(CreateQuizDto dto);
    }
}
