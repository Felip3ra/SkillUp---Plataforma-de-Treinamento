using ProjetoSkillUp.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<Users?> VerifyLoginAndPasswordAsync(string email, string senha);
        Task<bool> RegisterUserAsync(Users user);
    }
}
