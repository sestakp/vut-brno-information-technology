using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;

namespace FestivalAdministration.Interfaces
{
    public interface IProgramViewModel
    {
        ICommand UpdateTable { get; set; }
    }
}
