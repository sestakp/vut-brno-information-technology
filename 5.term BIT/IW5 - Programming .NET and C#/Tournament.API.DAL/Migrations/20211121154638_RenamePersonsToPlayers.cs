using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tournament.API.DAL.Migrations
{
    public partial class RenamePersonsToPlayers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.RenameTable(name: "Persons", newName: "Players");
          
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.RenameTable(name: "Players", newName: "Persons");

        }
    }
}
