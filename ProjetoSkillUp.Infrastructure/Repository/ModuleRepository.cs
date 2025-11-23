using Microsoft.EntityFrameworkCore;
using ProjetoSkillUp.Domain.DTOs;
using ProjetoSkillUp.Domain.Interfaces;
using ProjetoSkillUp.Domain.Models;
using ProjetoSkillUp.Infrastructure.Context;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjetoSkillUp.Infrastructure.Repository
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ModuleRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task CompleteModuleAsync(CompleteModuleDto dto)
        {
            var module = await _context.Modules
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == dto.ModuleId);

            if (module == null)
                throw new Exception("Módulo não encontrado.");

            var enrollment = await _context.Enrollments
                .Include(e => e.ModuleProgress)
                .FirstOrDefaultAsync(e => e.UserId == dto.UserId && e.CourseId == module.CourseId);

            if (enrollment == null)
                throw new Exception("Usuário não está matriculado neste curso.");

            var progress = await _context.ModuleProgress
                .FirstOrDefaultAsync(mp => mp.ModuleId == dto.ModuleId && mp.EnrollmentId == enrollment.Id);

            if (progress == null)
            {
                progress = new Module_Progress
                {
                    ModuleId = dto.ModuleId,
                    EnrollmentId = enrollment.Id,
                    Status = Status.COMPLETED,
                    Completed_At = DateTime.UtcNow
                };
                await _context.ModuleProgress.AddAsync(progress);
            }
            else
            {
                progress.Status = Status.COMPLETED;
                progress.Completed_At = DateTime.UtcNow;
                _context.ModuleProgress.Update(progress);
            }

            await _context.SaveChangesAsync();

            // Lógica de conclusão do curso
            var totalModulesInCourse = await _context.Modules
                .CountAsync(m => m.CourseId == module.CourseId);

            var completedModulesCount = await _context.ModuleProgress
                .CountAsync(mp => mp.EnrollmentId == enrollment.Id && mp.Status == Status.COMPLETED);

            if (completedModulesCount >= totalModulesInCourse)
            {
                enrollment.CompletedAt = DateTime.UtcNow;
                // Se você tiver um campo de Status na Inscrição
                // enrollment.Status = Status.COMPLETED; 
                _context.Enrollments.Update(enrollment);
                await _context.SaveChangesAsync();
            }
        }

        // Agora o método retorna DTOs usando AutoMapper
        public async Task<IEnumerable<Module>> GetModulesByCourseAsync(int courseId)
        {
            var modules = await _context.Modules.Where(m => m.CourseId == courseId).ToListAsync();
            return _mapper.Map<IEnumerable<Module>>(modules);
        }
    }
}
