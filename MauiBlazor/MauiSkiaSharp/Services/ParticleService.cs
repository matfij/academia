namespace MauiSkiaSharp.Services;

public struct Particle(float x, float y, bool alive = false)
{
    public float X { get; set; } = x;
    public float Y { get; set; } = y;
    public bool Alive { get; set; } = alive;
}

public class ParticleService
{
    private List<Particle> Particles = [];
    private Random rnd = new Random();

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

    }

    public void AddParticle(Particle particle)
    {
        //for (int x = 0; x < 100; x++)
        //{
        //    for (int y = 0; y < 60; y++)
        //    {
        //        Particles.Add(new Particle(x, y, false));
        //    }
        //}
    }

    public IEnumerable<Particle> GetParticles => Particles;

    public void Tick()
    {
        List<Particle> newParticles = [];

        for (int x = 0; x < 100; x++)
        {
            for (int y = 0; y < 60; y++)
            {
                var aliveNeighbors = 0;

                if (Particles.Find(p => p.X == x - 1 && p.Y == y - 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x && p.Y == y - 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x - 1 && p.Y == y).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x + 1 && p.Y == y).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x + 1 && p.Y == y + 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x && p.Y == y + 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x - 1 && p.Y == y + 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }
                if (Particles.Find(p => p.X == x + 1 && p.Y == y - 1).Alive == true)
                {
                    aliveNeighbors += 1;
                }

                var oldParticle = Particles.Find(p => p.X == x && p.Y == y);
                var isAlive =
                    (oldParticle.Alive && (aliveNeighbors == 2 || aliveNeighbors == 3))
                    || (!oldParticle.Alive && aliveNeighbors == 3);
                newParticles.Add(new Particle(x, y, isAlive));
            }
        }

        Particles = newParticles;
    }
}
