using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.API.DAL.Entities
{
    public class SelectEntity
    {
        public Guid Id { get; set; }
        public string? SelectText { get; set; }
    }
}
