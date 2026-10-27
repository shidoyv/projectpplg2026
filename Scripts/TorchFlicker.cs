using UnityEngine;

public class TorchFlicker : MonoBehaviour
{
    [Header("Pengaturan Api Obor")]
    public float baseIntensity = 1.8f;
    public float flickerSpeed = 12.0f;
    public float flickerAmount = 0.4f;

    private Light _light;
    private float _randomOffset;

    private void Awake()
    {
        _light = GetComponent<Light>();
        _randomOffset = Random.Range(0f, 100f);
    }

    private void Update()
    {
        if (_light == null) return;
        float noise = Mathf.PerlinNoise((Time.time + _randomOffset) * flickerSpeed, 0f);
        _light.intensity = Mathf.Max(0.5f, baseIntensity + (noise - 0.5f) * flickerAmount);
    }
}
