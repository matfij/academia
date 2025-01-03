using System.Collections.Generic;
using UnityEngine;

public class ParticleManager : MonoBehaviour
{
    public GameObject particlePrefab;
    public int spawnCount = 16;
    private List<Particle> activeParticles = new ();

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            var spawnPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            spawnPosition.z = 0;
            SpawnParticles(spawnPosition);
        }
    }

    void SpawnParticles(Vector3 position)
    {
        for (int i = 0; i < spawnCount; i++)
        {
            var particleObject = Instantiate(particlePrefab, position, Quaternion.identity);
            var particle = particleObject.GetComponent<Particle>();
            particle.velocity = new Vector2(Random.Range(-1f, 1f), Random.Range(1f, 3f));
            particle.color = new Color(0.76f, 0.7f, 0.5f);
            activeParticles.Add(particle);
        }
    }

    public void RemoveParticle(Particle particle)
    {
        activeParticles.Remove(particle);
        Destroy(particle.gameObject);
    }

    public List<Particle> particles => activeParticles;
}
