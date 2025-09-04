using Microsoft.EntityFrameworkCore;

namespace MinimalAPI;

public interface ITemperatureRepository
{
    public void Write(TemperatureLog log);
}

public class TemperatureRepository : DbContext
{
    public TemperatureRepository(DbContextOptions<TemperatureRepository> options) : base(options) { }

    public DbSet<TemperatureLog> TemperatureLogs => Set<TemperatureLog>();
}
