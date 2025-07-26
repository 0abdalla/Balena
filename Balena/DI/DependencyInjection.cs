using Balena.Entities.Auth;
using Balena.Entities.Models;
using Balena.Interfaces.Auth;
using Balena.Interfaces.Common;
using Balena.Interfaces.Repositories;
using Balena.Services.Auth;
using Balena.Services.Common;
using Balena.Services.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Balena.DI
{
    public static class DependencyInjection
    {
        private const string MyAllowSpecificOrigins = "_BalenaAdmin";
        public static IServiceCollection AddDependencies(this IServiceCollection services, IConfiguration configuration)
        {

            services.Configure<AppSettings>(configuration);
            services.AddSingleton<IAppSettings>(sp => sp.GetRequiredService<IOptions<AppSettings>>().Value);
            services.AddDbContext<BADbContext>((serviceProvider, options) =>
            {
                var appSettings = serviceProvider.GetRequiredService<IAppSettings>();
                options.UseSqlServer(appSettings.ConnectionStrings.DBConnection);
            });

            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins, builder =>
                {
                    var appSettings = services.BuildServiceProvider().GetRequiredService<IAppSettings>();
                    builder.WithOrigins(appSettings.URLList)
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            }).AddNewtonsoftJson();
            services.AddAuthConfig(configuration);

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ISQLHelper, SQLHelper>();
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }

        private static IServiceCollection AddAuthConfig(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IJwtProvider, JwtProvider>();

            services.AddIdentity<AdminUser, IdentityRole>()
                .AddEntityFrameworkStores<BADbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var serviceProvider = services.BuildServiceProvider();
                var appSettings = serviceProvider.GetRequiredService<IAppSettings>();
                var jwt = appSettings.Jwt;

                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                    ValidIssuer = jwt.Issuer,
                    ValidAudience = jwt.Audience
                };
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequiredLength = 8;
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+/ ";
                options.User.RequireUniqueEmail = true;
            });

            return services;
        }

        public static string GetCorsPolicyName() => MyAllowSpecificOrigins;
    }
}
