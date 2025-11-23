using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoSkillUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrollmentDateToEnrollment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EnrollmentDate",
                table: "Enrollments",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnrollmentDate",
                table: "Enrollments");
        }
    }
}
