using Microsoft.AspNetCore.Mvc;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;

namespace ProjetoSkillUp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        #region Read
        [HttpPost("VerificaLogin")]
        public async Task<IActionResult> VerificaLogin([FromQuery] string email, [FromQuery] string senha)
        {
            if (email is null || senha is null) {
                return BadRequest(new { Message = "Um dos campos está vazio"});
            }
            var verificado = await _userRepository.VerifyLoginAndPasswordAsync(email, senha);

            if(verificado != null)
            {
                return Ok(new { Message = "Usuário validado com sucesso", User = verificado});
            }
            return BadRequest(new { Message = "Usuário não é válido" });
        }
        #endregion

        #region Create
        [HttpPost("RegistraUsuario")]
        public async Task<IActionResult> RegistraUsuario([FromBody] Users user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }
            bool verificado = await _userRepository.RegisterUserAsync(user);

            if (verificado == true)
            {
                return Ok(new { Message = "Usuário cadastrado com sucesso" });
            }
            return BadRequest(new { Message = "Cadastro inválido" });
        }
        #endregion
    }
}
