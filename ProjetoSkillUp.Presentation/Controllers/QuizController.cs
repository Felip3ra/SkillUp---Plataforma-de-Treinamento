using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using System;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuizController : Controller
    {
        private readonly IQuizRepository _quizRepository;

        public QuizController(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        #region Read

        // 1️⃣ Buscar quiz pelo módulo
        [HttpGet("getQuizByModule/{moduleId}")]
        public async Task<IActionResult> GetQuizByModule(int moduleId)
        {
            if (moduleId <= 0)
                return BadRequest("Id do módulo inválido.");

            var quiz = await _quizRepository.GetQuizByModuleAsync(moduleId);
            if (quiz == null)
                return NotFound("Quiz não encontrado para este módulo.");

            return Ok(quiz);
        }

        // 2️⃣ Buscar quiz completo com perguntas e opções
        [HttpGet("getQuizWithQuestions/{moduleId}")]
        public async Task<IActionResult> GetQuizWithQuestions(int moduleId)
        {
            if (moduleId <= 0)
                return BadRequest("Id do módulo inválido.");

            var quizDto = await _quizRepository.GetQuizWithQuestionsByModuleAsync(moduleId);
            if (quizDto == null)
                return NotFound("Quiz não encontrado para este módulo.");

            return Ok(quizDto);
        }

        // 3️⃣ Buscar perguntas de um quiz
        [HttpGet("getQuestions/{quizId}")]
        public async Task<IActionResult> GetQuestions(int quizId)
        {
            if (quizId <= 0)
                return BadRequest("Id do quiz inválido.");

            var questions = await _quizRepository.GetQuizQuestionsAsync(quizId);
            return Ok(questions);
        }

        // 4️⃣ Buscar opções de uma pergunta
        [HttpGet("getOptions/{questionId}")]
        public async Task<IActionResult> GetOptions(int questionId)
        {
            if (questionId <= 0)
                return BadRequest("Id da pergunta inválido.");

            var options = await _quizRepository.GetOptionsByQuestionAsync(questionId);
            return Ok(options);
        }

        #endregion

        #region Create

        // 5️⃣ Criar quiz com perguntas e opções
        [HttpPost("createQuiz")]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto dto)
        {
            if (dto == null)
                return BadRequest("Dados inválidos.");

            try
            {
                var quiz = await _quizRepository.CreateQuizWithQuestionsAsync(dto);
                return Ok(quiz);
            }
            catch (Exception ex)
            {
                // Aqui você pode logar o erro em produção
                return StatusCode(500, $"Erro ao criar quiz: {ex.Message}");
            }
        }

        #endregion
    }
}
