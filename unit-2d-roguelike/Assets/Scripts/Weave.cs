using Unity.Mathematics;
using UnityEngine;

public class Wave : MonoBehaviour
{
    public float amplitude = 1f;
    public float frequency = 1f;
    public float height = 0.5f;
    private float phase = 0f;

    private void Update()
    {
        phase = frequency * Time.deltaTime;

        var particleManager = FindAnyObjectByType<ParticleManager>();
        var particles = particleManager.particles;

        foreach (var particle in particles.ToArray())
        {
            var waveY = Mathf.Sin(particle.transform.position.x + phase) * amplitude;
            if (particle.transform.position.y < waveY + height / 2 && particle.transform.position.y > waveY - height / 2)
            {
                particleManager.RemoveParticle(particle);
            }
        }
    }

    private void OnDrawGizmos()
    {
        Gizmos.color = Color.blue;

        for (float x = -10; x <= 10; x += 0.1f)
        {
            var y = Mathf.Sin(x + phase) * amplitude;
            var start = new Vector3(x, y - height / 2, 0);
            var end = new Vector3(x, y + height / 2, 0);
            Gizmos.DrawLine(start, end);
        }
    }

}