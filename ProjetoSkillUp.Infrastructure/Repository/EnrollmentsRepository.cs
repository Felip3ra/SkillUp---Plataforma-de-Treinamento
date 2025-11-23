using Microsoft.EntityFrameworkCore;
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
    public class EnrollmentsRepository : IEnrollmentsRepository
    {
        private readonly AppDbContext _context;
        public EnrollmentsRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateEnrollmentAsync(Enrollment enrollment)
        {
            await _context.Enrollments.AddAsync(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetEnrollmentsByUserAsync(int id)
        {
            try
            {
                return await _context.Enrollments.Where(e => e.UserId == id).ToListAsync();
            }
            catch (Exception ex) {
                throw ex;
            }
        }
    }
}
