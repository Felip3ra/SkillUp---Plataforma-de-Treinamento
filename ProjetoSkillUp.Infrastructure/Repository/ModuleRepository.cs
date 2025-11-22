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

        public void CompleteModule(CompleteModuleDto dto)
        {
            var module = _context.Modules
                .FirstOrDefault(m => m.Id == dto.ModuleId);

            if (module == null)
                throw new Exception("Módulo não encontrado.");

            var enrollment = _context.Enrollments
                .Include(e => e.ModuleProgress)
                .FirstOrDefault(e => e.UserId == dto.UserId && e.CourseId == module.CourseId);

            if (enrollment == null)
                throw new Exception("Usuário não está matriculado neste curso.");

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

            var totalModules = _context.Modules.Count(m => m.CourseId == module.CourseId);
            var completedModules = enrollment.ModuleProgress.Count(mp => mp.Status == Status.COMPLETED);
            if (!enrollment.ModuleProgress.Contains(progress))
                completedModules++;

            if (completedModules >= totalModules)
            {
                enrollment.CompletedAt = DateTime.UtcNow;
                _context.Enrollments.Update(enrollment);
                _context.SaveChanges();
            }
        }

        // Agora o método retorna DTOs usando AutoMapper
        public IEnumerable<Module> GetModulesByCourse(int courseId)
        {
            var modules = _context.Modules.Where(m => m.CourseId == courseId).ToList();
            return _mapper.Map<IEnumerable<Module>>(modules);
        }
    }
}
