using System;
using System.Collections.Generic;
using System.Text;
using FestivalAdministration.Common;

namespace FestivalAdministration.Controls.Models
{
    public class ProgramDataGridModel : IId
    {
        public string Date { get; set; }
        public string[] cells { get; set; } = new string[24];
        public Guid Id { get; set; }
    }
}
