using System.Collections.Concurrent;
using System.Collections.Generic;

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
    private ConcurrentDictionary<Particle, bool> Particles = new();
    private Random rnd = new Random();
    private readonly System.Timers.Timer timer;
    private readonly (float width, float height) cancasSize = (1200, 600);
    private readonly (float dx, float dy)[] negihborOffests =
    {
        (-1, 1), (0, 1), (1, 1),
        (-1, 0), (1, 0),
        (-1, -1), (0, -1), (1, -1),
    };

    public IEnumerable<Particle> GetParticles => Particles.Keys;

    public ParticleService()
    {
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

    public void AddParticles((float x, float y) center, int radius)
    {
        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dy = -radius; dy <= radius; dy++)
            {
                var dr = Math.Sqrt(Math.Pow(dx, 2) + Math.Pow(dy, 2));
                if (dr <= radius)
                {
                    Particles.TryAdd(new Particle(center.x + dx, center.y + dy), true);
                }
            }
        }
    }

    public void EraseParticles((float x, float y) center, int radius)
    {
        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dy = -radius; dy <= radius; dy++)
            {
                var dr = Math.Sqrt(Math.Pow(dx, 2) + Math.Pow(dy, 2));
                if (dr <= radius)
                {
                    Particles.TryRemove(new Particle(center.x + dx, center.y + dy), out _);
                }
            }
        }
    }

    private void Tick()
    {
        ConcurrentBag<Particle> newParticles = [];
        HashSet<Particle> checkedParticles = [];

        foreach (var particle in Particles.Keys)
        {
            checkedParticles.Add(particle);
            foreach (var offset in negihborOffests)
            {
                checkedParticles.Add(new Particle(particle.X + offset.dx, particle.Y + offset.dy));
            }
        }

        Parallel.ForEach(checkedParticles, particle =>
        {
            var wasAlive = Particles.ContainsKey(particle);
            var aliveNeighbors = FindAliveNeighbors(particle);
            var isAlive =
                (wasAlive && (aliveNeighbors == 2 || aliveNeighbors == 3))
                || (!wasAlive && aliveNeighbors == 3);
            if (isAlive)
            {
                newParticles.Add(particle);
            }
        });

        Particles = new ConcurrentDictionary<Particle, bool>(
            newParticles.Distinct().Select(p => new KeyValuePair<Particle, bool>(p, true))
        );
    }

    private int FindAliveNeighbors(Particle particle)
    {
        int neighbors = 0;
        var neighbor = new Particle(particle.X, particle.Y);

        foreach (var offset in negihborOffests)
        {
            neighbor = new Particle(particle.X + offset.dx, particle.Y + offset.dy);
            if (Particles.ContainsKey(neighbor))
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
