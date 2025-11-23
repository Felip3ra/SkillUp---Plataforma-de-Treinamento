using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using ProjetoSkillUp.Domain.DTOs;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CourseController : Controller
    {
        private readonly IRepository<Course> _repositoryCourse;
        private readonly IEnrollmentsRepository _enrollmentsRepository;

        public CourseController(IRepository<Course> repository, IEnrollmentsRepository enrollmentsRepository)
        {
            _repositoryCourse = repository;
            _enrollmentsRepository = enrollmentsRepository;
        }

        #region Read

        // GET /Course/GetCourse/1
        [HttpGet("GetCourse/{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "Id inválido" });
            }

            var course = await _repositoryCourse.GetByIdAsync(id);

            if (course == null)
            {
                return NotFound(new { Message = "O curso não foi encontrado..." });
            }

            return Ok(new { Message = "Curso encontrado", Course = course });
        }

        // GET /Course/GetCourses
        [HttpGet("GetCourses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _repositoryCourse.GetAllAsync() ?? new List<Course>();

            return Ok(new { Message = "Cursos encontrados", Course = courses });
        }

        #endregion

        #region Create

        // POST /Course/CriaCurso
        [HttpPost("CriaCurso")]
        public async Task<IActionResult> CriaCurso([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }

            var course = new Course
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                Area = dto.Area,
                Level = dto.Level,
                EstimatedDurationMinutes = dto.EstimatedDurationMinutes,
                IsMandatory = dto.IsMandatory,
                CreatedById = dto.CreatedById,
                Created_at = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow // Assuming UpdatedAt is also set on creation
            };

            bool verificado = await _repositoryCourse.AddAsync(course);

            if (verificado)
            {
                var enrollment = new Enrollment
                {
                    UserId = dto.CreatedById,
                    CourseId = course.Id,
                    StartedAt = DateTime.UtcNow
                };
                await _enrollmentsRepository.CreateEnrollmentAsync(enrollment);

                if (dto.CollaboratorIds != null && dto.CollaboratorIds.Any())
                {
                    foreach (var collaboratorId in dto.CollaboratorIds)
                    {
                        var collaboratorEnrollment = new Enrollment
                        {
                            UserId = collaboratorId,
                            CourseId = course.Id,
                            StartedAt = DateTime.UtcNow
                        };
                        await _enrollmentsRepository.CreateEnrollmentAsync(collaboratorEnrollment);
                    }
                }


                return Ok(new { Message = "Curso cadastrado com sucesso" });
            }

            return BadRequest(new { Message = "Cadastro inválido" });
        }
        #endregion
    }
}
