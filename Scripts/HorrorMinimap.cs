using System.Collections.Generic;
using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class HorrorMinimap : MonoBehaviour
{
    [Header("Tampilan & Tata Letak")]
    [Tooltip("Apakah minimap sedang aktif ditampilkan di layar?")]
    public bool isMinimapVisible = true;

    [Tooltip("Ukuran lebar dan tinggi kotak minimap (pixel).")]
    public float minimapSize = 210f;

    [Tooltip("Jarak dari tepi kanan dan atas layar (pixel).")]
    public float margin = 20f;

    [Header("Sistem Fog of War & Jejak Hilang (Ephemeral Radar)")]
    [Tooltip("Radius area terang langsung di sekitar pemain saat ini (meter).")]
    public float currentVisionRadius = 26f;

    [Tooltip("Berapa lama jejak bekas jalan bertahan sebelum lenyap kembali ke dalam kegelapan (detik).")]
    public float trailDuration = 10.0f;

    [Tooltip("Jarak minimal gerakan pemain sebelum mencatat titik jejak baru (meter).")]
    public float trailDistanceInterval = 2.0f;

    [Header("Tombol Kontrol")]
    public KeyCode toggleKey = KeyCode.M;

    private Transform _playerTransform;
    private Camera _playerCamera;
    private PlayerController _playerController;

    private Texture2D _fogTexture;
    private Color32[] _fogPixels;
    private const int TEX_SIZE = 120; // 120x120 grid resolusi optimal (14.400 pixel, <0.2ms)
    private float _textureUpdateTimer = 0f;

    // Batas area Candi Borobudur (-120m s/d +120m)
    private readonly Vector2 _worldMin = new Vector2(-120f, -120f);
    private readonly Vector2 _worldMax = new Vector2(120f, 120f);

    private struct TrailPoint
    {
        public Vector2 pos;      // X, Z
        public float timestamp;
        public float radius;
    }

    private readonly List<TrailPoint> _trailPoints = new List<TrailPoint>();
    private Vector2 _lastRecordedPos = new Vector2(-9999f, -9999f);

    // Landmark candi (HANYA terlihat jika masuk dalam jangkauan jejak aktif, HANTU TIDAK PERNAH DITAMPILKAN!)
    private struct LandmarkInfo
    {
        public string name;
        public Vector2 pos;
        public Color iconColor;
        public string symbol;
    }

    private LandmarkInfo[] _landmarks;

    private void Awake()
    {
        _playerTransform = transform;
        _playerController = GetComponent<PlayerController>();

        // Inisialisasi daftar landmark lokasi penting (tanpa hantu!)
        _landmarks = new LandmarkInfo[]
        {
            new LandmarkInfo { name = "Joglo Dukun", pos = new Vector2(-87.62f, -90.0f), iconColor = new Color(0.95f, 0.8f, 0.2f), symbol = "🔑" },
            new LandmarkInfo { name = "Joglo Omah", pos = new Vector2(87.62f, 90.0f), iconColor = new Color(0.95f, 0.55f, 0.2f), symbol = "🔑" },
            new LandmarkInfo { name = "Joglo Punden", pos = new Vector2(-92.0f, 85.62f), iconColor = new Color(0.3f, 0.9f, 0.5f), symbol = "🔑" },
            new LandmarkInfo { name = "Candi Utama", pos = new Vector2(0.0f, -35.0f), iconColor = new Color(0.4f, 0.8f, 0.95f), symbol = "🏛️" },
            new LandmarkInfo { name = "Gerbang Keluar", pos = new Vector2(0.0f, 66.0f), iconColor = new Color(1.0f, 0.3f, 0.3f), symbol = "⛩️" }
        };

        // Buat tekstur Fog of War prosedural
        _fogTexture = new Texture2D(TEX_SIZE, TEX_SIZE, TextureFormat.RGBA32, false)
        {
            filterMode = FilterMode.Bilinear,
            wrapMode = TextureWrapMode.Clamp
        };
        _fogPixels = new Color32[TEX_SIZE * TEX_SIZE];
    }

    private void Start()
    {
        Camera cam = GetComponentInChildren<Camera>();
        if (cam == null)
        {
            cam = Camera.main;
        }
        if (cam != null)
        {
            _playerCamera = cam;
        }

        if (_playerController == null)
        {
            _playerController = GetComponent<PlayerController>();
        }
    }

    private void Update()
    {
        // 1. Deteksi tombol toggle [M] untuk sembunyikan/buka minimap
        bool togglePressed = false;
#if ENABLE_INPUT_SYSTEM
        if (Keyboard.current != null && Keyboard.current.mKey.wasPressedThisFrame)
        {
            togglePressed = true;
        }
#else
        if (Input.GetKeyDown(toggleKey))
        {
            togglePressed = true;
        }
#endif
        if (togglePressed)
        {
            isMinimapVisible = !isMinimapVisible;
        }

        if (_playerTransform == null)
        {
            return;
        }

        // 2. Rekam jejak langkah pemain (Ephemeral Breadcrumbs)
        Vector2 currentPos2D = new Vector2(_playerTransform.position.x, _playerTransform.position.z);
        if (Vector2.Distance(currentPos2D, _lastRecordedPos) >= trailDistanceInterval)
        {
            _trailPoints.Add(new TrailPoint
            {
                pos = currentPos2D,
                timestamp = Time.time,
                radius = currentVisionRadius
            });
            _lastRecordedPos = currentPos2D;
        }

        // 3. Bersihkan titik jejak yang sudah kedaluwarsa (bekas jalan menghilang seiring waktu)
        float currentTime = Time.time;
        for (int i = _trailPoints.Count - 1; i >= 0; i--)
        {
            if (currentTime - _trailPoints[i].timestamp >= trailDuration)
            {
                _trailPoints.RemoveAt(i);
            }
        }

        // 4. Perbarui tekstur fog of war berkala (~25 FPS update untuk hemat daya)
        _textureUpdateTimer += Time.deltaTime;
        if (_textureUpdateTimer >= 0.04f && isMinimapVisible)
        {
            _textureUpdateTimer = 0f;
            UpdateFogTexture(currentPos2D);
        }
    }

    private void UpdateFogTexture(Vector2 playerPos)
    {
        if (_fogTexture == null || _fogPixels == null)
        {
            return;
        }

        // 1. Bersihkan seluruh peta menjadi kabut hitam gulita (Void of Unknown)
        Color32 darkFog = new Color32(6, 7, 10, 240);
        for (int i = 0; i < _fogPixels.Length; i++)
        {
            _fogPixels[i] = darkFog;
        }

        // 2. Beri garis pelataran candi samar-samar di dalam area
        // (Halaman luar & dinding batas candi)
        DrawTempleBoundariesOnTexture();

        // 3. Buka kabut di titik-titik jejak langkah yang masih aktif (memudar halus)
        float currentTime = Time.time;
        for (int i = 0; i < _trailPoints.Count; i++)
        {
            TrailPoint tp = _trailPoints[i];
            float age = currentTime - tp.timestamp;
            float lifeAlpha = Mathf.Clamp01(1.0f - (age / trailDuration));
            if (lifeAlpha > 0.01f)
            {
                CarveVisionCircle(tp.pos, tp.radius * lifeAlpha, lifeAlpha * 0.75f);
            }
        }

        // 4. Buka kabut di posisi pemain saat ini secara penuh (100% terang)
        CarveVisionCircle(playerPos, currentVisionRadius, 1.0f);

        _fogTexture.SetPixels32(_fogPixels);
        _fogTexture.Apply(false);
    }

    private void DrawTempleBoundariesOnTexture()
    {
        // Kotak Pelataran Candi Utama (X: -45..45, Z: -80..10)
        Vector2 cMin = WorldToTexturePos(new Vector2(-45f, -80f));
        Vector2 cMax = WorldToTexturePos(new Vector2(45f, 10f));

        Color32 wallColor = new Color32(24, 28, 35, 120);

        int minX = Mathf.Clamp((int)cMin.x, 0, TEX_SIZE - 1);
        int maxX = Mathf.Clamp((int)cMax.x, 0, TEX_SIZE - 1);
        int minY = Mathf.Clamp((int)cMin.y, 0, TEX_SIZE - 1);
        int maxY = Mathf.Clamp((int)cMax.y, 0, TEX_SIZE - 1);

        for (int x = minX; x <= maxX; x++)
        {
            _fogPixels[minY * TEX_SIZE + x] = wallColor;
            _fogPixels[maxY * TEX_SIZE + x] = wallColor;
        }
        for (int y = minY; y <= maxY; y++)
        {
            _fogPixels[y * TEX_SIZE + minX] = wallColor;
            _fogPixels[y * TEX_SIZE + maxX] = wallColor;
        }
    }

    private void CarveVisionCircle(Vector2 worldCenter, float radiusMeters, float brightness)
    {
        Vector2 texCenter = WorldToTexturePos(worldCenter);
        float texRadius = (radiusMeters / (_worldMax.x - _worldMin.x)) * TEX_SIZE;
        float rSq = texRadius * texRadius;

        int minX = Mathf.Clamp((int)(texCenter.x - texRadius), 0, TEX_SIZE - 1);
        int maxX = Mathf.Clamp((int)(texCenter.x + texRadius), 0, TEX_SIZE - 1);
        int minY = Mathf.Clamp((int)(texCenter.y - texRadius), 0, TEX_SIZE - 1);
        int maxY = Mathf.Clamp((int)(texCenter.y + texRadius), 0, TEX_SIZE - 1);

        for (int y = minY; y <= maxY; y++)
        {
            int rowIdx = y * TEX_SIZE;
            float dy = y - texCenter.y;
            float dySq = dy * dy;

            for (int x = minX; x <= maxX; x++)
            {
                float dx = x - texCenter.x;
                float distSq = dx * dx + dySq;

                if (distSq <= rSq)
                {
                    float factor = 1.0f - Mathf.Sqrt(distSq) / texRadius;
                    factor = factor * factor * brightness; // Falloff kuadratik halus

                    Color32 current = _fogPixels[rowIdx + x];
                    byte targetA = (byte)Mathf.Clamp(240 - (int)(factor * 210f), 20, 240);
                    byte targetR = (byte)Mathf.Clamp(current.r + (int)(factor * 50f), 0, 90);
                    byte targetG = (byte)Mathf.Clamp(current.g + (int)(factor * 45f), 0, 85);
                    byte targetB = (byte)Mathf.Clamp(current.b + (int)(factor * 35f), 0, 75);

                    if (targetA < current.a)
                    {
                        _fogPixels[rowIdx + x] = new Color32(targetR, targetG, targetB, targetA);
                    }
                }
            }
        }
    }

    private Vector2 WorldToTexturePos(Vector2 worldPos)
    {
        float nx = Mathf.Clamp01((worldPos.x - _worldMin.x) / (_worldMax.x - _worldMin.x));
        float ny = Mathf.Clamp01((worldPos.y - _worldMin.y) / (_worldMax.y - _worldMin.y));
        return new Vector2(nx * (TEX_SIZE - 1), ny * (TEX_SIZE - 1));
    }

    private Vector2 WorldToScreenMinimapPos(Vector2 worldPos, Rect mapRect)
    {
        float nx = Mathf.Clamp01((worldPos.x - _worldMin.x) / (_worldMax.x - _worldMin.x));
        float ny = Mathf.Clamp01((worldPos.y - _worldMin.y) / (_worldMax.y - _worldMin.y));
        float sx = mapRect.x + nx * mapRect.width;
        float sy = mapRect.y + (1.0f - ny) * mapRect.height; // Y dibalik untuk koordinat GUI
        return new Vector2(sx, sy);
    }

    private float GetIlluminationAtWorldPos(Vector2 worldPos, Vector2 playerPos)
    {
        // 1. Cek jarak ke posisi pemain saat ini
        float dPlayer = Vector2.Distance(worldPos, playerPos);
        if (dPlayer <= currentVisionRadius)
        {
            return 1.0f - (dPlayer / currentVisionRadius) * 0.4f;
        }

        // 2. Cek jarak ke jejak langkah yang masih aktif
        float highestIllum = 0f;
        float currentTime = Time.time;
        for (int i = 0; i < _trailPoints.Count; i++)
        {
            TrailPoint tp = _trailPoints[i];
            float age = currentTime - tp.timestamp;
            float life = 1.0f - (age / trailDuration);
            if (life <= 0f) continue;

            float dTrail = Vector2.Distance(worldPos, tp.pos);
            if (dTrail <= tp.radius)
            {
                float factor = (1.0f - (dTrail / tp.radius)) * life;
                if (factor > highestIllum)
                {
                    highestIllum = factor;
                }
            }
        }

        return highestIllum;
    }

    private void OnGUI()
    {
        // Sembunyikan jika sedang bermain di dalam headset VR nyata
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled && UnityEngine.XR.XRSettings.isDeviceActive)
        {
            return;
        }

        float screenW = Screen.width;
        float mapX = screenW - minimapSize - margin;
        float mapY = margin;

        Color prevColor = GUI.color;

        // Jika minimap disembunyikan (Hide mode), tampilkan tombol ringkas untuk membuka kembali
        if (!isMinimapVisible)
        {
            float btnW = 150f;
            float btnH = 28f;
            float btnX = screenW - btnW - margin;
            float btnY = margin;

            GUI.color = new Color(0.04f, 0.04f, 0.06f, 0.85f);
            GUI.DrawTexture(new Rect(btnX, btnY, btnW, btnH), Texture2D.whiteTexture);

            GUI.color = new Color(0.85f, 0.7f, 0.25f, 0.85f);
            GUI.DrawTexture(new Rect(btnX, btnY, btnW, 1), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(btnX, btnY + btnH - 1, btnW, 1), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(btnX, btnY, 1, btnH), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(btnX + btnW - 1, btnY, 1, btnH), Texture2D.whiteTexture);

            GUIStyle toggleBtnStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 12,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };
            toggleBtnStyle.normal.textColor = Color.white;
            GUI.color = Color.white;

            if (GUI.Button(new Rect(btnX, btnY, btnW, btnH), "🗺️ [M] Buka Minimap", toggleBtnStyle))
            {
                isMinimapVisible = true;
            }

            GUI.color = prevColor;
            return;
        }

        Rect mapRect = new Rect(mapX, mapY + 24f, minimapSize, minimapSize);

        // 1. Panel Header Minimap (Judul & Tombol Hide)
        GUI.color = new Color(0.04f, 0.04f, 0.06f, 0.95f);
        GUI.DrawTexture(new Rect(mapX, mapY, minimapSize, 24f), Texture2D.whiteTexture);

        GUI.color = new Color(0.85f, 0.68f, 0.25f, 0.9f);
        GUI.DrawTexture(new Rect(mapX, mapY, minimapSize, 2), Texture2D.whiteTexture);

        GUIStyle headerStyle = new GUIStyle(GUI.skin.label)
        {
            fontSize = 11,
            fontStyle = FontStyle.Bold,
            alignment = TextAnchor.MiddleLeft
        };
        headerStyle.normal.textColor = new Color(0.95f, 0.85f, 0.5f, 1f);
        GUI.color = Color.white;
        GUI.Label(new Rect(mapX + 8, mapY + 2, minimapSize - 40, 20), "🗺️ RADAR CANDI [M]", headerStyle);

        // Tombol tutup [X] kecil di sudut kanan header
        GUIStyle closeStyle = new GUIStyle(GUI.skin.button)
        {
            fontSize = 11,
            fontStyle = FontStyle.Bold,
            alignment = TextAnchor.MiddleCenter
        };
        closeStyle.normal.textColor = new Color(0.8f, 0.8f, 0.8f, 0.9f);
        if (GUI.Button(new Rect(mapX + minimapSize - 22, mapY + 2, 18, 18), "✕", closeStyle))
        {
            isMinimapVisible = false;
        }

        // 2. Gambar Background & Tekstur Fog of War
        GUI.color = new Color(0.02f, 0.02f, 0.04f, 0.95f);
        GUI.DrawTexture(mapRect, Texture2D.whiteTexture);

        if (_fogTexture != null)
        {
            GUI.color = Color.white;
            GUI.DrawTexture(mapRect, _fogTexture, ScaleMode.StretchToFill, true);
        }

        // 3. Gambar Garis Bingkai Antik / Emas Mistis
        GUI.color = new Color(0.75f, 0.55f, 0.18f, 0.85f);
        GUI.DrawTexture(new Rect(mapRect.x, mapRect.y, mapRect.width, 2), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(mapRect.x, mapRect.y + mapRect.height - 2, mapRect.width, 2), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(mapRect.x, mapRect.y, 2, mapRect.height), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(mapRect.x + mapRect.width - 2, mapRect.y, 2, mapRect.height), Texture2D.whiteTexture);

        // 4. Mata Angin (Kompas U, T, S, B)
        GUIStyle compassStyle = new GUIStyle(GUI.skin.label)
        {
            fontSize = 10,
            fontStyle = FontStyle.Bold,
            alignment = TextAnchor.MiddleCenter
        };
        compassStyle.normal.textColor = new Color(0.9f, 0.8f, 0.4f, 0.75f);
        GUI.color = Color.white;
        GUI.Label(new Rect(mapRect.x + (mapRect.width * 0.5f) - 10, mapRect.y + 2, 20, 16), "U", compassStyle);
        GUI.Label(new Rect(mapRect.x + (mapRect.width * 0.5f) - 10, mapRect.y + mapRect.height - 18, 20, 16), "S", compassStyle);
        GUI.Label(new Rect(mapRect.x + 2, mapRect.y + (mapRect.height * 0.5f) - 8, 16, 16), "B", compassStyle);
        GUI.Label(new Rect(mapRect.x + mapRect.width - 18, mapRect.y + (mapRect.height * 0.5f) - 8, 16, 16), "T", compassStyle);

        Vector2 playerPos2D = _playerTransform != null
            ? new Vector2(_playerTransform.position.x, _playerTransform.position.z)
            : Vector2.zero;

        // 5. Gambar Landmark (HANYA MUNCUL JIKA TERKENA PENGLIHATAN / JEJAK AKTIF!)
        // Jika jejak sudah hilang, landmark ikut menghilang dari peta!
        // HANTU SAMA SEKALI TIDAK ADA DI DAFTAR INI (TIDAK DIBOCORKAN!).
        if (_landmarks != null)
        {
            GUIStyle lmStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 9,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };

            for (int i = 0; i < _landmarks.Length; i++)
            {
                LandmarkInfo lm = _landmarks[i];
                float illum = GetIlluminationAtWorldPos(lm.pos, playerPos2D);

                // Landmark hanya tampil jika area tersebut sedang terbuka!
                if (illum >= 0.12f)
                {
                    Vector2 sPos = WorldToScreenMinimapPos(lm.pos, mapRect);

                    // Ikon Titik Landmark
                    Color c = lm.iconColor;
                    c.a = Mathf.Clamp01(illum * 1.2f);
                    GUI.color = c;
                    GUI.DrawTexture(new Rect(sPos.x - 3, sPos.y - 3, 6, 6), Texture2D.whiteTexture);

                    // Label Nama Landmark
                    lmStyle.normal.textColor = new Color(c.r, c.g, c.b, c.a);
                    GUI.Label(new Rect(sPos.x - 45, sPos.y - 15, 90, 16), lm.name, lmStyle);
                }
            }
        }

        // 6. Gambar Pemain (Player Indicator & Arah Senter)
        if (_playerTransform != null)
        {
            Vector2 pScreen = WorldToScreenMinimapPos(playerPos2D, mapRect);

            // Arah hadap pemain (Y rotation)
            float yaw = _playerTransform.eulerAngles.y;
            if (_playerCamera != null)
            {
                yaw = _playerCamera.transform.eulerAngles.y;
            }

            // Kerucut sorotan senter (jika senter menyala)
            bool flOn = _playerController != null && _playerController.flashlightOn;
            if (flOn)
            {
                GUI.color = new Color(1.0f, 0.95f, 0.6f, 0.35f);
                DrawFlashlightCone(pScreen, yaw, 18f);
            }

            // Ikon Titik Emas Pemain
            GUI.color = new Color(1.0f, 0.85f, 0.2f, 1.0f);
            GUI.DrawTexture(new Rect(pScreen.x - 4, pScreen.y - 4, 8, 8), Texture2D.whiteTexture);

            // Panah Arah Hadap
            DrawDirectionArrow(pScreen, yaw, new Color(1.0f, 0.3f, 0.3f, 1.0f));
        }

        // 7. Footer Status Fog of War
        GUI.color = new Color(0.04f, 0.04f, 0.06f, 0.85f);
        GUI.DrawTexture(new Rect(mapX, mapRect.y + mapRect.height, minimapSize, 18f), Texture2D.whiteTexture);

        GUIStyle footerStyle = new GUIStyle(GUI.skin.label)
        {
            fontSize = 9,
            alignment = TextAnchor.MiddleCenter
        };
        footerStyle.normal.textColor = new Color(0.7f, 0.7f, 0.7f, 0.75f);
        GUI.color = Color.white;
        GUI.Label(new Rect(mapX, mapRect.y + mapRect.height, minimapSize, 18f), "Jejak hilang otomatis • [M] Hide", footerStyle);

        GUI.color = prevColor;
    }

    private void DrawDirectionArrow(Vector2 center, float angleDeg, Color color)
    {
        Matrix4x4 oldMatrix = GUI.matrix;
        GUIUtility.RotateAroundPivot(angleDeg, center);

        GUI.color = color;
        // Gambar panah kecil menghadap ke atas
        GUI.DrawTexture(new Rect(center.x - 1, center.y - 9, 2, 7), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(center.x - 2, center.y - 8, 4, 2), Texture2D.whiteTexture);

        GUI.matrix = oldMatrix;
    }

    private void DrawFlashlightCone(Vector2 center, float angleDeg, float length)
    {
        Matrix4x4 oldMatrix = GUI.matrix;
        GUIUtility.RotateAroundPivot(angleDeg, center);

        // Bentuk segitiga sorotan cahaya sederhana
        GUI.DrawTexture(new Rect(center.x - 1, center.y - length, 2, length), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(center.x - 4, center.y - length * 0.8f, 8, 2), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(center.x - 7, center.y - length, 14, 2), Texture2D.whiteTexture);

        GUI.matrix = oldMatrix;
    }

    private void OnDestroy()
    {
        if (_fogTexture != null)
        {
            Destroy(_fogTexture);
            _fogTexture = null;
        }
    }
}
