using UnityEngine;

public class Particle : MonoBehaviour
{
    public Vector2 velocity;
    public Color color;
    private SpriteRenderer spriteRenderer;

    void Start()
    {
        spriteRenderer = gameObject.AddComponent<SpriteRenderer>();
        spriteRenderer.sprite = CreateCircleSprite();
        spriteRenderer.color = color;
        transform.localScale = Vector3.one;
    }

    void Update()
    {
        transform.position += (Vector3)velocity * Time.deltaTime;
        velocity.y -= 9.81f * Time.deltaTime;

        if (transform.position.y < 5f)
        {
            transform.position = new Vector3(transform.position.x, -5f, 0);
            velocity = Vector2.zero;
        }
    }

    private Sprite CreateCircleSprite()
    {
        var texture = new Texture2D(16, 16);
        for (int x = 0; x < 16; x++)
        {
            for (int y = 0; y < 16; y++)
            {
                var distance = Vector2.Distance(new Vector2(x, y), new Vector2(8, 8));
                texture.SetPixel(x, y, distance < 8 ? Color.white : Color.clear);
            }
        }
        texture.Apply();
        return Sprite.Create(texture, new Rect(0, 0, 16, 16), new Vector2(0.5f, 0.5f));
    }

}
