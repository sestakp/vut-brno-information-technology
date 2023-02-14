using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.Common.Interfaces
{
    public interface IInstaller
    {
        void Install(IServiceCollection serviceCollection);
    }
    public interface IDALInstaller
    {
        void Install(IServiceCollection serviceCollection, string constring);
    }
}
