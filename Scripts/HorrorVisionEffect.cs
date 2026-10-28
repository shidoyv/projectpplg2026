using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

[RequireComponent(typeof(Camera))]
public class HorrorVisionEffect : MonoBehaviour
{
    [Header("Jumpscare Hantu Wayang (Muka Mendekat ke Layar)")]
    public bool enableJumpscare = true;
    public float jumpscareDuration = 1.5f;
    public Texture2D jumpscareFaceTexture;

    [Header("Efek Bangun Tidur / Sadar dari Pingsan")]
    public bool enableWakeUpEffect = true;
    public float wakeUpDuration = 5.2f;

    [Header("Ending Melarikan Diri (Escape Victory)")]
    public bool isEscapeEndingActive = false;
    private float _escapeTimer = 0f;
    private float _finalSurvivalTime = 0f;
    public float finalSurvivalTime => _finalSurvivalTime;
    private AudioSource _victoryAudioSource;

    [Header("Pengaturan Jarak Pandang Terbatas (Kabut Hitam)")]
    public bool enforceDarkFog = true;
    public float fogStart = 8.0f;
    public float fogEnd = 58.0f;
    public Color fogColor = new Color(0.012f, 0.012f, 0.018f, 1.0f);
    public float cameraFarClip = 75.0f;

    [Header("Vignette Horor & Penglihatan Gelap")]
    [Range(0.2f, 1.0f)]
    public float baseVignetteDarkness = 0.38f;
    [Range(0.1f, 1.0f)]
    public float vignetteSize = 0.78f; // Ukuran area terang di tengah
    public Color darkOverlayColor = new Color(0f, 0f, 0f, 1f);

    [Header("Efek Panik & Kabur Saat Lari / Dekat Hantu")]
    public bool dynamicPanicVision = true;
    public float maxPanicDarkness = 0.95f;

    private Camera _cam;
    private Texture2D _vignetteTex;
    private Texture2D _topEyelidTex;
    private Texture2D _bottomEyelidTex;
    private PlayerController _playerController;
    private Transform _ghostTransform;
    private HantuWayangAI _ghostAI;

    private float _currentDarkness = 0.70f;
    private Vector3 _originalCamLocalPos;

    // Status Efek Bangun Pingsan (Wake Up)
    private bool _isWakingUp = true;
    public bool IsWakingUp => _isWakingUp;
    private float _wakeUpTimer = 0f;
    private float _eyeOpenAmount = 0f; // 0 = pejam rapat, 1 = melek penuh
    public float eyeOpenAmount => _eyeOpenAmount;
    private bool _flashlightClicked = false;
    private float _wakeUpSubtitleTimer = 0f;
    private AudioSource _clickAudioSource;
    private string _customWakeUpSubtitle = "";
    private bool _hasGasped = false;
    private bool _hasSighed = false;
    private bool _hasBeatenHeart = false;

    // Status Jumpscare
    private bool _isJumpscareActive = false;
    public bool IsJumpscareActive => _isJumpscareActive;
    private float _jumpscareTimer = 0f;
    private Transform _jumpscareGhostTarget;

    private void Awake()
    {
        _cam = GetComponent<Camera>();
        if (_cam == null) _cam = Camera.main;
        if (_cam != null)
        {
            _originalCamLocalPos = _cam.transform.localPosition;
            if (enforceDarkFog)
            {
                _cam.farClipPlane = cameraFarClip;
                _cam.backgroundColor = fogColor;
            }
        }

        if (!enableWakeUpEffect)
        {
            _isWakingUp = false;
            _eyeOpenAmount = 1.0f;
        }

        GenerateVignetteTexture();
        GenerateEyelidTextures();
        LoadOrGenerateJumpscareFaceTexture();
    }

    private void LoadOrGenerateJumpscareFaceTexture()
    {
        if (jumpscareFaceTexture != null) return;

        string texPath = System.IO.Path.Combine(Application.dataPath, "Textures", "wayang_buto_abang.png");
        if (System.IO.File.Exists(texPath))
        {
            try
            {
                byte[] bytes = System.IO.File.ReadAllBytes(texPath);
                jumpscareFaceTexture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                jumpscareFaceTexture.LoadImage(bytes);
                return;
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning("Gagal memuat tekstur wayang_buto_abang: " + ex.Message);
            }
        }

        // Fallback procedural scary demon face
        GenerateProceduralDemonFace();
    }

    private void GenerateProceduralDemonFace()
    {
        int size = 512;
        jumpscareFaceTexture = new Texture2D(size, size, TextureFormat.RGBA32, false);
        Color darkRed = new Color(0.75f, 0.08f, 0.08f, 1f);
        Color demonBlack = new Color(0.02f, 0.02f, 0.03f, 1f);
        Color glowingYellow = new Color(1.0f, 0.92f, 0.2f, 1f);
        Color fangWhite = new Color(0.95f, 0.95f, 0.9f, 1f);

        Vector2 center = new Vector2(size * 0.5f, size * 0.5f);

        for (int y = 0; y < size; y++)
        {
            for (int x = 0; x < size; x++)
            {
                float dx = (x - center.x) / (size * 0.42f);
                float dy = (y - center.y) / (size * 0.48f);
                float dist = dx * dx + dy * dy;

                if (dist > 1.0f)
                {
                    jumpscareFaceTexture.SetPixel(x, y, Color.clear);
                    continue;
                }

                Color col = Color.Lerp(darkRed, demonBlack, dist * 0.7f);

                float eyeDistL = Vector2.Distance(new Vector2(x, y), new Vector2(size * 0.35f, size * 0.60f)) / (size * 0.08f);
                float eyeDistR = Vector2.Distance(new Vector2(x, y), new Vector2(size * 0.65f, size * 0.60f)) / (size * 0.08f);
                if (eyeDistL < 1.0f || eyeDistR < 1.0f)
                {
                    col = (eyeDistL < 0.35f || eyeDistR < 0.35f) ? demonBlack : glowingYellow;
                }

                if (y > size * 0.22f && y < size * 0.42f && Mathf.Abs(x - center.x) < size * 0.30f)
                {
                    float mouthY = (y - size * 0.22f) / (size * 0.20f);
                    float fangPattern = Mathf.Sin(x * 0.35f);
                    if (fangPattern > 0.3f && (mouthY < 0.35f || mouthY > 0.65f))
                    {
                        col = fangWhite;
                    }
                    else
                    {
                        col = demonBlack;
                    }
                }

                jumpscareFaceTexture.SetPixel(x, y, col);
            }
        }
        jumpscareFaceTexture.Apply();
    }

