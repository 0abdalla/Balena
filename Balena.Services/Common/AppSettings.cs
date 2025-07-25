using Balena.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Services.Common
{
    public class AppSettings : IAppSettings
    {
        public string[] URLList { get; set; }
        public ConnectionStrings ConnectionStrings { get; set; }
        public JWT Jwt { get; set; }
    }
}
