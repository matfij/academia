using UnityEngine;

public class ParticleManager : MonoBehaviour
{
    public GameObject particlePrefab;
    public int spawnCount = 16;

    void Uodate()
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
            var particle = Instantiate(particlePrefab, position, Quaternion.identity);
            var particleScript = particle.GetComponent<Particle>();
            particleScript.velocity = new Vector2(Random.Range(-1f, 1f), Random.Range(1f, 3f));
            particleScript.color = new Color(0.76f, 0.7f, 0.5f);
        }
    }
}
