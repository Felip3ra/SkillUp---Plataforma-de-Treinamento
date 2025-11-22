using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Domain.Interfaces
{
    public interface ICourseRepository
    {
        void CompleteCourse(int userId, int courseId);
    }
}
