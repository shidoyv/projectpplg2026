using UnityEngine;

public class FlashlightController : MonoBehaviour
{
    [Header("Komponen Lampu")]
    [SerializeField] private Light _flashlight;
    [SerializeField] private Light _fillLight;

    [Header("Pengaturan Senter")]
    [SerializeField] private bool _isOn = true;
    [SerializeField] private float _range = 300.0f;
    [SerializeField] private float _spotAngle = 95.0f;
    [SerializeField] private float _innerSpotAngle = 60.0f;
    [SerializeField] private float _normalIntensity = 4500.0f;

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
        float mainInt = isURP ? 4500.0f : 15.0f;
        float fillInt = isURP ? 800.0f : 4.0f;

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
            _flashlight.shadows = LightShadows.None;
            _flashlight.enabled = _isOn;
        }

        // 2. Fill / Omni Light di Sekitar Pemain (Radius 150 Meter 360 Derajat - Terang Benderang)
        Transform fillT = transform.Find("Flashlight_Fill_Light");
        if (fillT == null)
        {
            GameObject fillObj = new GameObject("Flashlight_Fill_Light");
            fillObj.transform.SetParent(transform, false);
            fillObj.transform.localPosition = Vector3.zero;
            _fillLight = fillObj.AddComponent<Light>();
        }
        else
        {
            _fillLight = fillT.GetComponent<Light>();
        }

        if (_fillLight != null)
        {
            _fillLight.type = LightType.Point;
            _fillLight.range = 150.0f;
            _fillLight.color = new Color(1.0f, 0.98f, 0.92f);
            _fillLight.intensity = fillInt;
            _fillLight.shadows = LightShadows.None;
            _fillLight.enabled = _isOn;
        }
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
        if (_fillLight != null) _fillLight.enabled = _isOn;

        // Feedback bunyi klik senter
        AudioSource.PlayClipAtPoint(CreateFlashlightClick(), transform.position, 0.5f);
    }

    public static void ApplyHorrorAtmosphere()
    {
        bool isURP = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline != null;

        // 1. Pencahayaan Ambient Terang & Jelas (Full Visibility - Tidak Ada Objek Hitam/Hilang)
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.80f, 0.86f, 0.96f);     // Langit terang jernih
        RenderSettings.ambientEquatorColor = new Color(0.70f, 0.76f, 0.88f); // Horison terang
        RenderSettings.ambientGroundColor = new Color(0.60f, 0.66f, 0.78f);  // Tanah & batu terang
        RenderSettings.ambientIntensity = 3.0f;
        RenderSettings.reflectionIntensity = 0.8f;
        DynamicGI.UpdateEnvironment();

        // 2. Matikan kabut buta 100%
        RenderSettings.fog = false;

        // 3. Cahaya Utama Terang Benderang (Directional Light)
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

        if (dirLightObj == null)
        {
            dirLightObj = new GameObject("Directional Light");
        }

        dirLightObj.SetActive(true);
        dirLightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

        Light dirLight = dirLightObj.GetComponent<Light>();
        if (dirLight == null) dirLight = dirLightObj.AddComponent<Light>();

        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.95f, 0.97f, 1.0f);
        dirLight.intensity = isURP ? 2000.0f : 2.5f;
        dirLight.shadows = LightShadows.Soft;
        dirLight.shadowStrength = 0.35f; // Bayangan lembut agar tidak gelap gulita
        dirLight.enabled = true;
        RenderSettings.sun = dirLight;

        // 4. Pastikan Skybox Terang & Menyeluruh
        if (RenderSettings.skybox != null)
        {
            if (RenderSettings.skybox.HasProperty("_Exposure")) RenderSettings.skybox.SetFloat("_Exposure", 1.0f);
            if (RenderSettings.skybox.HasProperty("_SkyTint")) RenderSettings.skybox.SetColor("_SkyTint", new Color(0.6f, 0.75f, 0.95f, 1.0f));
            if (RenderSettings.skybox.HasProperty("_GroundColor")) RenderSettings.skybox.SetColor("_GroundColor", new Color(0.5f, 0.6f, 0.75f, 1.0f));
        }

        // Matikan objek Horror_Moon jika ada
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
