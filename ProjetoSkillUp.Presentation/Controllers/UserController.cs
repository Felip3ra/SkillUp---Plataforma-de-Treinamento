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
        public IActionResult VerificaLogin([FromQuery] string email, [FromQuery] string senha)
        {
            if (email is null || senha is null) {
                return BadRequest(new { Message = "Um dos campos está vazio"});
            }
            bool verificado = _userRepository.VerifyLoginAndPassword(email, senha);

            if(verificado == true)
            {
                return Ok(new { Message = "Usuário validado com sucesso"});
            }
            return BadRequest(new { Message = "Usuário não é válido" });
        }
        #endregion

        #region Create
        [HttpPost("RegistraUsuario")]
        public IActionResult RegistraUsuario([FromBody] Users user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Cadastro inválido" });
            }
            bool verificado = _userRepository.RegisterUser(user);

            if (verificado == true)
            {
                return Ok(new { Message = "Usuário cadastrado com sucesso" });
            }
            return BadRequest(new { Message = "Cadastro inválido" });
        }
        #endregion
    }
}
