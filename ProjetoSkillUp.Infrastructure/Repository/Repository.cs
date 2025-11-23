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
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        public Repository(AppDbContext context) { 
        
            _context = context;
        }

        public async Task<bool> AddAsync(T entity)
        {
            try
            {
                await _context.Set<T>().AddAsync(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch(Exception ex) {
                throw ex;
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            try
            {
                return await _context.Set<T>().ToListAsync();
            }
            catch (Exception ex) {
                throw ex;
            } 
        }

        public async Task<T> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Set<T>().FindAsync(id);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task UpdateAsync(T entity)
        {
            try
            {
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex) {
                throw ex;
            }
        }
    }
}
