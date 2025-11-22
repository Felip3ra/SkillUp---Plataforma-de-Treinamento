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
        Users? VerifyLoginAndPassword(string email, string senha);
        bool RegisterUser(Users user);
    }
}
