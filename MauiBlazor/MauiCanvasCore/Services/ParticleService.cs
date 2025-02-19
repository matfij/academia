namespace MauiCanvasCore.Services;

public struct Particle(int x, int y)
{
    public int X { get; set; } = x;
    public int Y { get; set; } = y;


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
    private HashSet<Particle> Particles = [];
    private bool ParticlesLock = false;
    private readonly System.Timers.Timer LoopTimer = new(100);
    private readonly (int dx, int dy)[] NeighborOffsets =
    {
        (-1, 1), (0, 1), (1, 1),
        (-1, 0), (1, 0),
        (-1, -1), (0, -1), (1, -1),
    };

    public IEnumerable<Particle> GetParticles => Particles;

    public ParticleService()
    {
        LoopTimer.Elapsed += (sender, args) => Tick();
    }

    public void Start()
    {
        LoopTimer.Start();
    }

    public void Stop()
    {
        LoopTimer.Stop();
    }

    public void AddParticles((int x, int y) center, int radius)
    {
        if (ParticlesLock)
        {
            return;
        }
        ParticlesLock = true;

        int radiusSquare = radius * radius;
        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dy = -radius; dy <= radius; dy++)
            {
                if (dx * dx + dy * dy <= radiusSquare)
                {
                    Particles.Add(new Particle(center.x + dx, center.y + dy));
                }
            }
        }

        ParticlesLock = false;
    }

    public void EraseParticles((int x, int y) center, int radius)
    {
        if (ParticlesLock)
        {
            return;
        }
        ParticlesLock = true;


        int radiusSquare = radius * radius;
        for (int dx = -radius; dx < radius; dx++)
        {
            for (int dy = -radius; dy < radius; dy++)
            {
                if (dx * dx + dy * dy <= radiusSquare)
                {
                    Particles.Remove(new Particle(center.x + dx, center.y + dy));
                }
            }
        }

        ParticlesLock = false;
    }

    private void Tick()
    {
        if (ParticlesLock)
        {
            return;
        }
        ParticlesLock = true;

        HashSet<Particle> newParticles = [];
        HashSet<Particle> checkedParticles = [];

        foreach (var particle in Particles)
        {
            checkedParticles.Add(particle);
            foreach (var (dx, dy) in NeighborOffsets)
            {
                checkedParticles.Add(new Particle(particle.X + dx, particle.Y + dy));
            }
        }

        foreach (var particle in checkedParticles)
        {
            var wasAlive = Particles.Contains(particle);
            var aliveNeighbors = FindAliveNeighbors(particle);
            var isAlive = (wasAlive && (aliveNeighbors == 2 || aliveNeighbors == 3)) || (!wasAlive && aliveNeighbors == 3);
            if (isAlive)
            {
                newParticles.Add(particle);
            }
        }

        Particles = newParticles;

        ParticlesLock = false;
    }

    private int FindAliveNeighbors(Particle particle)
    {
        int neighbors = 0;
        var neighbor = new Particle(particle.X, particle.Y);

        foreach (var offset in NeighborOffsets)
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
        LoopTimer.Stop();
        LoopTimer.Dispose();
        Particles.Clear();
    }
}