    private void Start()
    {
        GameObject playerObj = GameObject.FindWithTag("Player");
        if (playerObj == null) playerObj = GameObject.Find("Player");
        if (playerObj != null)
        {
            _playerController = playerObj.GetComponent<PlayerController>();
        }

        GameObject ghostObj = GameObject.Find("Hantu_Wayang");
        if (ghostObj != null)
        {
            _ghostTransform = ghostObj.transform;
            _ghostAI = ghostObj.GetComponent<HantuWayangAI>();
        }

        ApplyFogSettings();
    }

    public void ApplyFogSettings()
    {
        if (!enforceDarkFog || isEscapeEndingActive) return;

        RenderSettings.fog = true;
        RenderSettings.fogMode = FogMode.Linear;
        RenderSettings.fogStartDistance = fogStart;
        RenderSettings.fogEndDistance = fogEnd;
        RenderSettings.fogColor = fogColor;

        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.022f, 0.022f, 0.028f, 1f);
        RenderSettings.ambientEquatorColor = new Color(0.015f, 0.015f, 0.02f, 1f);
        RenderSettings.ambientGroundColor = new Color(0.008f, 0.008f, 0.012f, 1f);
        RenderSettings.ambientIntensity = 0.18f;

        if (_cam != null)
        {
            _cam.farClipPlane = cameraFarClip;
            _cam.backgroundColor = fogColor;
        }
    }

    private void GenerateVignetteTexture()
    {
        int size = 256;
        _vignetteTex = new Texture2D(size, size, TextureFormat.RGBA32, false);
        _vignetteTex.wrapMode = TextureWrapMode.Clamp;
        _vignetteTex.filterMode = FilterMode.Bilinear;

        Vector2 center = new Vector2(size * 0.5f, size * 0.5f);
        float maxDist = size * 0.5f;

        for (int y = 0; y < size; y++)
        {
            for (int x = 0; x < size; x++)
            {
                float dist = Vector2.Distance(new Vector2(x, y), center) / maxDist;
                float alpha = Mathf.SmoothStep(vignetteSize, 1.0f, dist);
                _vignetteTex.SetPixel(x, y, new Color(0f, 0f, 0f, alpha));
            }
        }
        _vignetteTex.Apply();
    }

    private void GenerateEyelidTextures()
    {
        int width = 1024;
        int height = 512;

        _topEyelidTex = new Texture2D(width, height, TextureFormat.RGBA32, false);
        _topEyelidTex.wrapMode = TextureWrapMode.Clamp;
        _topEyelidTex.filterMode = FilterMode.Bilinear;

        _bottomEyelidTex = new Texture2D(width, height, TextureFormat.RGBA32, false);
        _bottomEyelidTex.wrapMode = TextureWrapMode.Clamp;
        _bottomEyelidTex.filterMode = FilterMode.Bilinear;

        float feather = 72.0f; // Gradasi bulu mata & kelopak mata lembut alami

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float u = (float)x / (width - 1);
                // Bentuk kelopak mata melengkung organik manusia
                float arch = Mathf.Sin(u * Mathf.PI);
                float curvedArch = Mathf.Pow(arch, 0.82f);

                // Kelopak atas
                float topEdgeY = 40.0f + 325.0f * curvedArch;
                float distTop = y - topEdgeY;
                float alphaTop = Mathf.Clamp01((distTop + feather * 0.5f) / feather);
                _topEyelidTex.SetPixel(x, y, new Color(0.005f, 0.005f, 0.005f, alphaTop));

                // Kelopak bawah
                float bottomEdgeY = (height - 40.0f) - 325.0f * curvedArch;
                float distBottom = bottomEdgeY - y;
                float alphaBottom = Mathf.Clamp01((distBottom + feather * 0.5f) / feather);
                _bottomEyelidTex.SetPixel(x, y, new Color(0.005f, 0.005f, 0.005f, alphaBottom));
            }
        }
        _topEyelidTex.Apply();
        _bottomEyelidTex.Apply();
    }

    public void TriggerWakeUp(string customSubtitle = null)
    {
        _isWakingUp = true;
        _wakeUpTimer = 0f;
        _eyeOpenAmount = 0f;
        _flashlightClicked = false;
        _hasGasped = false;
        _hasSighed = false;
        _hasBeatenHeart = false;
        _customWakeUpSubtitle = customSubtitle ?? "";

        PlayWakingHeartbeatSound();
    }

    public void PlayDeathAudio()
    {
        if (_clickAudioSource == null)
        {
            _clickAudioSource = gameObject.AddComponent<AudioSource>();
            _clickAudioSource.spatialBlend = 0f;
            _clickAudioSource.playOnAwake = false;
        }
        AudioClip deathClip = CreateDeathDroneClip();
        _clickAudioSource.PlayOneShot(deathClip, 1.0f);
    }

    private AudioClip CreateDeathDroneClip()
    {
        int rate = 44100;
        int samples = (int)(rate * 2.8f);
        float[] data = new float[samples];
        for (int i = 0; i < samples; i++)
        {
            float t = (float)i / rate;
            float s1 = Mathf.Sin(2f * Mathf.PI * 46f * t);
            float s2 = Mathf.Sin(2f * Mathf.PI * 49.2f * t);
            float env = Mathf.Exp(-t * 0.85f);
            data[i] = (s1 * 0.5f + s2 * 0.5f) * env * 0.75f;
        }
        AudioClip clip = AudioClip.Create("DeathDrone", samples, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    private void PlayWakingHeartbeatSound()
    {
        if (_clickAudioSource == null)
        {
            _clickAudioSource = gameObject.AddComponent<AudioSource>();
            _clickAudioSource.spatialBlend = 0f;
            _clickAudioSource.playOnAwake = false;
        }
        AudioClip clip = CreateHeartbeatClip();
        _clickAudioSource.PlayOneShot(clip, 0.9f);
    }

    private void PlayWakingBreathSound()
    {
        if (_clickAudioSource == null)
        {
            _clickAudioSource = gameObject.AddComponent<AudioSource>();
            _clickAudioSource.spatialBlend = 0f;
            _clickAudioSource.playOnAwake = false;
        }
        AudioClip clip = CreateBreathGaspClip();
        _clickAudioSource.PlayOneShot(clip, 0.75f);
    }

    private AudioClip CreateHeartbeatClip()
    {
        int rate = 44100;
        int samples = (int)(rate * 1.1f);
        float[] data = new float[samples];
        for (int i = 0; i < samples; i++)
        {
            float t = (float)i / rate;
            float b1 = (t >= 0.05f && t < 0.28f) ? Mathf.Sin(2f * Mathf.PI * 58f * (t - 0.05f)) * Mathf.Exp(-(t - 0.05f) * 15f) : 0f;
            float b2 = (t >= 0.36f && t < 0.62f) ? Mathf.Sin(2f * Mathf.PI * 48f * (t - 0.36f)) * Mathf.Exp(-(t - 0.36f) * 13f) * 0.75f : 0f;
            data[i] = (b1 + b2) * 0.88f;
        }
        AudioClip clip = AudioClip.Create("WakingHeartbeat", samples, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    private AudioClip CreateBreathGaspClip()
    {
        int rate = 44100;
        int samples = (int)(rate * 1.25f);
        float[] data = new float[samples];
        float lastNoise = 0f;
        for (int i = 0; i < samples; i++)
        {
            float t = (float)i / rate;
            float white = (Random.value * 2f - 1f);
            lastNoise = Mathf.Lerp(lastNoise, white, 0.14f);
            float env = 0f;
            if (t < 0.38f) env = Mathf.SmoothStep(0f, 1f, t / 0.38f);
            else env = Mathf.Exp(-(t - 0.38f) * 4.2f);
            data[i] = lastNoise * env * 0.55f;
        }
        AudioClip clip = AudioClip.Create("BreathGasp", samples, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    public void TriggerJumpscare(Transform ghost)
    {
        if (_isJumpscareActive || isEscapeEndingActive) return;
        _isJumpscareActive = true;
        _jumpscareTimer = 0f;
        _jumpscareGhostTarget = ghost;

#if UNITY_2023_1_OR_NEWER
        HorrorAudioManager audioMgr = FindAnyObjectByType<HorrorAudioManager>();
#else
        HorrorAudioManager audioMgr = FindObjectOfType<HorrorAudioManager>();
#endif
        if (audioMgr != null)
        {
            audioMgr.PlayJumpscareStinger();
        }

        // Kejutan haptik keras ke kedua kontroler VR saat diterkam hantu
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
        {
            UnityEngine.XR.InputDevice lDev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.LeftHand);
            if (lDev.isValid) lDev.SendHapticImpulse(0, 1.0f, 0.5f);
            UnityEngine.XR.InputDevice rDev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.RightHand);
            if (rDev.isValid) rDev.SendHapticImpulse(0, 1.0f, 0.5f);
        }
    }

    public void TriggerEscapeEnding()
    {
        if (isEscapeEndingActive) return;
        isEscapeEndingActive = true;
        _escapeTimer = 0f;
        _finalSurvivalTime = Time.timeSinceLevelLoad;

        // Buka kursor mouse untuk klik tombol Restart / Keluar
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;

        if (_playerController != null)
        {
            _playerController.isGameWon = true;
        }

        // Matikan audio horor & putar alunan fajar kemenangan
#if UNITY_2023_1_OR_NEWER
        HorrorAudioManager audioMgr = FindAnyObjectByType<HorrorAudioManager>();
#else
        HorrorAudioManager audioMgr = FindObjectOfType<HorrorAudioManager>();
#endif
        if (audioMgr != null)
        {
            audioMgr.enabled = false;
        }

        PlayVictoryMusic();
    }

    private void PlayVictoryMusic()
    {
        if (_victoryAudioSource == null)
        {
            _victoryAudioSource = gameObject.AddComponent<AudioSource>();
            _victoryAudioSource.spatialBlend = 0f;
            _victoryAudioSource.loop = true;
            _victoryAudioSource.playOnAwake = false;
        }

        _victoryAudioSource.clip = CreateVictoryHarmonicChime();
        _victoryAudioSource.volume = 0.85f;
        _victoryAudioSource.Play();
    }

    private AudioClip CreateVictoryHarmonicChime()
    {
        int sampleRate = 44100;
        float duration = 4.5f;
        int sampleCount = (int)(sampleRate * duration);
        AudioClip clip = AudioClip.Create("VictoryChime", sampleCount, 1, sampleRate, false);
        float[] data = new float[sampleCount];

        // Accord harmoni pentatonis syahdu menenangkan (E - G# - B - E high - F#)
        float[] freqs = new float[] { 329.63f, 415.30f, 493.88f, 659.25f, 739.99f, 987.77f };

        for (int i = 0; i < sampleCount; i++)
        {
            float t = (float)i / sampleRate;
            float sample = 0f;

            for (int c = 0; c < freqs.Length; c++)
            {
                float hitTime = c * 0.38f;
                if (t >= hitTime)
                {
                    float localT = t - hitTime;
                    float env = Mathf.Exp(-localT * 1.6f);
                    float wave = Mathf.Sin(2f * Mathf.PI * freqs[c] * localT);
                    float overtone = Mathf.Sin(2f * Mathf.PI * freqs[c] * 2.01f * localT) * 0.22f;
                    sample += (wave + overtone) * env * 0.26f;
                }
            }

            float bassEnv = Mathf.Sin(Mathf.Clamp01(t / duration) * Mathf.PI);
            sample += Mathf.Sin(2f * Mathf.PI * 164.81f * t) * bassEnv * 0.15f;

            data[i] = Mathf.Clamp(sample, -1.0f, 1.0f);
        }
        clip.SetData(data, 0);
        return clip;
    }

    private void Update()
    {
        // 0. Update Ending Kemenangan jika berhasil keluar gerbang
        if (isEscapeEndingActive)
        {
            _escapeTimer += Time.deltaTime;
            float et = _escapeTimer;

            // Transisi fajar: Kabut hitam berangsur berubah menjadi cahaya fajar keemasan yang menyejukkan
            if (et < 5.0f)
            {
                float p = Mathf.Clamp01(et / 4.0f);
                RenderSettings.fogColor = Color.Lerp(fogColor, new Color(0.96f, 0.90f, 0.78f, 1.0f), p);
                RenderSettings.fogStartDistance = Mathf.Lerp(fogStart, 20.0f, p);
                RenderSettings.fogEndDistance = Mathf.Lerp(fogEnd, 120.0f, p);
                RenderSettings.ambientIntensity = Mathf.Lerp(0.18f, 0.95f, p);
                RenderSettings.ambientSkyColor = Color.Lerp(new Color(0.022f, 0.022f, 0.028f), new Color(0.98f, 0.92f, 0.80f), p);
            }
            return;
        }

        // 1. Update Jumpscare jika terkena Hantu
        if (_isJumpscareActive)
        {
            _jumpscareTimer += Time.deltaTime;
            float jt = _jumpscareTimer;

            // Kamera dikunci paksa menatap wajah iblis hantu wayang
            if (_jumpscareGhostTarget != null && _cam != null)
            {
                Vector3 targetEye = _jumpscareGhostTarget.position + Vector3.up * 1.5f;
                Vector3 dir = (targetEye - _cam.transform.position).normalized;
                if (dir.sqrMagnitude > 0.001f)
                {
                    _cam.transform.rotation = Quaternion.Slerp(_cam.transform.rotation, Quaternion.LookRotation(dir), Time.deltaTime * 24f);
                }
            }

            // Getaran dahsyat kamera (violent camera trauma shake)
            if (_cam != null)
            {
                float shakeStrength = Mathf.Lerp(0.08f, 0.015f, jt / jumpscareDuration);
                float sx = (Random.value - 0.5f) * shakeStrength;
                float sy = (Random.value - 0.5f) * shakeStrength;
                _cam.transform.localPosition = _originalCamLocalPos + new Vector3(sx, sy, 0f);
            }

            if (jt >= jumpscareDuration)
            {
                _isJumpscareActive = false;
                _jumpscareGhostTarget = null;
                if (_cam != null)
                {
                    _cam.transform.localPosition = _originalCamLocalPos;
                }
                if (_playerController != null)
                {
                    _playerController.OnJumpscareEnd();
                }
            }
            return;
        }

        // 2. Eksekusi Timeline Efek Bangun dari Pingsan
        if (_isWakingUp)
        {
            UpdateWakeUpSequence();
            return;
        }

        if (_wakeUpSubtitleTimer > 0f)
        {
            _wakeUpSubtitleTimer -= Time.deltaTime;
        }

        if (enforceDarkFog && Time.frameCount % 60 == 0)
        {
            if (RenderSettings.fogEndDistance != fogEnd || RenderSettings.fogColor != fogColor)
            {
                ApplyFogSettings();
            }
        }

        if (!dynamicPanicVision) return;

        float targetDarkness = baseVignetteDarkness;
        float jitterAmount = 0f;

        // 3. Reaksi Stamina Rendah
        if (_playerController != null)
        {
            float stamRatio = _playerController.currentStamina / _playerController.maxStamina;
            if (stamRatio < 0.35f)
            {
                float lowStamFactor = 1.0f - (stamRatio / 0.35f);
                targetDarkness = Mathf.Lerp(targetDarkness, maxPanicDarkness, lowStamFactor * 0.65f);
                jitterAmount += lowStamFactor * 0.035f;
            }

            if (_playerController.isSprinting)
            {
                targetDarkness = Mathf.Max(targetDarkness, baseVignetteDarkness + 0.12f);
                jitterAmount += 0.015f;
            }
        }

        // 4. Reaksi Dekat Hantu Wayang
        if (_ghostTransform != null)
        {
            float dist = Vector3.Distance(transform.position, _ghostTransform.position);
            bool isChasing = _ghostAI != null && _ghostAI.IsChasing;

            if (isChasing)
            {
                float pulse = Mathf.Sin(Time.time * 6.0f) * 0.08f;
                targetDarkness = Mathf.Clamp01(maxPanicDarkness - 0.05f + pulse);
                jitterAmount += 0.045f;
            }
            else if (dist < 28.0f)
            {
                float ghostFactor = 1.0f - (dist / 28.0f);
                float pulse = Mathf.Sin(Time.time * 3.5f) * 0.05f * ghostFactor;
                targetDarkness = Mathf.Lerp(targetDarkness, 0.88f, ghostFactor) + pulse;
                jitterAmount += ghostFactor * 0.02f;
            }
        }

        _currentDarkness = Mathf.MoveTowards(_currentDarkness, targetDarkness, Time.deltaTime * 2.5f);

        // 5. Efek getar halus penglihatan kabur
        if (jitterAmount > 0.001f && _cam != null)
        {
            float jx = (Mathf.PerlinNoise(Time.time * 25f, 0f) - 0.5f) * jitterAmount;
            float jy = (Mathf.PerlinNoise(0f, Time.time * 25f) - 0.5f) * jitterAmount;
            _cam.transform.localPosition = _originalCamLocalPos + new Vector3(jx, jy, 0f);
        }
        else if (_cam != null)
        {
            _cam.transform.localPosition = Vector3.MoveTowards(_cam.transform.localPosition, _originalCamLocalPos, Time.deltaTime * 5f);
        }
    }

    private void UpdateWakeUpSequence()
    {
        _wakeUpTimer += Time.deltaTime;
        float t = _wakeUpTimer;

        bool skip = false;
#if ENABLE_INPUT_SYSTEM
        if (Keyboard.current != null && (Keyboard.current.spaceKey.wasPressedThisFrame || Keyboard.current.enterKey.wasPressedThisFrame)) skip = true;
        if (Mouse.current != null && Mouse.current.leftButton.wasPressedThisFrame) skip = true;
#else
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return) || Input.GetMouseButtonDown(0)) skip = true;
#endif

        if (skip)
        {
            _wakeUpTimer = wakeUpDuration;
            t = wakeUpDuration;
        }

        // Suara nafas tersentak (gasp) saat pertama kali membuka mata
        if (t >= 0.85f && !_hasGasped)
        {
            _hasGasped = true;
            PlayWakingBreathSound();
        }

        // Suara degup jantung sekunder
        if (t >= 1.4f && !_hasBeatenHeart)
        {
            _hasBeatenHeart = true;
            PlayWakingHeartbeatSound();
        }

        // 1. Kurva Gerakan Kelopak Mata Multi-Kedipan (Sangat Realistis)
        float open = 0f;
        if (t < 0.85f)
        {
            // 0.0s - 0.85s: Gelap total (mata terpejam lelap)
            open = 0f;
        }
        else if (t < 2.0f)
        {
            // 0.85s - 2.0s: Membuka perlahan pertama kali (intipan awal ~32%)
            float p = Mathf.SmoothStep(0f, 1f, (t - 0.85f) / 1.15f);
            open = p * 0.32f;
        }
        else if (t < 2.65f)
        {
            // 2.0s - 2.65s: Kelopak mata berat terpejam kembali (kedipan lelah ~4%)
            float p = Mathf.SmoothStep(0f, 1f, (t - 2.0f) / 0.65f);
            open = Mathf.Lerp(0.32f, 0.04f, p);
        }
        else if (t < 3.75f)
        {
            // 2.65s - 3.75s: Kesadaran pulih dan membuka lebih lebar (~78%)
            float p = Mathf.SmoothStep(0f, 1f, (t - 2.65f) / 1.10f);
            open = Mathf.Lerp(0.04f, 0.78f, p);
        }
        else if (t < 4.15f)
        {
            // 3.75s - 4.15s: Kedipan refleks cepat (flutter 78% -> 55% -> 85%)
            float p = (t - 3.75f) / 0.40f;
            float dip = Mathf.Sin(p * Mathf.PI) * 0.23f;
            open = Mathf.Max(0.2f, 0.78f - dip);
        }
        else if (t < 5.0f)
        {
            // 4.15s - 5.0s: Melek penuh 100%
            float p = Mathf.SmoothStep(0f, 1f, (t - 4.15f) / 0.85f);
            open = Mathf.Lerp(0.78f, 1.0f, p);
        }
        else
        {
            open = 1.0f;
        }

        _eyeOpenAmount = open;

        // 2. Animasi Kepala Terangkat dari Lantai
        if (_cam != null)
        {
            float pitch, roll, yaw, yOffset;
            if (t < 0.85f)
            {
                pitch = 24.0f;
                roll = 12.0f;
                yaw = -4.0f;
                yOffset = -0.25f;
            }
            else if (t < 2.0f)
            {
                float p = Mathf.SmoothStep(0f, 1f, (t - 0.85f) / 1.15f);
                pitch = Mathf.Lerp(24.0f, 16.0f, p);
                roll = Mathf.Lerp(12.0f, 7.0f, p);
                yaw = Mathf.Lerp(-4.0f, -2.0f, p);
                yOffset = Mathf.Lerp(-0.25f, -0.16f, p);
            }
            else if (t < 2.65f)
            {
                float p = Mathf.SmoothStep(0f, 1f, (t - 2.0f) / 0.65f);
                pitch = Mathf.Lerp(16.0f, 20.0f, p);
                roll = Mathf.Lerp(7.0f, 9.0f, p);
                yaw = -2.0f;
                yOffset = Mathf.Lerp(-0.16f, -0.20f, p);
            }
            else if (t < 3.75f)
            {
                float p = Mathf.SmoothStep(0f, 1f, (t - 2.65f) / 1.10f);
                pitch = Mathf.Lerp(20.0f, 5.0f, p);
                roll = Mathf.Lerp(9.0f, 2.0f, p);
                yaw = Mathf.Lerp(-2.0f, 0.0f, p);
                yOffset = Mathf.Lerp(-0.20f, -0.05f, p);
            }
            else if (t < 5.0f)
            {
                float p = Mathf.SmoothStep(0f, 1f, (t - 3.75f) / 1.25f);
                pitch = Mathf.Lerp(5.0f, 0.0f, p);
                roll = Mathf.Lerp(2.0f, 0.0f, p);
                yaw = 0.0f;
                yOffset = Mathf.Lerp(-0.05f, 0.0f, p);
            }
            else
            {
                pitch = 0f;
                roll = 0f;
                yaw = 0f;
                yOffset = 0f;
            }

            if (t < 4.5f)
            {
                pitch += Mathf.Sin(t * 3.0f) * 0.7f * (1.0f - open);
            }

            _cam.transform.localRotation = Quaternion.Euler(pitch, yaw, roll);
            _cam.transform.localPosition = _originalCamLocalPos + new Vector3(0f, yOffset, 0f);
        }

        // 3. Suara & Nyala Senter saat Sadar (t >= 4.0s)
        if (t >= 4.0f && !_flashlightClicked)
        {
            _flashlightClicked = true;
            PlayFlashlightClickSound();
            if (_playerController != null)
            {
                _playerController.flashlightOn = true;
                if (_playerController.flashlight != null)
                {
                    _playerController.flashlight.enabled = true;
                }
            }
        }

        // 4. Proses Bangun Selesai
        if (t >= wakeUpDuration)
        {
            _isWakingUp = false;
            _eyeOpenAmount = 1.0f;
            _wakeUpSubtitleTimer = 5.5f;

            if (_cam != null)
            {
                _cam.transform.localRotation = Quaternion.identity;
                _cam.transform.localPosition = _originalCamLocalPos;
            }

            if (_playerController != null)
            {
                _playerController.CompleteWakeUp();
            }
        }
    }

    private void PlayFlashlightClickSound()
    {
        if (_clickAudioSource == null)
        {
            _clickAudioSource = gameObject.AddComponent<AudioSource>();
            _clickAudioSource.spatialBlend = 0f;
            _clickAudioSource.playOnAwake = false;
        }

        AudioClip clickClip = CreateFlashlightClickClip();
        _clickAudioSource.PlayOneShot(clickClip, 0.85f);
    }

    private AudioClip CreateFlashlightClickClip()
    {
        int rate = 44100;
        int samples = (int)(rate * 0.12f);
        float[] data = new float[samples];
        for (int i = 0; i < samples; i++)
        {
            float time = (float)i / rate;
            float impulse1 = Mathf.Exp(-time * 350f) * Mathf.Sin(2f * Mathf.PI * 1600f * time);
            float time2 = time - 0.032f;
            float impulse2 = (time2 > 0f) ? Mathf.Exp(-time2 * 450f) * Mathf.Sin(2f * Mathf.PI * 2200f * time2) * 0.75f : 0f;
            data[i] = (impulse1 + impulse2) * 0.8f;
        }
        AudioClip clip = AudioClip.Create("FlashlightClick", samples, 1, rate, false);
        clip.SetData(data, 0);
        return clip;
    }

    private void OnGUI()
    {
        // Jika mode VR aktif, HUD 3D dan kelopak mata ditangani oleh VRHUDCanvas
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled) return;

        float w = Screen.width;
        float h = Screen.height;

        // -1. TAMPILKAN ENDING KEMENANGAN (ESCAPE VICTORY SCREEN)
        if (isEscapeEndingActive)
        {
            GUI.depth = -100; // Selalu paling atas di atas segalanya
            Color oldC = GUI.color;

            // Fade cahaya fajar lembut keemasan
            float fade = Mathf.Clamp01(_escapeTimer / 2.2f);
            GUI.color = new Color(0.98f, 0.94f, 0.85f, fade * 0.40f);
            GUI.DrawTexture(new Rect(0, 0, w, h), Texture2D.whiteTexture);

            // Tampilkan Kartu Kemenangan Mewah setelah fajar merekah
            if (_escapeTimer >= 1.2f)
            {
                float cardAlpha = Mathf.Clamp01((_escapeTimer - 1.2f) / 0.8f);

                float cardW = Mathf.Min(740f, w * 0.92f);
                float cardH = Mathf.Min(490f, h * 0.88f);
                float cardX = (w - cardW) * 0.5f;
                float cardY = (h - cardH) * 0.5f;

                // Background panel gelap elegan
                GUI.color = new Color(0.04f, 0.04f, 0.06f, 0.95f * cardAlpha);
                GUI.DrawTexture(new Rect(cardX, cardY, cardW, cardH), Texture2D.whiteTexture);

                // Border emas megah
                GUI.color = new Color(0.95f, 0.82f, 0.28f, 0.95f * cardAlpha);
                GUI.DrawTexture(new Rect(cardX, cardY, cardW, 3), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cardX, cardY + cardH - 3, cardW, 3), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cardX, cardY, 3, cardH), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cardX + cardW - 3, cardY, 3, cardH), Texture2D.whiteTexture);

                // Header Emblem Kemenangan
                GUIStyle badgeStyle = new GUIStyle(GUI.skin.label)
                {
                    fontSize = 14,
                    fontStyle = FontStyle.Bold,
                    alignment = TextAnchor.MiddleCenter
                };
                badgeStyle.normal.textColor = new Color(1.0f, 0.88f, 0.35f, cardAlpha);
                GUI.Label(new Rect(cardX, cardY + 18, cardW, 25), "🏆 MISI SELESAI — SEGEL GERBANG TERBUKA", badgeStyle);

                // Judul Besar
                GUIStyle titleStyle = new GUIStyle(GUI.skin.label)
                {
                    fontSize = 24,
                    fontStyle = FontStyle.Bold,
                    alignment = TextAnchor.MiddleCenter
                };
                titleStyle.normal.textColor = new Color(1.0f, 0.98f, 0.90f, cardAlpha);
                GUI.Label(new Rect(cardX, cardY + 46, cardW, 38), "KAMU BERHASIL MELARIKAN DIRI!", titleStyle);

                // Garis pembatas emas
                GUI.color = new Color(0.95f, 0.82f, 0.28f, 0.45f * cardAlpha);
                GUI.DrawTexture(new Rect(cardX + 40, cardY + 90, cardW - 80, 1), Texture2D.whiteTexture);

                // Kisah Epilog / Lore
                GUIStyle storyStyle = new GUIStyle(GUI.skin.label)
                {
                    fontSize = 13,
                    alignment = TextAnchor.MiddleCenter,
                    wordWrap = true,
                    fontStyle = FontStyle.Italic
                };
                storyStyle.normal.textColor = new Color(0.88f, 0.88f, 0.92f, cardAlpha);
                string epilogueText = "Dengan mengumpulkan ketiga Kunci Kuno peninggalan leluhur (Kuningan, Besi Tempa, dan Perunggu), kamu berhasil meruntuhkan segel gerbang mistis dan melangkah keluar dari pelataran candi angker.\n\nFajar telah menyingsing. Hantu Wayang kini terkurung selamanya di dalam batas pelataran. Teror malam akhirnya berakhir...";
                GUI.Label(new Rect(cardX + 35, cardY + 104, cardW - 70, 95), epilogueText, storyStyle);

                // Kotak Statistik Perjalanan
                float statY = cardY + 215f;
                GUI.color = new Color(0.08f, 0.08f, 0.12f, 0.88f * cardAlpha);
                GUI.DrawTexture(new Rect(cardX + 45, statY, cardW - 90, 115), Texture2D.whiteTexture);
                GUI.color = new Color(0.35f, 0.35f, 0.45f, 0.5f * cardAlpha);
                GUI.DrawTexture(new Rect(cardX + 45, statY, cardW - 90, 1), Texture2D.whiteTexture);
                GUI.DrawTexture(new Rect(cardX + 45, statY + 114, cardW - 90, 1), Texture2D.whiteTexture);

                GUIStyle statStyle = new GUIStyle(GUI.skin.label)
                {
                    fontSize = 13,
                    alignment = TextAnchor.MiddleLeft
                };
                statStyle.normal.textColor = new Color(0.95f, 0.95f, 0.95f, cardAlpha);

                int mins = Mathf.FloorToInt(_finalSurvivalTime / 60f);
                int secs = Mathf.FloorToInt(_finalSurvivalTime % 60f);
                string timeStr = $"{mins:00} menit {secs:00} detik";

                GUI.Label(new Rect(cardX + 65, statY + 14, cardW - 130, 24), $"⏱️  Waktu Melarikan Diri  : {timeStr}", statStyle);
                GUI.Label(new Rect(cardX + 65, statY + 46, cardW - 130, 24), "🔑  Kunci Ditemukan       : 3 / 3 Lengkap (Kuningan, Besi, Perunggu)", statStyle);
                GUI.Label(new Rect(cardX + 65, statY + 78, cardW - 130, 24), "👻  Status Hantu Wayang   : Terkurung di Pelataran Candi (Selamat!)", statStyle);

                // Tombol Aksi (Main Lagi & Keluar)
                float btnY = cardY + cardH - 65f;
                float btnW = 195f;
                float btnH = 44f;
                float btnGap = 25f;
                float btnX1 = cardX + (cardW - (btnW * 2 + btnGap)) * 0.5f;
                float btnX2 = btnX1 + btnW + btnGap;

                GUIStyle btnStyle = new GUIStyle(GUI.skin.button)
                {
                    fontSize = 13,
                    fontStyle = FontStyle.Bold
                };

                // Tombol Main Lagi
                if (GUI.Button(new Rect(btnX1, btnY, btnW, btnH), "🔄  MAIN LAGI", btnStyle))
                {
                    UnityEngine.SceneManagement.SceneManager.LoadScene(UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
                }

                // Tombol Keluar Game
                if (GUI.Button(new Rect(btnX2, btnY, btnW, btnH), "🚪  KELUAR GAME", btnStyle))
                {
#if UNITY_EDITOR
                    UnityEditor.EditorApplication.isPlaying = false;
#else
                    Application.Quit();
#endif
                }
            }

            GUI.color = oldC;
            return;
        }

        // 0. Tampilkan Jumpscare Muka Hantu Mendekat ke Layar
        if (_isJumpscareActive)
        {
            GUI.depth = 0;
            Color oldC = GUI.color;

            float redFlash = Mathf.Abs(Mathf.Sin(_jumpscareTimer * 35f));
            GUI.color = new Color(0.85f, 0.04f, 0.04f, 0.45f + redFlash * 0.40f);
            GUI.DrawTexture(new Rect(0, 0, w, h), Texture2D.whiteTexture);

            float zoom = Mathf.Lerp(0.72f, 1.35f, Mathf.SmoothStep(0f, 1f, Mathf.Clamp01(_jumpscareTimer / 0.42f)));
            float jx = Random.Range(-16f, 16f);
            float jy = Random.Range(-16f, 16f);

            float faceH = h * zoom;
            float faceW = faceH * 0.88f;
            float faceX = (w - faceW) * 0.5f + jx;
            float faceY = (h - faceH) * 0.5f + jy;

            if (jumpscareFaceTexture != null)
            {
                float alpha = (Random.value > 0.06f) ? 1.0f : 0.65f;
                GUI.color = new Color(1f, 0.95f, 0.95f, alpha);
                GUI.DrawTexture(new Rect(faceX, faceY, faceW, faceH), jumpscareFaceTexture, ScaleMode.ScaleToFit);
            }

            if (_vignetteTex != null)
            {
                GUI.color = new Color(0.7f, 0.02f, 0.02f, 0.88f);
                GUI.DrawTexture(new Rect(0, 0, w, h), _vignetteTex);
            }

            GUI.color = oldC;
            return;
        }

        // 1. Gambar Kelopak Mata saat Efek Bangun dari Pingsan Aktif
        if (_eyeOpenAmount < 0.999f)
        {
            GUI.depth = 2;

            if (_eyeOpenAmount <= 0.015f)
            {
                Color oldC = GUI.color;
                GUI.color = Color.black;
                GUI.DrawTexture(new Rect(0, 0, w, h), Texture2D.whiteTexture);
                GUI.color = oldC;
            }
            else
            {
                Color oldC = GUI.color;
                GUI.color = Color.black;

                float eyelidHeight = h * 0.72f;
                float topY = Mathf.Lerp(h * 0.54f - eyelidHeight, -eyelidHeight, _eyeOpenAmount);
                float bottomY = Mathf.Lerp(h * 0.46f, h, _eyeOpenAmount);

                if (topY > 0f)
                {
                    GUI.DrawTexture(new Rect(0, 0, w, topY), Texture2D.whiteTexture);
                }
                if (_topEyelidTex != null)
                {
                    GUI.DrawTexture(new Rect(0, topY, w, eyelidHeight), _topEyelidTex);
                }

                if (_bottomEyelidTex != null)
                {
                    GUI.DrawTexture(new Rect(0, bottomY, w, eyelidHeight), _bottomEyelidTex);
                }
                if (bottomY + eyelidHeight < h)
                {
                    GUI.DrawTexture(new Rect(0, bottomY + eyelidHeight, w, h - (bottomY + eyelidHeight)), Texture2D.whiteTexture);
                }

                float dazeAlpha = Mathf.Clamp01((1.0f - _eyeOpenAmount) * 0.65f);
                if (_vignetteTex != null && dazeAlpha > 0.02f)
                {
                    GUI.color = new Color(0f, 0f, 0f, dazeAlpha);
                    GUI.DrawTexture(new Rect(0, 0, w, h), _vignetteTex);
                }

                GUI.color = oldC;
            }

            GUIStyle skipStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 13,
                alignment = TextAnchor.UpperRight,
                fontStyle = FontStyle.Italic
            };
            skipStyle.normal.textColor = new Color(1f, 1f, 1f, 0.45f);
            GUI.Label(new Rect(w - 270, 20, 250, 30), "[Spasi / Klik untuk Lewati]", skipStyle);

            // Teks Narasi / Status Buka Mata
            if (_wakeUpTimer > 0.5f)
            {
                GUIStyle narrativeStyle = new GUIStyle(GUI.skin.label)
                {
                    fontSize = 16,
                    fontStyle = FontStyle.Italic,
                    alignment = TextAnchor.MiddleCenter
                };
                narrativeStyle.normal.textColor = new Color(0.92f, 0.92f, 0.92f, Mathf.Clamp01((_wakeUpTimer - 0.5f) * 1.5f));

                string msg = !string.IsNullOrEmpty(_customWakeUpSubtitle) 
                    ? _customWakeUpSubtitle 
                    : "Kepalamu berdenyut... Kamu tersadar di depan gerbang candi kuno...";
                GUI.Label(new Rect(20, h - 90, w - 40, 50), msg, narrativeStyle);
            }
            return;
        }

        // 2. Gambar Vignette Horor Normal selama Permainan
        if (_vignetteTex != null)
        {
            GUI.depth = 10;
            Color oldColor = GUI.color;

            GUI.color = new Color(darkOverlayColor.r, darkOverlayColor.g, darkOverlayColor.b, _currentDarkness);
            GUI.DrawTexture(new Rect(0, 0, w, h), _vignetteTex);

            if (!_isWakingUp && _playerController != null && !_playerController.flashlightOn)
            {
                GUI.color = new Color(0.01f, 0.01f, 0.01f, 0.94f);
                GUI.DrawTexture(new Rect(0, 0, w, h), Texture2D.whiteTexture);
            }

            GUI.color = oldColor;
        }

        // 3. Tampilkan Teks Narasi & Petunjuk setelah Bangun dari Pingsan
        if (_wakeUpSubtitleTimer > 0f)
        {
            float subAlpha = Mathf.Clamp01(_wakeUpSubtitleTimer > 1.0f ? 1.0f : _wakeUpSubtitleTimer);
            GUI.depth = 1;

            float boxW = Mathf.Min(780f, w * 0.88f);
            float boxH = 75f;
            float boxX = (w - boxW) * 0.5f;
            float boxY = h - boxH - 45f;

            Color oldC = GUI.color;
            GUI.color = new Color(0f, 0f, 0f, 0.72f * subAlpha);
            GUI.DrawTexture(new Rect(boxX, boxY, boxW, boxH), Texture2D.whiteTexture);

            GUIStyle dialogStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 16,
                alignment = TextAnchor.MiddleCenter,
                fontStyle = FontStyle.Italic,
                wordWrap = true
            };
            dialogStyle.normal.textColor = new Color(0.98f, 0.94f, 0.82f, subAlpha);
            GUI.Label(new Rect(boxX + 15, boxY + 8, boxW - 30, 35),
                "\"...Ugh, kepalaku pusing sekali... Di mana aku? Aku harus segera mencari kunci dan keluar dari sini...\"", dialogStyle);

            GUIStyle hintStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 13,
                alignment = TextAnchor.MiddleCenter,
                fontStyle = FontStyle.Bold
            };
            hintStyle.normal.textColor = new Color(0.75f, 0.88f, 0.95f, subAlpha * 0.85f);
            GUI.Label(new Rect(boxX + 15, boxY + 44, boxW - 30, 22),
                "[ WASD : Bergerak   |   Shift : Lari   |   F : Senter   |   E / Dekati : Kunci ]", hintStyle);

            GUI.color = oldC;
        }
    }
}
