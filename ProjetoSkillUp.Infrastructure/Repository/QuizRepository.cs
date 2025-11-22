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

        public Quiz CreateQuizWithQuestions(CreateQuizDto dto)
        {
            if (dto.ModuleId == 0)
                throw new Exception("Módulo inválido.");

            using var transaction = _context.Database.BeginTransaction();

            var quiz = new Quiz
            {
                ModuleId = dto.ModuleId,
                //PassingScore = dto.PassingScore,
                Created_at = DateTime.UtcNow
            };

            _context.Quizzes.Add(quiz);
            _context.SaveChanges();

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

                _context.QuizQuestions.Add(question);
                _context.SaveChanges();

                int optIndex = 0;

                foreach (var opt in q.Options)
                {
                    var option = new Quiz_Options
                    {
                        QuestionId = question.Id,
                        Option_Text = opt.Text,
                        Is_Correct = optIndex == q.CorrectIndex
                    };

                    _context.QuizOptions.Add(option);
                    optIndex++;
                }
            }

            _context.SaveChanges();
            transaction.Commit();

            return quiz;
        }


        public IEnumerable<Quiz_Options> GetOptionsByQuestion(int id)
        {
            try
            {
                return _context.QuizOptions
                .Where(o => o.QuestionId == id)
                .ToList();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public Quiz GetQuizByModule(int id)
        {
            try
            {
                return _context.Quizzes.FirstOrDefault(x => x.ModuleId == id);
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public IEnumerable<Quiz_Questions> GetQuizQuestions(int id)
        {
            try
            {
                return _context.QuizQuestions
                .Where(q => q.QuizId == id)
                .OrderBy(q => q.Order_Index)
                .ToList();
            }
            catch (Exception ex) {
                throw ex;
            }
        }

        public QuizWithQuestionsDto? GetQuizWithQuestionsByModule(int moduleId)
        {
            var quiz = _context.Quizzes
                .FirstOrDefault(q => q.ModuleId == moduleId);

            if (quiz == null)
                return null;

            var questions = _context.QuizQuestions
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
                .ToList();

            return new QuizWithQuestionsDto
            {
                Quiz = quiz,
                Questions = questions
            };
        }
    }
}
