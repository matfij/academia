using System.Collections.Concurrent;

namespace MauiCanvasCore.Services;

public struct Particle(float x, float y)
{
    public float X { get; set; } = x;
    public float Y { get; set; } = y;


    public override bool Equals(object? obj)
    {
        return obj is Particle p && p.X == X && p.Y == Y;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(X, Y);
    }
}

public class ParticleService : IDisposable
{
    private HashSet<Particle> Particles = new HashSet<Particle>();
    private Random rnd = new Random();
    private readonly System.Timers.Timer timer;
    private readonly (float width, float height) cancasSize = (1200, 600);
    private readonly (float dx, float dy)[] negihborOffests =
    {
        (-1, 1), (0, 1), (1, 1),
        (-1, 0), (1, 0),
        (-1, -1), (0, -1), (1, -1),
    };

    public IEnumerable<Particle> GetParticles => Particles;

    public ParticleService()
    {
        for (int x = 0; x < cancasSize.width; x++)
        {
            for (int y = 0; y < cancasSize.height; y++)
            {
                if (rnd.Next(0, 100) > 90)
                {
                    Particles.Add(new Particle(x, y));
                }
            }
        }
        timer = new(100);
        timer.Elapsed += (sender, args) => Tick();
    }

    public void Start()
    {
        timer.Start();
    }

    public void Stop()
    {
        timer.Stop();
    }

    public void AddParticle(Particle particle)
    {
        lock (Particles)
        {
            Particles.Add(particle);
        }
    }

    private void Tick()
    {
        lock (Particles)
        {
            ConcurrentBag<Particle> newParticles = [];
            ConcurrentBag<Particle> checkedParticles = [];

            foreach (var particle in Particles)
            {
                checkedParticles.Add(particle);
                foreach (var offset in negihborOffests)
                {
                    checkedParticles.Add(new Particle(particle.X + offset.dx, particle.Y + offset.dy));
                }

            }

            Parallel.ForEach(checkedParticles, particle =>
            {
                var wasAlive = Particles.Contains(particle);
                var aliveNeighbors = FindAliveNeighbors(particle);
                var isAlive =
                    (wasAlive && (aliveNeighbors == 2 || aliveNeighbors == 3))
                    || (!wasAlive && aliveNeighbors == 3);
                if (isAlive)
                {
                    newParticles.Add(particle);
                }
            });

            Particles = newParticles.ToHashSet();
        }
    }

    private int FindAliveNeighbors(Particle particle)
    {
        int neighbors = 0;
        var neighbor = new Particle(particle.X, particle.Y);

        foreach (var offset in negihborOffests)
        {
            neighbor = new Particle(particle.X + offset.dx, particle.Y + offset.dy);
            if (Particles.Contains(neighbor))
            {
                neighbors++;
                if (neighbors > 3)
                {
                    break;
                }
            }
        }

        return neighbors;
    }

    public void Dispose()
    {
        timer.Stop();
        timer.Dispose();
    }
}
