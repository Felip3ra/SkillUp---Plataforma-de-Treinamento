using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjetoSkillUp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CorrecaoCampoDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Quizzes",
                newName: "Created_at");

            migrationBuilder.RenameColumn(
                name: "Created_At",
                table: "QuizAttempts",
                newName: "Created_at");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created_at",
                table: "QuizAttempts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created_at",
                table: "Modules",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Created_at",
                table: "Courses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Created_at",
                table: "Modules");

            migrationBuilder.DropColumn(
                name: "Created_at",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "Quizzes",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Created_at",
                table: "QuizAttempts",
                newName: "Created_At");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Created_At",
                table: "QuizAttempts",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Modules",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Courses",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
