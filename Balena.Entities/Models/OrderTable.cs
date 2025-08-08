using Balena.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Entities.Models
{
    public class OrderTable : AuditableEntity
    {
        [Key]
        public int TableId { get; set; }
        public string TableNumber { get; set; }
        public bool IsActive { get; set; }
    }
}
