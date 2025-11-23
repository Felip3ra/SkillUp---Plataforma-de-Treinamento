using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using ProjetoSkillUp.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Infrastructure.Repository
{

    public class QuizRepository : IQuizRepository
    {
        private readonly AppDbContext _context;
        public QuizRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Quiz> CreateQuizWithQuestionsAsync(CreateQuizDto dto)
        {
            if (dto.ModuleId == 0)
                throw new Exception("Módulo inválido.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            var quiz = new Quiz
            {
                ModuleId = dto.ModuleId,
                //PassingScore = dto.PassingScore,
                Created_at = DateTime.UtcNow
            };

            await _context.Quizzes.AddAsync(quiz);
            await _context.SaveChangesAsync();

            int order = 1;

            foreach (var q in dto.Questions)
            {
                var question = new Quiz_Questions
                {
                    QuizId = quiz.Id,
                    Question_Text = q.Text,
                    Type = TypeQuizzQuestion.MULTIPLE_CHOICE,
                    Order_Index = order++
                };

                await _context.QuizQuestions.AddAsync(question);
                await _context.SaveChangesAsync();

                int optIndex = 0;

                foreach (var opt in q.Options)
                {
                    var option = new Quiz_Options
                    {
                        QuestionId = question.Id,
                        Option_Text = opt.Text,
                        Is_Correct = optIndex == q.CorrectIndex
                    };

                    await _context.QuizOptions.AddAsync(option);
                    optIndex++;
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return quiz;
        }


        public async Task<IEnumerable<Quiz_Options>> GetOptionsByQuestionAsync(int id)
        {
            try
            {
                return await _context.QuizOptions
                .Where(o => o.QuestionId == id)
                .ToListAsync();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Quiz> GetQuizByModuleAsync(int id)
        {
            try
            {
                return await _context.Quizzes.FirstOrDefaultAsync(x => x.ModuleId == id);
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public async Task<IEnumerable<Quiz_Questions>> GetQuizQuestionsAsync(int id)
        {
            try
            {
                return await _context.QuizQuestions
                .Where(q => q.QuizId == id)
                .OrderBy(q => q.Order_Index)
                .ToListAsync();
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public async Task<QuizWithQuestionsDto?> GetQuizWithQuestionsByModuleAsync(int moduleId)
        {
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.ModuleId == moduleId);

            if (quiz == null)
                return null;

            var questions = await _context.QuizQuestions
                .Where(q => q.QuizId == quiz.Id)
                .OrderBy(q => q.Order_Index)
                .Select(q => new QuizQuestionWithOptionsDto
                {
                    Id = q.Id,
                    QuestionText = q.Question_Text,
                    Type = q.Type,
                    OrderIndex = q.Order_Index,
                    Options = _context.QuizOptions
                        .Where(o => o.QuestionId == q.Id)
                        .ToList()
                })
                .ToListAsync();

            return new QuizWithQuestionsDto
            {
                Quiz = quiz,
                Questions = questions
            };
        }
    }
}
