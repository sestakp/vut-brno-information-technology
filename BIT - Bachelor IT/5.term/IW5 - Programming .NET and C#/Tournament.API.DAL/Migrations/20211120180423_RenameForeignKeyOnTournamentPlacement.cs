using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tournament.API.DAL.Migrations
{
    public partial class RenameTournamentPlacementToTournamentVenue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(name: "TournamentPlaces", newName: "TournamentVenues");
            migrationBuilder.RenameColumn("TournamentPlacementId", "Games", "TournamentVenuesId");
       
            migrationBuilder.RenameIndex(
                name: "IX_Games_TournamentPlacementId",
                table: "Games",
                newName: "IX_Games_TournamentVenueId");

            migrationBuilder.AlterColumn<string>(
                name: "Surname",
                table: "Persons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Persons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(name: "TournamentVenues", newName:"TournamentPlaces");
            migrationBuilder.RenameColumn("TournamentVenuesId", "Games", "TournamentPlacementId");


            migrationBuilder.RenameIndex(
                name: "IX_Games_TournamentVenueId",
                table: "Games",
                newName: "IX_Games_TournamentPlacementId");

            migrationBuilder.AlterColumn<string>(
                name: "Surname",
                table: "Persons",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Persons",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

        }
    }
}
