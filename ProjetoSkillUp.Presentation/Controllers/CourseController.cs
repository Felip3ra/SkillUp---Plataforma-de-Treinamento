using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using ProjetoSkillUp.Infrastructure.Repository;


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
        [HttpGet("$PegaCurso/{id}")]
        public IActionResult PegaCurso(int id)
        {
            if (id == null || id == 0)
            {
                return BadRequest(new { Message = "Id inválido" });
            }

            var course = _repositoryCourse.GetById(id);

            if (course == null)
            {
                return BadRequest(new { Message = "O curso não foi encontrado..." });
            }

            return Ok(new { Message = "Curso encontrado", Course = course });
        }
        #endregion

        #region Create
        [HttpPost("CriaCurso")]
        public IActionResult CriaCurso([FromBody] Course course) {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }
            bool verificado = _repositoryCourse.Add(course);

            if (verificado == true)
            {
                return Ok(new { Message = "Curso cadastrado com sucesso" });
            }
            return BadRequest(new { Message = "Cadastro inválido" });
        }
        #endregion
    }
}
