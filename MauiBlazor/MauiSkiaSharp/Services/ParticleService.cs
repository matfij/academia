
namespace MauiSkiaSharp.Services;

public struct Particle
{
    public Particle(float x, float y, float r = 10)
    {
        X = x;
        Y = y;
        R = r;
    }

    public float X { get; set; }
    public float Y { get; set; }
    public float R { get; set; }
}

public class ParticleService
{
    private List<Particle> Particles = new();

    public ParticleService()
    {
        Particles.Add(new Particle(10, 50));
        Particles.Add(new Particle(100, 10));
        Particles.Add(new Particle(250, 150, 25));
    }

    public IEnumerable<Particle> GetParticles => Particles;
}