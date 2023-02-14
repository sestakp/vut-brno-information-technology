using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tournament.API.DAL.Migrations
{
    public partial class RenameTournamentVenuesIdToTournamentVenueId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.RenameColumn("TournamentVenuesId", "Games", "TournamentVenueId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn("TournamentVenueId", "Games", "TournamentVenuesId");
        }
    }
}
