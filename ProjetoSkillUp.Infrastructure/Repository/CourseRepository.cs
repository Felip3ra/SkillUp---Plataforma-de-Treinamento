using Microsoft.EntityFrameworkCore;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Infrastructure.Repository
{
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;
        public CourseRepository(AppDbContext context)
        {
            _context = context;
        }
        public void CompleteCourse(int userId, int courseId)
        {
            // 1️⃣ Pegar enrollment do usuário
            var enrollment = _context.Enrollments
                .Include(e => e.ModuleProgress)
                .FirstOrDefault(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment == null)
                throw new Exception("Usuário não está matriculado neste curso.");

            // 2️⃣ Contar total de módulos do curso
            var totalModules = _context.Modules
                .Count(m => m.CourseId == courseId);

            if (totalModules == 0)
                throw new Exception("Curso não possui módulos.");

            // 3️⃣ Contar módulos concluídos pelo usuário
            var completedModules = enrollment.ModuleProgress
                .Count(mp => mp.Status == Status.COMPLETED);

            if (completedModules < totalModules)
                throw new Exception("Ainda existem módulos pendentes.");

            // 4️⃣ Marcar curso como concluído
            enrollment.CompletedAt = DateTime.UtcNow;
            _context.Enrollments.Update(enrollment);
            _context.SaveChanges();
        }

    }
}
