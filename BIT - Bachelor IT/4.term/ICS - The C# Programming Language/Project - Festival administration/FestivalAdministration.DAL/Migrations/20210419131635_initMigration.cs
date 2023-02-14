using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FestivalAdministration.DAL.Migrations
{
    public partial class initMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Bands",
                table => new
                {
                    Id = table.Column<Guid>("uniqueidentifier", nullable: false),
                    Name = table.Column<string>("nvarchar(max)", nullable: true),
                    Genre = table.Column<string>("nvarchar(max)", nullable: true),
                    Country = table.Column<string>("nvarchar(max)", nullable: true),
                    LongDescription = table.Column<string>("nvarchar(max)", nullable: true),
                    ShortDescription = table.Column<string>("nvarchar(max)", nullable: true),
                    ImagePath = table.Column<string>("nvarchar(max)", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Bands", x => x.Id); });

            migrationBuilder.CreateTable(
                "Stages",
                table => new
                {
                    Id = table.Column<Guid>("uniqueidentifier", nullable: false),
                    Name = table.Column<string>("nvarchar(max)", nullable: true),
                    Description = table.Column<string>("nvarchar(max)", nullable: true),
                    ImagePath = table.Column<string>("nvarchar(max)", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Stages", x => x.Id); });

            migrationBuilder.CreateTable(
                "Events",
                table => new
                {
                    Id = table.Column<Guid>("uniqueidentifier", nullable: false),
                    Start = table.Column<DateTime>("datetime2", nullable: true),
                    End = table.Column<DateTime>("datetime2", nullable: true),
                    BandId = table.Column<Guid>("uniqueidentifier", nullable: false),
                    StageId = table.Column<Guid>("uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                    table.ForeignKey(
                        "FK_Events_Bands_BandId",
                        x => x.BandId,
                        "Bands",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_Events_Stages_StageId",
                        x => x.StageId,
                        "Stages",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_Events_BandId",
                "Events",
                "BandId");

            migrationBuilder.CreateIndex(
                "IX_Events_StageId",
                "Events",
                "StageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "Events");

            migrationBuilder.DropTable(
                "Bands");

            migrationBuilder.DropTable(
                "Stages");
        }
    }
}