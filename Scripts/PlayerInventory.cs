using UnityEngine;

public enum KeyType
{
    Ruby,   // Kunci Kuningan (Rumah Dukun - Barat Laut / NW)
    Amber,  // Kunci Besi (Rumah Omah - Tenggara / SE)
    Jade    // Kunci Perunggu (Rumah Punden - Barat Daya / SW)
}

public class PlayerInventory : MonoBehaviour
{
    [Header("Status Kunci Kuno")]
    [SerializeField] private bool _hasRubyKey = false;
    [SerializeField] private bool _hasAmberKey = false;
    [SerializeField] private bool _hasJadeKey = false;

    public bool hasRubyKey { get => _hasRubyKey; set => _hasRubyKey = value; }
    public bool hasAmberKey { get => _hasAmberKey; set => _hasAmberKey = value; }
    public bool hasJadeKey { get => _hasJadeKey; set => _hasJadeKey = value; }

    [Header("Tampilan HUD")]
    public bool showHUD = true;
    public bool isExpanded = false; // Default ringkas di pojok kiri atas
    private float _autoExpandTimer = 0f;

    public static PlayerInventory Instance { get; private set; }

    private string _notificationMessage = "";
    private float _notificationTimer = 0f;
    private const float NOTIFICATION_DURATION = 4.0f;

    private void Awake()
    {
        if (Instance == null) Instance = this;
    }

    public void AddKey(KeyType type)
    {
        switch (type)
        {
            case KeyType.Ruby:
                _hasRubyKey = true;
                break;
            case KeyType.Amber:
                _hasAmberKey = true;
                break;
            case KeyType.Jade:
                _hasJadeKey = true;
                break;
        }
        _autoExpandTimer = 5.0f; // Buka otomatis detail misi selama 5 detik saat kunci baru didapat
    }

    public bool HasKey(KeyType type)
    {
        return type switch
        {
            KeyType.Ruby => _hasRubyKey,
            KeyType.Amber => _hasAmberKey,
            KeyType.Jade => _hasJadeKey,
            _ => false
        };
    }

    public int GetKeyCount()
    {
        int count = 0;
        if (_hasRubyKey) count++;
        if (_hasAmberKey) count++;
        if (_hasJadeKey) count++;
        return count;
    }

    public bool HasAllKeys()
    {
        return _hasRubyKey && _hasAmberKey && _hasJadeKey;
    }

    public void ShowNotification(string msg)
    {
        _notificationMessage = msg;
        _notificationTimer = NOTIFICATION_DURATION;
    }

    private void Update()
    {
        if (_notificationTimer > 0f)
        {
            _notificationTimer -= Time.deltaTime;
        }

        if (_autoExpandTimer > 0f)
        {
            _autoExpandTimer -= Time.deltaTime;
        }

        // Tekan Tab untuk meminimalkan / memperluas tampilan misi (Tombol M khusus untuk Minimap)
        bool toggle = false;
#if ENABLE_INPUT_SYSTEM
        if (UnityEngine.InputSystem.Keyboard.current != null && UnityEngine.InputSystem.Keyboard.current.tabKey.wasPressedThisFrame)
        {
            toggle = true;
        }
#else
        if (Input.GetKeyDown(KeyCode.Tab))
        {
            toggle = true;
        }
#endif
        if (toggle)
        {
            isExpanded = !isExpanded;
        }
    }

    private void OnGUI()
    {
        if (!showHUD) return;
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled) return;

        Color originalColor = GUI.color;

        // 1. Panel Status Kunci di Pojok Kiri Atas
        float x = 20f;
        float y = 20f;
        bool showFull = isExpanded || _autoExpandTimer > 0f || HasAllKeys();

        // Tampilan Ringkas (Compact Badge) agar tidak memakan ruang layar
        if (!showFull)
        {
            float w = 220f;
            float h = 28f;

            GUI.color = new Color(0.05f, 0.05f, 0.07f, 0.85f);
            GUI.DrawTexture(new Rect(x, y, w, h), Texture2D.whiteTexture);

            GUI.color = new Color(0.95f, 0.85f, 0.25f, 0.8f);
            GUI.DrawTexture(new Rect(x, y, w, 1), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(x, y + h - 1, w, 1), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(x, y, 1, h), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(x + w - 1, y, 1, h), Texture2D.whiteTexture);

            GUIStyle badgeStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 12,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };
            badgeStyle.normal.textColor = new Color(1.0f, 0.9f, 0.4f);
            GUI.Label(new Rect(x, y, w, h), $"🔑 Kunci: {GetKeyCount()}/3  [Tab: Lihat Misi]", badgeStyle);

