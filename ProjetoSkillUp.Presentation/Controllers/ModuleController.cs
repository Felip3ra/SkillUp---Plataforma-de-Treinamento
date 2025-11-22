using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ModuleController : Controller
    {
        private readonly IRepository<Module> _repositoryModulo;
        private readonly IModuleRepository _moduleRepository;
        public ModuleController(IRepository<Module> repositoryModulo, IModuleRepository moduleRepository)
        {
            _repositoryModulo = repositoryModulo;
            _moduleRepository = moduleRepository;
        }

        #region Read
        [HttpGet("getModulesByCourse/{id}")]
        public IActionResult getModulesByCourse(int id)
        {
            if (id == null || id == 0)
            {
                return BadRequest(new { Message = "Id inválido" });
            }

            var courses = _moduleRepository.getModulesByCourse(id);

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Módulos não foram encontrados..." });
            }

            return Ok(new { Message = "Módulos encontrado", Course = courses });
        }
        [HttpGet("getModules")]
        public IActionResult getModules()
        {

            var courses = _repositoryModulo.GetAll();

            if (courses == null)
            {
                return BadRequest(new { Message = "Os Módulos não foram encontrados..." });
            }

            return Ok(new { Message = "Módulos encontrado", Course = courses });
        }
        #endregion


        #region Create
        [HttpPost("CreateModule")]
        public IActionResult CreateModule([FromBody] Module course)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }
            bool verificado = _repositoryModulo.Add(course);

            if (verificado == true)
            {
                return Ok(new { Message = "Modulo cadastrado com sucesso" });
            }
            return BadRequest(new { Message = "Cadastro inválido" });
        }
        #endregion

        #region Update
        // ✅ Completar módulo
        [HttpPost("completeModule")]
        public IActionResult CompleteModule([FromBody] CompleteModuleDto dto)
        {
            if (dto == null || dto.ModuleId <= 0 || dto.UserId <= 0)
                return BadRequest("Dados inválidos.");

            try
            {
                _moduleRepository.CompleteModule(dto);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao completar módulo: {ex.Message}");
            }
        }
        #endregion
    }
}
