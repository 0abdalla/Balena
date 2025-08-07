using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Balena.Interfaces.Common
{
    public interface IAppSettings
    {
        string[] URLList { get; set; }
        string ApiUrlLocal { get; set; }
        ConnectionStrings ConnectionStrings { get; set; }
        JWT Jwt { get; set; }
    }

    public class ConnectionStrings
    {
        public string DBConnection { get; set; }
    }

    public class JWT
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpiryMinutes { get; set; }
    }
}
