using System.Timers;

namespace MauiSkiaSharp.Services;

public struct Particle(float x, float y, bool alive = false)
{
    public float X { get; set; } = x;
    public float Y { get; set; } = y;
    public bool IsAlive { get; set; } = alive;
}

public class ParticleService : IDisposable
{
    private List<Particle> Particles = [];
    private Random rnd = new Random();
    private readonly System.Timers.Timer timer;

    public IEnumerable<Particle> GetParticles => Particles;

    public ParticleService()
    {
        for (int x = 0; x < 100; x++)
        {
            for (int y = 0; y < 60; y++)
            {
                var isAlive = rnd.Next(0, 100) > 80;
                Particles.Add(new Particle(x, y, isAlive));
            }
        }
        timer = new(1000);
        timer.Elapsed += (sender, args) => Tick();
        timer.Start();
    }

    public void AddParticle(Particle particle)
    {
        throw new NotImplementedException();
    }

    public void Tick()
    {
        lock (Particles)
        {
            List<Particle> newParticles = [];

            for (int x = 0; x < 100; x++)
            {
                for (int y = 0; y < 60; y++)
                {
                    var aliveNeighbors = 0;

                    if (Particles.Find(p => p.X == x - 1 && p.Y == y - 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x && p.Y == y - 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x - 1 && p.Y == y).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x + 1 && p.Y == y).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x + 1 && p.Y == y + 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x && p.Y == y + 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x - 1 && p.Y == y + 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }
                    if (Particles.Find(p => p.X == x + 1 && p.Y == y - 1).IsAlive == true)
                    {
                        aliveNeighbors += 1;
                    }

                    var oldParticle = Particles.Find(p => p.X == x && p.Y == y);
                    var isAlive =
                        (oldParticle.IsAlive && (aliveNeighbors == 2 || aliveNeighbors == 3))
                        || (!oldParticle.IsAlive && aliveNeighbors == 3);
                    newParticles.Add(new Particle(x, y, isAlive));
                }
            }

            Particles = newParticles;
        }
    }

    public void Dispose()
    {
        timer.Stop();
        timer.Dispose();
    }
}
