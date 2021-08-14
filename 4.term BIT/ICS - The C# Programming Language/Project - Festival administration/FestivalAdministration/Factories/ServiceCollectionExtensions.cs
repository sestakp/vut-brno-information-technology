using System;
using FestivalAdministration.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace FestivalAdministration.Factories
{
    public static class ServiceCollectionExtensions
    {
        public static void AddFactory<TService, TImplementation>(this IServiceCollection services)
            where TService : class
            where TImplementation : class, TService
        {
            services.AddTransient<TService, TImplementation>();

            services.AddSingleton<Func<TService>>(x => x.GetService<TService>);

            services.AddSingleton<IFactory<TService>, Factory<TService>>();
        }
    }
}