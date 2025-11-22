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
        public IEnumerable<Enrollment> GetEnrollmentsByUser(int id)
        {
            try
            {
                return _context.Enrollments.ToList();
            }
            catch (Exception ex) {
                throw ex;
            }
        }
    }
}
