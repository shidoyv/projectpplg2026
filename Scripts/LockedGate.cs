using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class LockedGate : MonoBehaviour
{
    [Header("Referensi Pintu & Pengunci")]
    public Transform daunPintuKiri;
    public Transform daunPintuKanan;
    public GameObject palangBesi;
    public GameObject gembokRuby;   // Gembok 1 Kuningan Kuno
    public GameObject gembokAmber;  // Gembok 2 Besi Kuno
    public GameObject gembokJade;   // Gembok 3 Perunggu Kuno

    [Header("Status Gerbang")]
    public bool isUnlocked = false;
    public float interactionRange = 5.0f;

    private Quaternion _leftClosedRot;
    private Quaternion _rightClosedRot;
    private Quaternion _leftOpenRot;
    private Quaternion _rightOpenRot;
    private float _openProgress = 0f;
    private Transform _playerTransform;
    private PlayerInventory _inventory;
    private bool _playerInRange = false;
    private bool _hasEscaped = false;

    private bool _doorsInitialized = false;

    private void Awake()
    {
        AutoFindGateComponents();
    }

    public void AutoFindGateComponents()
    {
        if (daunPintuKiri == null || daunPintuKanan == null || gembokRuby == null || gembokAmber == null || gembokJade == null || palangBesi == null)
        {
            Transform[] all = Object.FindObjectsByType<Transform>(FindObjectsInactive.Include);
            foreach (var t in all)
            {
                if (t == null) continue;
                string n = t.name;
                if (daunPintuKiri == null && n.Contains("Pintu_Gerbang_Kiri")) daunPintuKiri = t;
                else if (daunPintuKanan == null && n.Contains("Pintu_Gerbang_Kanan")) daunPintuKanan = t;
                else if (palangBesi == null && n.Contains("Palang_Besi_Pengunci")) palangBesi = t.gameObject;
                else if (gembokRuby == null && n.Contains("Gembok_1_Kuningan_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembokRuby = t.gameObject;
                else if (gembokAmber == null && n.Contains("Gembok_2_Besi_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembokAmber = t.gameObject;
                else if (gembokJade == null && n.Contains("Gembok_3_Perunggu_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembokJade = t.gameObject;
            }
        }

        if (!_doorsInitialized)
        {
            if (daunPintuKiri != null)
            {
                _leftClosedRot = daunPintuKiri.localRotation;
                _leftOpenRot = _leftClosedRot * Quaternion.Euler(0f, -85f, 0f);
            }

            if (daunPintuKanan != null)
            {
                _rightClosedRot = daunPintuKanan.localRotation;
                _rightOpenRot = _rightClosedRot * Quaternion.Euler(0f, 85f, 0f);
            }

            if (daunPintuKiri != null || daunPintuKanan != null)
            {
                _doorsInitialized = true;
            }
        }
    }

    private void Start()
    {
        AutoFindGateComponents();

        GameObject player = GameObject.FindWithTag("Player");
        if (player == null) player = GameObject.Find("Player");
        if (player != null)
        {
            _playerTransform = player.transform;
            _inventory = player.GetComponent<PlayerInventory>();
        }
    }

    private void Update()
    {
        // 1. Animasi Buka Daun Gerbang saat Unlocked
        if (isUnlocked && _openProgress < 1f)
        {
            _openProgress += Time.deltaTime * 0.75f;
            if (daunPintuKiri != null)
                daunPintuKiri.localRotation = Quaternion.Slerp(_leftClosedRot, _leftOpenRot, _openProgress);
            if (daunPintuKanan != null)
                daunPintuKanan.localRotation = Quaternion.Slerp(_rightClosedRot, _rightOpenRot, _openProgress);
        }

        // 2. Interaksi Pemain dengan Gerbang
        if (_playerTransform != null)
        {
            float dist = Vector3.Distance(transform.position, _playerTransform.position);
            _playerInRange = (dist <= interactionRange + 2.0f);

            bool pressE = false;
#if ENABLE_INPUT_SYSTEM
            if (Keyboard.current != null && Keyboard.current.eKey.wasPressedThisFrame) pressE = true;
#else
            if (Input.GetKeyDown(KeyCode.E)) pressE = true;
#endif

            // VR Trigger / Grip Button di kontroler tangan kanan
            bool vrInteract = false;
            if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
            {
                UnityEngine.XR.InputDevice rDev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.RightHand);
                if (rDev.isValid)
                {
                    if (rDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.triggerButton, out bool tb) && tb) vrInteract = true;
                    if (rDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.gripButton, out bool gb) && gb) vrInteract = true;
                }
            }

            // Jika gerbang masih terkunci: Buka gerbang jika punya 3 kunci
            if (!isUnlocked && _playerInRange)
            {
                if (pressE || vrInteract)
                {
                    TryUnlockGate();
                }
            }
            // Jika gerbang sudah terbuka: Keluar dari gerbang untuk memicu Ending!
            else if (isUnlocked && !_hasEscaped)
            {
                // Trigger jika melangkah melewati gerbang (ke arah luar Z >= 67.5) atau menekan E / VR Trigger di lorong
                if ((_playerTransform.position.z >= 67.5f && _playerInRange) || (_playerInRange && (pressE || vrInteract)))
                {
                    TriggerEscapeEnding();
                }
            }
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player") || other.name == "Player")
        {
            if (!isUnlocked)
            {
                TryUnlockGate();
            }
            else if (!_hasEscaped && other.transform.position.z >= 66.5f)
            {
                TriggerEscapeEnding();
            }
        }
    }

    public void TryUnlockGate()
    {
        if (isUnlocked) return;

        if (_inventory == null)
        {
            _inventory = PlayerInventory.Instance;
            if (_inventory == null)
            {
                GameObject p = GameObject.FindWithTag("Player");
                if (p == null) p = GameObject.Find("Player");
                if (p != null) _inventory = p.GetComponent<PlayerInventory>();
            }
        }

        if (_inventory != null && _inventory.HasAllKeys())
        {
            UnlockGate();
            _inventory.ShowNotification("🎉 GERBANG TERBUKA! LARI KELUAR MENUJU KEBEBASAN!");
        }
        else
        {
            int count = _inventory != null ? _inventory.GetKeyCount() : 0;
            if (_inventory != null)
            {
                _inventory.ShowNotification($"🔒 GERBANG TERKUNCI! Cari 3 Kunci Kuno di Rumah Joglo ({count}/3)");
            }
        }
    }

    private void UnlockGate()
    {
        isUnlocked = true;
        AutoFindGateComponents();

        if (gembokRuby != null) gembokRuby.SetActive(false);
        if (gembokAmber != null) gembokAmber.SetActive(false);
        if (gembokJade != null) gembokJade.SetActive(false);
        if (palangBesi != null) palangBesi.SetActive(false);

        // Matikan semua collider daun pintu agar pemain leluasa keluar
        if (daunPintuKiri != null)
        {
            foreach (var col in daunPintuKiri.GetComponentsInChildren<Collider>(true))
            {
                col.enabled = false;
            }
        }
        if (daunPintuKanan != null)
        {
            foreach (var col in daunPintuKanan.GetComponentsInChildren<Collider>(true))
            {
                col.enabled = false;
            }
        }

        // Suara gemeretak gembok lepas dan pintu gerbang terbuka
        AudioSource.PlayClipAtPoint(CreateGateOpenTone(), transform.position, 1.0f);
    }

    public void TriggerEscapeEnding()
    {
        if (_hasEscaped) return;
        _hasEscaped = true;

        HorrorVisionEffect vision = Camera.main != null ? Camera.main.GetComponent<HorrorVisionEffect>() : null;
        if (vision == null && _playerTransform != null) vision = _playerTransform.GetComponentInChildren<HorrorVisionEffect>();

        if (vision != null)
        {
            vision.TriggerEscapeEnding();
        }

        // Lumpuhkan Hantu Wayang agar tidak mengganggu pemain yang berhasil kabur
        GameObject hantu = GameObject.Find("Hantu_Wayang");
        if (hantu != null)
        {
            HantuWayangAI ai = hantu.GetComponent<HantuWayangAI>();
            if (ai != null) ai.enabled = false;
        }
    }

    private static AudioClip CreateGateOpenTone()
    {
        int sampleRate = 44100;
        int sampleCount = sampleRate * 1;
        AudioClip clip = AudioClip.Create("GateUnlockTone", sampleCount, 1, sampleRate, false);
        float[] samples = new float[sampleCount];
        for (int i = 0; i < sampleCount; i++)
        {
            float t = (float)i / sampleRate;
            float creak = Mathf.Sin(2f * Mathf.PI * (110f + Mathf.Sin(t * 30f) * 20f) * t);
            float heavy = Mathf.Sin(2f * Mathf.PI * 55f * t) * 0.5f;
            float metallic = Mathf.Sin(2f * Mathf.PI * 440f * t) * Mathf.Exp(-t * 8f) * 0.4f;
            samples[i] = (creak * 0.4f + heavy + metallic) * Mathf.Clamp01(1f - t);
        }
        clip.SetData(samples, 0);
        return clip;
    }

    private void OnGUI()
    {
        if (!_playerInRange || _hasEscaped) return;
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled) return;

        // 1. Prompt saat gerbang masih terkunci
        if (!isUnlocked)
        {
            int count = (_inventory != null) ? _inventory.GetKeyCount() : 0;
            string prompt = count >= 3 
                ? "[E] Buka Gerbang Candi (3/3 Kunci Terpasang)" 
                : $"[E] Gerbang Terkunci 3 Gembok Kuno ({count}/3 Kunci)";

            float w = 390f;
            float h = 36f;
            float x = (Screen.width - w) * 0.5f;
            float y = Screen.height - 85f;

            Color old = GUI.color;
            GUI.color = new Color(0.05f, 0.05f, 0.07f, 0.88f);
            GUI.DrawTexture(new Rect(x, y, w, h), Texture2D.whiteTexture);

            GUI.color = count >= 3 ? new Color(0.95f, 0.85f, 0.25f, 0.9f) : new Color(0.85f, 0.4f, 0.3f, 0.9f);
            GUI.DrawTexture(new Rect(x, y, w, 2), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(x, y + h - 2, w, 2), Texture2D.whiteTexture);

            GUIStyle style = new GUIStyle(GUI.skin.label)
            {
                fontSize = 12,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };
            style.normal.textColor = count >= 3 ? new Color(1f, 0.9f, 0.4f) : new Color(0.95f, 0.85f, 0.85f);
            GUI.Label(new Rect(x, y, w, h), prompt, style);

            GUI.color = old;
        }
        // 2. Prompt saat gerbang sudah terbuka lebar
        else
        {
            float w = 440f;
            float h = 38f;
            float x = (Screen.width - w) * 0.5f;
            float y = Screen.height - 85f;

            Color old = GUI.color;
            GUI.color = new Color(0.04f, 0.06f, 0.04f, 0.92f);
            GUI.DrawTexture(new Rect(x, y, w, h), Texture2D.whiteTexture);

            GUI.color = new Color(0.4f, 0.95f, 0.45f, 0.95f);
            GUI.DrawTexture(new Rect(x, y, w, 2), Texture2D.whiteTexture);
            GUI.DrawTexture(new Rect(x, y + h - 2, w, 2), Texture2D.whiteTexture);

            GUIStyle style = new GUIStyle(GUI.skin.label)
            {
                fontSize = 12,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter
            };
            style.normal.textColor = new Color(0.95f, 1f, 0.92f);
            GUI.Label(new Rect(x, y, w, h), "🏃 GERBANG TERBUKA! LARI KELUAR MENUJU KEBEBASAN! [E / Maju]", style);

            GUI.color = old;
        }
    }
}
