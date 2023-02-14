using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.API.Common.Interfaces;
using Tournament.API.BL.Facades.Interfaces;

namespace Tournament.API.BL.Installers
{
    public class BlInstaller : IInstaller
    {
        public void Install(IServiceCollection serviceCollection)
        {
            serviceCollection.Scan(s =>
       s.FromAssemblyOf<BlInstaller>()


       .AddClasses(classes => classes.AssignableTo(typeof(IFacadeBase)))
       .AsSelfWithInterfaces()
       .WithScopedLifetime()
   );
        }
    }
}
