using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EnrollmentController : Controller
    {
        private readonly IRepository<Enrollment> _repositoryEnrollment;
        private readonly IEnrollmentsRepository _enrollmentsRepository;
        public EnrollmentController(IRepository<Enrollment> repositoryEnrollment, IEnrollmentsRepository enrollmentsRepository)
        {
            _repositoryEnrollment = repositoryEnrollment;
            _enrollmentsRepository = enrollmentsRepository;
        }
        #region Read
        [HttpGet("GetEnrollments")]
        public IActionResult GetEnrollments()
        {
            var courses = _repositoryEnrollment.GetAll();

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Inscricões não foram encontradas..." });
            }

            return Ok(new { Message = "Inscricões encontradas", Course = courses });
        }
        [HttpGet("GetEnrollmentsByUser/{id}")]
        public IActionResult GetEnrollmentsByUser(int id)
        {
            var courses = _enrollmentsRepository.GetEnrollmentsByUser(id);

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Inscricões não foram encontradas..." });
            }

            return Ok(new { Message = "Inscricões encontradas", Course = courses });
        }
        #endregion
    }
}
