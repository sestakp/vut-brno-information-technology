using System;
using System.Windows;
using CookBook.BL.Services;
using FestivalAdministration.BL.Facades;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.DAL.Factories;
using FestivalAdministration.DAL.Interfaces;
using FestivalAdministration.DAL.Repositories;
using FestivalAdministration.DAL.UnitOfWork;
using FestivalAdministration.Factories;
using FestivalAdministration.Interfaces;
using FestivalAdministration.Interfaces.DetailViewModels;
using FestivalAdministration.Interfaces.ListViewModels;
using FestivalAdministration.Services;
using FestivalAdministration.Services.MessageDialog;
using FestivalAdministration.ViewModels;
using FestivalAdministration.ViewModels.DetailViewModels;
using FestivalAdministration.ViewModels.ListViewModels;
using FestivalAdministration.Views;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FestivalAdministration
{
    /// <summary>
    ///     Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private readonly IHost _host;

        public App()
        {
            _host = Host.CreateDefaultBuilder()
                .ConfigureAppConfiguration(ConfigureAppConfiguration)
                .ConfigureServices((context, services) => { ConfigureServices(context.Configuration, services); })
                .Build();
        }

        private static void ConfigureAppConfiguration(HostBuilderContext context, IConfigurationBuilder builder)
        {
            builder.AddJsonFile(@"AppSettings.json", false, true);
        }

        private static void ConfigureServices(IConfiguration configuration, IServiceCollection services)
        {
            services.AddSingleton<MainWindow>();

            services.AddSingleton<IBandFacade, BandFacade>();
            services.AddSingleton<IStageFacade, StageFacade>();
            services.AddSingleton<IEventFacade, EventFacade>();

            services.AddSingleton<IBandRepository, BandRepository>();
            services.AddSingleton<IStageRepository, StageRepository>();
            services.AddSingleton<IEventRepository, EventRepository>();

            services.AddSingleton<IMediator, Mediator>();
            services.AddSingleton<IMessageDialogService, MessageDialogService>();

            services.AddSingleton<MainViewModel>();
            services.AddSingleton<IBandListViewModel, BandListViewModel>();
            services.AddFactory<IBandDetailViewModel, BandDetailViewModel>();

            services.AddSingleton<IStageListViewModel, StageListViewModel>();
            services.AddFactory<IStageDetailViewModel, StageDetailViewModel>();

            services.AddSingleton<IEventListViewModel, EventListViewModel>();
            services.AddFactory<IEventDetailViewModel, EventDetailViewModel>();

            services.AddSingleton<IProgramViewModel, ProgramViewModel>();

            services.AddSingleton<IRepositoryAbstractFactory, RepositoryAbstractFactory>();
            services.AddSingleton<IUnitOfWork, UnitOfWork>();

            services.AddSingleton<IDbContextFactory>(
                provider => new SqlServerDbContextFactory(configuration.GetConnectionString("DefaultConnection")));
        }

        protected override async void OnStartup(StartupEventArgs e)
        {
            await _host.StartAsync();

            var dbContextFactory = _host.Services.GetRequiredService<IDbContextFactory>();
#if DEBUG
            await using (var dbx = dbContextFactory.CreateDbContext())
            {
                await dbx.Database.MigrateAsync();
                var result = dbx.Database.EnsureCreatedAsync();
            }
#endif


            var mainWindow = _host.Services.GetRequiredService<MainWindow>();
            mainWindow.Show();

            base.OnStartup(e);
        }

        protected override async void OnExit(ExitEventArgs e)
        {
            using (_host)
            {
                await _host.StopAsync(TimeSpan.FromSeconds(5));
            }

            base.OnExit(e);
        }
    }
}