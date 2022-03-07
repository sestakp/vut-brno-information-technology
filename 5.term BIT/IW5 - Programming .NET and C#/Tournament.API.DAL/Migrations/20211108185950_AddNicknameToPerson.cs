using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tournament.API.DAL.Migrations
{
    public partial class AddNicknameToPerson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Persons",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Persons");
        }
    }
}
