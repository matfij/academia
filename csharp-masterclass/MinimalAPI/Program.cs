using Microsoft.EntityFrameworkCore;
using MinimalAPI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TemperatureRepository>(options => options.UseSqlite("Data Source=greenhouse-logs.db"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TemperatureRepository>();
    db.Database.EnsureCreated();
}

app.MapGet("/", () => "OK");

app.MapPost("/temperatureLogs", async (TemperatureLog log, TemperatureRepository repository) =>
    {
        repository.TemperatureLogs.Add(log);
        await repository.SaveChangesAsync();
        return Results.Created($"/temperatureLogs/{log.Id}", log);
    });

app.MapGet("/temperatureLogs", async (TemperatureRepository repository) =>
    await repository.TemperatureLogs.ToListAsync());

app.Run();
