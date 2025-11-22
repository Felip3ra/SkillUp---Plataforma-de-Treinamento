using BCrypt.Net;
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
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {

            _context = context;
        }

        public bool RegisterUser(Users user)
        {
            try
            {
                string hash = BCrypt.Net.BCrypt.HashPassword(user.Password_hash);
                user.Password_hash = hash;
                _context.Users.Add(user);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex) {
                throw ex;
            }   
        }

       public Users? VerifyLoginAndPassword(string email, string senha)
{
    try
    {
        // Busca por email (correto)
        var user = _context.Users.FirstOrDefault(x => x.Name == email);

        // Se não encontrou, retorna null
        if (user == null)
        {
            return null;
        }

        // Verifica a senha com BCrypt
        bool passwordOk = BCrypt.Net.BCrypt.Verify(senha, user.Password_hash);

        if (!passwordOk)
        {
            return null;
        }

        // Tudo certo → retorna o usuário
        return user;
    }
    catch
    {
        // mantém stack trace
        throw;
    }
}

    }
}
