using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Interfaces
{
    public interface IModuleRepository
    {
        IEnumerable<Module> getModulesByCourse (int id);
        void CompleteModule(CompleteModuleDto dto);
    }
}
