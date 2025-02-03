
namespace MauiSkiaSharp.Services;

public struct Particle(float x, float y, float r = 10)
{
    public float X { get; set; } = x;
    public float Y { get; set; } = y;
    public float R { get; set; } = r;
}

public class ParticleService
{
    private readonly List<Particle> Particles = [];

    public ParticleService()
    {
        Particles.Add(new Particle(10, 50));
        Particles.Add(new Particle(100, 10));
        Particles.Add(new Particle(250, 150, 25));
    }

    public void AddParticle(Particle particle)
    {
        Particles.Add(particle);
    }

    public IEnumerable<Particle> GetParticles => Particles;
}