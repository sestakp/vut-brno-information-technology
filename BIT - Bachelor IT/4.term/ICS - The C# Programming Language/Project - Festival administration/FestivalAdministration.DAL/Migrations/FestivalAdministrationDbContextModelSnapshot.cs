﻿// <auto-generated />

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FestivalAdministration.DAL.Migrations
{
    [DbContext(typeof(FestivalAdministrationDbContext))]
    internal class FestivalAdministrationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.BandEntity", b =>
            {
                b.Property<Guid>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("uniqueidentifier");

                b.Property<string>("Country")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Genre")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("ImagePath")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("LongDescription")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Name")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("ShortDescription")
                    .HasColumnType("nvarchar(max)");

                b.HasKey("Id");

                b.ToTable("Bands");
            });

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.EventEntity", b =>
            {
                b.Property<Guid>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("uniqueidentifier");

                b.Property<Guid>("BandId")
                    .HasColumnType("uniqueidentifier");

                b.Property<DateTime?>("End")
                    .HasColumnType("datetime2");

                b.Property<Guid>("StageId")
                    .HasColumnType("uniqueidentifier");

                b.Property<DateTime?>("Start")
                    .HasColumnType("datetime2");

                b.HasKey("Id");

                b.HasIndex("BandId");

                b.HasIndex("StageId");

                b.ToTable("Events");
            });

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.StageEntity", b =>
            {
                b.Property<Guid>("Id")
                    .ValueGeneratedOnAdd()
                    .HasColumnType("uniqueidentifier");

                b.Property<string>("Description")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("ImagePath")
                    .HasColumnType("nvarchar(max)");

                b.Property<string>("Name")
                    .HasColumnType("nvarchar(max)");

                b.HasKey("Id");

                b.ToTable("Stages");
            });

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.EventEntity", b =>
            {
                b.HasOne("FestivalAdministration.DAL.Entities.BandEntity", "Band")
                    .WithMany("Events")
                    .HasForeignKey("BandId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.HasOne("FestivalAdministration.DAL.Entities.StageEntity", "Stage")
                    .WithMany("Events")
                    .HasForeignKey("StageId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.Navigation("Band");

                b.Navigation("Stage");
            });

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.BandEntity", b => { b.Navigation("Events"); });

            modelBuilder.Entity("FestivalAdministration.DAL.Entities.StageEntity", b => { b.Navigation("Events"); });
#pragma warning restore 612, 618
        }
    }
}