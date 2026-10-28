using UnityEngine;

public class FlashlightController : MonoBehaviour
{
    [Header("Komponen Lampu")]
    [SerializeField] private Light _flashlight;
    [SerializeField] private Light _fillLight;

    [Header("Pengaturan Senter")]
    [SerializeField] private bool _isOn = true;
    [SerializeField] private float _range = 56.0f;
    [SerializeField] private float _spotAngle = 74.0f;
    [SerializeField] private float _innerSpotAngle = 38.0f;
    [SerializeField] private float _normalIntensity = 32.0f;

    public Light flashlight { get => _flashlight; set => _flashlight = value; }
    public Light fillLight { get => _fillLight; set => _fillLight = value; }
    public bool isOn { get => _isOn; set => _isOn = value; }
    public float range { get => _range; set => _range = value; }
    public float spotAngle { get => _spotAngle; set => _spotAngle = value; }
    public float innerSpotAngle { get => _innerSpotAngle; set => _innerSpotAngle = value; }
    public float normalIntensity { get => _normalIntensity; set => _normalIntensity = value; }
    public bool enforcePitchBlackAtRuntime { get => false; set { } }

    private void Awake()
    {
        SetupLights();
    }

    private void Start()
    {
        SetupLights();
        ApplyHorrorAtmosphere();
    }

    private void SetupLights()
    {
        bool isURP = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline != null;
        float mainInt = 32.0f;
        float fillInt = 0.0f;

        // 1. Spotlight Utama Jarak Jauh (300 Meter, Sangat Lebar 95 Derajat)
        if (_flashlight == null) _flashlight = GetComponent<Light>();
        if (_flashlight == null) _flashlight = GetComponentInChildren<Light>();
        if (_flashlight != null)
        {
            _flashlight.type = LightType.Spot;
            _flashlight.range = _range;
            _flashlight.spotAngle = _spotAngle;
            _flashlight.innerSpotAngle = _innerSpotAngle;
            _flashlight.color = new Color(1.0f, 0.98f, 0.92f);
            _flashlight.intensity = mainInt;
            _flashlight.shadows = LightShadows.Soft;
            _flashlight.enabled = _isOn;
        }

        // 2. Fill / Omni Light di Sekitar Pemain (Radius 150 Meter 360 Derajat - Terang Benderang)
        Transform fillT1 = transform.Find("Flashlight_Fill_Light");
        if (fillT1 != null) Destroy(fillT1.gameObject);
        Transform fillT2 = transform.Find("Flashlight_Fill");
        if (fillT2 != null) Destroy(fillT2.gameObject);
    }

    private void Update()
    {
        // Toggle Senter dengan tombol [F]
        if (Input.GetKeyDown(KeyCode.F))
        {
            ToggleFlashlight();
        }
    }

    public void ToggleFlashlight()
    {
        _isOn = !_isOn;
        if (_flashlight != null) _flashlight.enabled = _isOn;
        if (_fillLight != null) _fillLight.enabled = false;

        // Feedback bunyi klik senter
        AudioSource.PlayClipAtPoint(CreateFlashlightClick(), transform.position, 0.5f);
    }

    public static void ApplyHorrorAtmosphere()
    {
        // 1. Kamera: Solid Color Pitch Black (Langit 100% Gelap Pekat, Senter Tidak Menembus/Menerangi Langit)
        Camera cam = Camera.main;
        if (cam != null)
        {
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Color.black;
        }

        // 2. Skybox dinonaktifkan / disetel hitam pekat
        RenderSettings.skybox = null;

        // 3. Ambient Light Gelap Gulita Malam Horor (Hanya senter yang menerangi objek)
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.012f, 0.012f, 0.018f);     // Langit malam gelap pekat
        RenderSettings.ambientEquatorColor = new Color(0.008f, 0.008f, 0.012f); // Horison gelap
        RenderSettings.ambientGroundColor = new Color(0.004f, 0.004f, 0.006f);  // Tanah gelap
        RenderSettings.ambientIntensity = 0.15f;
        RenderSettings.reflectionIntensity = 0.05f;
        DynamicGI.UpdateEnvironment();

        // 4. Kabut Hitam Pekat Realistis (Jarak Pandang Terbatas ~25 Meter)
        RenderSettings.fog = true;
        RenderSettings.fogMode = FogMode.Exponential;
        RenderSettings.fogDensity = 0.012f;
        RenderSettings.fogColor = Color.black;

        // 5. Directional Light Redup Pekat (Tidak menyinari langit/tanah, hanya siluet samar)
        GameObject dirLightObj = GameObject.Find("Directional Light");
        if (dirLightObj == null)
        {
            foreach (var l in Object.FindObjectsByType<Light>(FindObjectsInactive.Include))
            {
                if (l != null && l.type == LightType.Directional)
                {
                    dirLightObj = l.gameObject;
                    break;
                }
            }
        }

        if (dirLightObj == null) dirLightObj = new GameObject("Directional Light");

        dirLightObj.SetActive(true);
        dirLightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

        Light dirLight = dirLightObj.GetComponent<Light>();
        if (dirLight == null) dirLight = dirLightObj.AddComponent<Light>();

        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.25f, 0.35f, 0.55f);
        dirLight.intensity = 0.04f; // Redup pekat, tanpa menerangi langit
        dirLight.shadows = LightShadows.Soft;
        dirLight.shadowStrength = 0.8f;
        dirLight.enabled = true;
        RenderSettings.sun = dirLight;

        // Matikan objek Horror_Moon quad jika ada
        GameObject moon = GameObject.Find("Horror_Moon");
        if (moon != null) moon.SetActive(false);
    }

    public static void ApplyPitchBlackEnvironment()
    {
        ApplyHorrorAtmosphere();
    }

    private static AudioClip CreateFlashlightClick()
    {
        int sampleRate = 44100;
        int sampleCount = sampleRate / 20; // 0.05 detik
        AudioClip clip = AudioClip.Create("Click", sampleCount, 1, sampleRate, false);
        float[] samples = new float[sampleCount];
        for (int i = 0; i < sampleCount; i++)
        {
            samples[i] = (Random.value * 2f - 1f) * (1f - (float)i / sampleCount) * 0.3f;
        }
        clip.SetData(samples, 0);
        return clip;
    }
}
