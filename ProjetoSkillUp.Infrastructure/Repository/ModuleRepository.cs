using Microsoft.EntityFrameworkCore;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using ProjetoSkillUp.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Infrastructure.Repository
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly AppDbContext _context;
        public ModuleRepository(AppDbContext context)
        {
            _context = context;
        }

        public void CompleteModule(CompleteModuleDto dto)
        {
            // 1️⃣ Pegar o módulo
            var module = _context.Modules
                .FirstOrDefault(m => m.Id == dto.ModuleId);

            if (module == null)
                throw new Exception("Módulo não encontrado.");

            // 2️⃣ Pegar enrollment do usuário no curso desse módulo
            var enrollment = _context.Enrollments
                .Include(e => e.ModuleProgress) // inclui progresso dos módulos
                .FirstOrDefault(e => e.UserId == dto.UserId && e.CourseId == module.CourseId);

            if (enrollment == null)
                throw new Exception("Usuário não está matriculado neste curso.");

            // 3️⃣ Pegar ou criar progresso do módulo
            var progress = _context.ModuleProgress
                .FirstOrDefault(mp => mp.ModuleId == dto.ModuleId && mp.EnrollmentId == enrollment.Id);

            if (progress == null)
            {
                progress = new Module_Progress
                {
                    ModuleId = dto.ModuleId,
                    EnrollmentId = enrollment.Id,
                    Status = Status.COMPLETED,
                    Completed_At = DateTime.UtcNow
                };
                _context.ModuleProgress.Add(progress);
            }
            else
            {
                progress.Status = Status.COMPLETED;
                progress.Completed_At = DateTime.UtcNow;
                _context.ModuleProgress.Update(progress);
            }

            _context.SaveChanges();

            // 4️⃣ Verificar se todos os módulos do curso estão concluídos
            var totalModules = _context.Modules
                .Count(m => m.CourseId == module.CourseId);

            var completedModules = enrollment.ModuleProgress
                .Count(mp => mp.Status == Status.COMPLETED) + (progress.Status == Status.COMPLETED ? 1 : 0);

            if (completedModules >= totalModules)
            {
                enrollment.CompletedAt = DateTime.UtcNow;
                _context.Enrollments.Update(enrollment);
                _context.SaveChanges();
            }
        }




        public IEnumerable<Module> getModulesByCourse(int id)
        {
            try
            {
                return _context.Modules.Where(m => m.CourseId == id);
            }
            catch (Exception ex) {
                throw ex;
            }
        }
    }
}
