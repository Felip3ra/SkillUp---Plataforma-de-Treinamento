using Microsoft.EntityFrameworkCore;
using ProjetoSkillUp.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoSkillUp.Infrastructure.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Users> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Quiz_Questions> QuizQuestions { get; set; }
        public DbSet<Quiz_Options> QuizOptions { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Module_Progress> ModuleProgress { get; set; }
        public DbSet<Quiz_Attempts> QuizAttempts { get; set; }
        public DbSet<Certificates> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 📌 Configurar o ENUM: Role
            modelBuilder
                .Entity<Users>()
                .Property(u => u.Role)
                .HasConversion<int>();

            modelBuilder.Entity<Course>()
                .HasOne(c => c.CreatedBy)
                .WithMany(u => u.CoursesCreated)
                .HasForeignKey(c => c.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Course>()
                .Property(c => c.Level)
                .HasConversion<int>();


            // 🧩 USUÁRIO → MATRÍCULAS
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.User)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Certificate)
                .WithOne(c => c.Enrollment)
                .HasForeignKey<Certificates>(c => c.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);


            // MODULE → COURSE (1:N)
            modelBuilder.Entity<Module>()
                .HasOne(m => m.Course)
                .WithMany(c => c.Modules)
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // MODULE → QUIZ (1:1 opcional)
            modelBuilder.Entity<Module>()
                .HasOne(m => m.Quiz)
                .WithOne(q => q.Module)
                .HasForeignKey<Quiz>(q => q.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            // MODULE → MODULE PROGRESS (1:N)
            modelBuilder.Entity<Module>()
                .HasMany(m => m.ModuleProgress)
                .WithOne(mp => mp.Module)
                .HasForeignKey(mp => mp.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            // ENUM
            modelBuilder.Entity<Module>()
                .Property(m => m.Type)
                .HasConversion<int>();


            modelBuilder.Entity<Module_Progress>()
                .HasOne(mp => mp.Enrollment)
                .WithMany(e => e.ModuleProgress)
                .HasForeignKey(mp => mp.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Module_Progress>()
                .HasOne(mp => mp.Module)
                .WithMany(m => m.ModuleProgress)
                .HasForeignKey(mp => mp.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Quiz>()
                .HasOne(q => q.Module)
                .WithOne(m => m.Quiz)
                .HasForeignKey<Quiz>(q => q.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Quiz_Questions>()
                .HasOne(qq => qq.Quiz)
                .WithMany(q => q.Questions)
                .HasForeignKey(qq => qq.QuizId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Quiz_Options>()
                .HasOne(qo => qo.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(qo => qo.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Quiz_Attempts>()
                .HasOne(qa => qa.Quiz)
                .WithMany(q => q.Attempts)
                .HasForeignKey(qa => qa.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Quiz_Attempts>()
                .HasOne(qa => qa.User)
                .WithMany(u => u.QuizAttempts)
                .HasForeignKey(qa => qa.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            //// 🧩 CERTIFICADOS → USUÁRIO
            //modelBuilder.Entity<Certificates>()
            //    .HasOne(c => c.User)
            //    .WithMany(u => u.Certificates)
            //    .HasForeignKey(c => c.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Certificates>()
                .HasOne(c => c.Enrollment)
                .WithOne(e => e.Certificate)
                .HasForeignKey<Certificates>(c => c.EnrollmentId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
    
}
