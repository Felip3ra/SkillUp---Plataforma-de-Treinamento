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
        public async Task<IActionResult> GetEnrollments()
        {
            var courses = await _repositoryEnrollment.GetAllAsync();

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Inscricões não foram encontradas..." });
            }

            return Ok(new { Message = "Inscricões encontradas", Course = courses });
        }
        [HttpGet("GetEnrollmentsByUser/{id}")]
        public async Task<IActionResult> GetEnrollmentsByUser(int id)
        {
            var courses = await _enrollmentsRepository.GetEnrollmentsByUserAsync(id);

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Inscricões não foram encontradas..." });
            }

            return Ok(new { Message = "Inscricões encontradas", Course = courses });
        }
        #endregion
        #region Create
        [HttpPost("CreateEnrollment")]
        public async Task<IActionResult> CreateEnrollment([FromBody] Enrollment enrollment)
        {
            if (enrollment == null)
            {
                return BadRequest(new { Message = "Dados de inscrição inválidos." });
            }

            await _enrollmentsRepository.CreateEnrollmentAsync(enrollment);

            return Ok(new { Message = "Inscrição realizada com sucesso." });
        }
        #endregion
    }
}
