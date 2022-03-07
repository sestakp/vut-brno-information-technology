using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tournament.API.DAL.Migrations
{
    public partial class OnDeleteTournamentVenueDeleteGames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.DropForeignKey(
                name: "FK_Games_TournamentVenues_TournamentVenueId",
                table: "Games");
            
            migrationBuilder.AddForeignKey(
                name: "FK_Games_TournamentVenues_TournamentVenueId",
                table: "Games",
                column: "TournamentVenueId",
                principalTable: "TournamentVenues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_TournamentVenues_TournamentVenueId",
                table: "Games");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_TournamentVenues_TournamentVenueId",
                table: "Games",
                column: "TournamentVenueId",
                principalTable: "TournamentVenues",
                principalColumn: "Id");
        }
    }
}