            GUI.color = originalColor;
            DrawNotifications();
            return;
        }

        // Tampilan Lengkap (Expanded Panel) saat ditekan Tab atau baru mengambil kunci
        float panelW = 310f;
        float panelH = HasAllKeys() ? 122f : 100f;

        // Background gelap pekat transparan
        GUI.color = new Color(0.05f, 0.05f, 0.07f, 0.88f);
        GUI.DrawTexture(new Rect(x, y, panelW, panelH), Texture2D.whiteTexture);

        // Border halus
        GUI.color = HasAllKeys() ? new Color(0.95f, 0.85f, 0.25f, 0.9f) : new Color(0.35f, 0.35f, 0.40f, 0.6f);
        GUI.DrawTexture(new Rect(x, y, panelW, 2), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(x, y + panelH - 2, panelW, 2), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(x, y, 2, panelH), Texture2D.whiteTexture);
        GUI.DrawTexture(new Rect(x + panelW - 2, y, 2, panelH), Texture2D.whiteTexture);

        // Header Kunci
        GUIStyle titleStyle = new GUIStyle(GUI.skin.label)
        {
            fontSize = 13,
            fontStyle = FontStyle.Bold,
            alignment = TextAnchor.MiddleLeft
        };
        titleStyle.normal.textColor = HasAllKeys() ? new Color(1.0f, 0.88f, 0.3f) : new Color(0.9f, 0.9f, 0.9f);

        GUI.color = Color.white;
        string titleText = HasAllKeys() ? "★ 3/3 KUNCI CANDI DITEMUKAN!" : $"🔑 KUNCI CANDI KUNO ({GetKeyCount()}/3)  [Tab]";
        GUI.Label(new Rect(x + 10, y + 6, panelW - 20, 22), titleText, titleStyle);

        // Baris Daftar 3 Kunci
        GUIStyle itemStyle = new GUIStyle(GUI.skin.label)
        {
            fontSize = 11,
            alignment = TextAnchor.MiddleLeft
        };

        // Kunci 1: Kuningan (Rumah Dukun - NW)
        itemStyle.normal.textColor = _hasRubyKey ? new Color(1.0f, 0.85f, 0.25f) : new Color(0.55f, 0.55f, 0.55f);
        string r1 = _hasRubyKey ? "[✓] Kunci Kuningan (Rumah Dukun NW)" : "[  ] Kunci Kuningan (Rumah Dukun NW)";
        GUI.Label(new Rect(x + 12, y + 28, panelW - 24, 18), r1, itemStyle);

        // Kunci 2: Besi (Rumah Omah - SE)
        itemStyle.normal.textColor = _hasAmberKey ? new Color(1.0f, 0.65f, 0.2f) : new Color(0.55f, 0.55f, 0.55f);
        string r2 = _hasAmberKey ? "[✓] Kunci Besi Tempa (Rumah Omah SE)" : "[  ] Kunci Besi Tempa (Rumah Omah SE)";
        GUI.Label(new Rect(x + 12, y + 46, panelW - 24, 18), r2, itemStyle);

        // Kunci 3: Perunggu (Rumah Punden - SW)
        itemStyle.normal.textColor = _hasJadeKey ? new Color(0.35f, 0.95f, 0.65f) : new Color(0.55f, 0.55f, 0.55f);
        string r3 = _hasJadeKey ? "[✓] Kunci Perunggu (Rumah Punden SW)" : "[  ] Kunci Perunggu (Rumah Punden SW)";
        GUI.Label(new Rect(x + 12, y + 64, panelW - 24, 18), r3, itemStyle);

        // Petunjuk lari ke gerbang jika semua kunci lengkap
        if (HasAllKeys())
        {
            float pulse = Mathf.Sin(Time.time * 5.0f) * 0.15f;
            GUIStyle objStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 11,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleLeft
            };
            objStyle.normal.textColor = new Color(1.0f, 0.85f + pulse, 0.2f, 1.0f);
            GUI.Label(new Rect(x + 10, y + 88, panelW - 15, 22), "➔ LARI KE GERBANG DEPAN UNTUK KELUAR!", objStyle);
        }

        // 2. Banner Notifikasi Pickup (Tengah Layar Atas)
        DrawNotifications();

        GUI.color = originalColor;
    }

    private void DrawNotifications()
    {
        if (_notificationTimer > 0f)
        {
            float alpha = Mathf.Clamp01(_notificationTimer / 0.8f);
            float bannerW = 460f;
            float bannerH = 48f;
            float bx = (Screen.width - bannerW) * 0.5f;
            float by = 60f;

            Color old = GUI.color;
            GUI.color = new Color(0.06f, 0.06f, 0.08f, 0.90f * alpha);
            GUI.DrawTexture(new Rect(bx, by, bannerW, bannerH), Texture2D.whiteTexture);

            GUI.color = new Color(0.95f, 0.8f, 0.2f, 0.85f * alpha);
            GUI.DrawTexture(new Rect(bx, by, bannerW, 2), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(bx, by + bannerH - 2, bannerW, 2), Texture2D.whiteTexture);

            GUIStyle notifStyle = new GUIStyle(GUI.skin.label)
            {
                fontSize = 13,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };
            notifStyle.normal.textColor = new Color(1.0f, 0.92f, 0.4f, alpha);
            GUI.Label(new Rect(bx + 10, by + 4, bannerW - 20, bannerH - 8), _notificationMessage, notifStyle);
            GUI.color = old;
        }
    }
}
