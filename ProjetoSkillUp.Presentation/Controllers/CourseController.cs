using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CourseController : Controller
    {
        private readonly IRepository<Course> _repositoryCourse;

        public CourseController(IRepository<Course> repository)
        {
            _repositoryCourse = repository;
        }

        #region Read

        // GET /Course/GetCourse/1
        [HttpGet("GetCourse/{id}")]
        public IActionResult GetCourse(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "Id inválido" });
            }

            var course = _repositoryCourse.GetById(id);

            if (course == null)
            {
                return NotFound(new { Message = "O curso não foi encontrado..." });
            }

            return Ok(new { Message = "Curso encontrado", Course = course });
        }

        // GET /Course/GetCourses
        [HttpGet("GetCourses")]
        public IActionResult GetCourses()
        {
            var courses = _repositoryCourse.GetAll() ?? new List<Course>();

            return Ok(new { Message = "Cursos encontrados", Course = courses });
        }

        #endregion

        #region Create

        // POST /Course/CriaCurso
        [HttpPost("CriaCurso")]
        public IActionResult CriaCurso([FromBody] Course course)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }

            bool verificado = _repositoryCourse.Add(course);

            if (verificado)
            {
                return Ok(new { Message = "Curso cadastrado com sucesso" });
            }

            return BadRequest(new { Message = "Cadastro inválido" });
        }

        #endregion
    }
}
