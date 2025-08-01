using Balena.DI;
using Balena.Interfaces.Repositories;
using Balena.Services.Common;
using Balena.Services.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppPaths>(options =>
{
    var env = builder.Environment;
    options.WebRootPath = env.WebRootPath;
});
builder.Services.AddDependencies(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(DependencyInjection.GetCorsPolicyName());
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();
app.Run();
