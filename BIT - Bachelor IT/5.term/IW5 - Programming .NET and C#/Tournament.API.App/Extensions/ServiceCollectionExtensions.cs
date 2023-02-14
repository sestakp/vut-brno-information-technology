using Microsoft.Extensions.DependencyInjection;
using Tournament.API.Common.Interfaces;

namespace Tournament.API.App.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddDalInstaller<TInstaller>(this IServiceCollection serviceCollection, string connectionString)
            where TInstaller : IDALInstaller, new()
        {
            var installer = new TInstaller();
            installer.Install(serviceCollection, connectionString);
        }

        public static void AddInstaller<TInstaller>(this IServiceCollection serviceCollection)
            where TInstaller : IInstaller, new()
        {
            var installer = new TInstaller();
            installer.Install(serviceCollection);
        }
    }
}
