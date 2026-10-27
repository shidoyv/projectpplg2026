using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

public class VRHUDCanvas : MonoBehaviour
{
    public static VRHUDCanvas Instance { get; private set; }

    [Header("Referensi UI 3D")]
    public Canvas vrCanvas;
    public RectTransform hudPanel;
    public Image staminaFill;
    public Text keysText;
    public Text objectiveText;
    public GameObject victoryPanel;
    public Text victoryTimeText;

    [Header("Eyelid VR (Bangun Pingsan)")]
    public Transform upperEyelid;
    public Transform lowerEyelid;

    private Transform _headCam;
    private PlayerController _playerController;
    private PlayerInventory _inventory;
    private HorrorVisionEffect _horrorVision;

    private void Awake()
    {
        Instance = this;
        _playerController = GetComponent<PlayerController>();
        _inventory = GetComponent<PlayerInventory>();
    }

    private void Start()
    {
        Camera cam = GetComponentInChildren<Camera>();
        if (cam == null) cam = Camera.main;
        if (cam != null)
        {
            _headCam = cam.transform;
            _horrorVision = cam.GetComponent<HorrorVisionEffect>();
        }

        BuildVRHUD();
        BuildVREyelids();

        // Sembunyikan default jika bukan sedang memakai kacamata VR
        bool isRealVR = (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled && UnityEngine.XR.XRSettings.isDeviceActive);
        if (vrCanvas != null) vrCanvas.gameObject.SetActive(isRealVR);
        if (upperEyelid != null && upperEyelid.parent != null) upperEyelid.parent.gameObject.SetActive(isRealVR);
    }

    private void BuildVRHUD()
    {
        if (vrCanvas != null) return;

        GameObject canvasObj = new GameObject("VR_WorldSpace_HUD");
        canvasObj.transform.SetParent(transform, false);

        vrCanvas = canvasObj.AddComponent<Canvas>();
        vrCanvas.renderMode = RenderMode.WorldSpace;
        canvasObj.AddComponent<CanvasScaler>();
        canvasObj.AddComponent<GraphicRaycaster>();

        RectTransform rt = vrCanvas.GetComponent<RectTransform>();
        rt.sizeDelta = new Vector2(800f, 600f);
        rt.localScale = Vector3.one * 0.0018f; // Skala pas untuk pandangan mata VR (~1.4 meter lebar virtual)

        // Panel HUD Utama
        GameObject panelObj = new GameObject("HUD_Panel");
        panelObj.transform.SetParent(canvasObj.transform, false);
        hudPanel = panelObj.AddComponent<RectTransform>();
        hudPanel.sizeDelta = new Vector2(500f, 130f);
        hudPanel.anchoredPosition = new Vector2(0f, -140f); // Sedikit di bawah pandangan agar tidak menghalangi jalan

        Image bg = panelObj.AddComponent<Image>();
        bg.color = new Color(0.04f, 0.04f, 0.06f, 0.75f);

        // Stamina Bar
        GameObject stamBg = new GameObject("Stamina_BG");
        stamBg.transform.SetParent(hudPanel, false);
        RectTransform stamBgRt = stamBg.AddComponent<RectTransform>();
        stamBgRt.sizeDelta = new Vector2(460f, 14f);
        stamBgRt.anchoredPosition = new Vector2(0f, 40f);
        Image sBgImg = stamBg.AddComponent<Image>();
        sBgImg.color = new Color(0.12f, 0.12f, 0.16f, 0.85f);

        GameObject stamFill = new GameObject("Stamina_Fill");
        stamFill.transform.SetParent(stamBg.transform, false);
        RectTransform fillRt = stamFill.AddComponent<RectTransform>();
        fillRt.sizeDelta = new Vector2(456f, 10f);
        staminaFill = stamFill.AddComponent<Image>();
        staminaFill.color = new Color(0.25f, 0.85f, 0.35f, 0.95f);
        staminaFill.type = Image.Type.Filled;
        staminaFill.fillMethod = Image.FillMethod.Horizontal;

        // Keys Status Text
        GameObject keysObj = new GameObject("Keys_Text");
        keysObj.transform.SetParent(hudPanel, false);
        RectTransform keysRt = keysObj.AddComponent<RectTransform>();
        keysRt.sizeDelta = new Vector2(460f, 32f);
        keysRt.anchoredPosition = new Vector2(0f, 8f);
        keysText = keysObj.AddComponent<Text>();
        keysText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf") ?? Resources.GetBuiltinResource<Font>("Arial.ttf");
        keysText.fontSize = 18;
        keysText.fontStyle = FontStyle.Bold;
        keysText.alignment = TextAnchor.MiddleCenter;
        keysText.color = new Color(1.0f, 0.88f, 0.45f);
        keysText.text = "??? KUNCI: Kuningan [ ] | Besi [ ] | Perunggu [ ]";

        // Objective Banner
        GameObject objObj = new GameObject("Objective_Text");
        objObj.transform.SetParent(hudPanel, false);
        RectTransform objRt = objObj.AddComponent<RectTransform>();
        objRt.sizeDelta = new Vector2(460f, 30f);
        objRt.anchoredPosition = new Vector2(0f, -28f);
        objectiveText = objObj.AddComponent<Text>();
        objectiveText.font = keysText.font;
        objectiveText.fontSize = 16;
        objectiveText.fontStyle = FontStyle.Bold;
        objectiveText.alignment = TextAnchor.MiddleCenter;
        objectiveText.color = new Color(0.9f, 0.9f, 0.95f);
        objectiveText.text = "Cari 3 Kunci Kuno di Rumah Joglo Candi";

        // Panel Kemenangan VR (Victory Panel)
        BuildVictoryPanel(canvasObj.transform);
    }

    private void BuildVictoryPanel(Transform parent)
    {
        GameObject vicObj = new GameObject("VR_Victory_Panel");
        vicObj.transform.SetParent(parent, false);
        RectTransform vicRt = vicObj.AddComponent<RectTransform>();
        vicRt.sizeDelta = new Vector2(650f, 420f);
        vicRt.anchoredPosition = new Vector2(0f, 20f);
        Image vicBg = vicObj.AddComponent<Image>();
        vicBg.color = new Color(0.04f, 0.04f, 0.07f, 0.95f);
        victoryPanel = vicObj;

        // Title
        GameObject tObj = new GameObject("Victory_Title");
        tObj.transform.SetParent(vicObj.transform, false);
        RectTransform tRt = tObj.AddComponent<RectTransform>();
        tRt.sizeDelta = new Vector2(600f, 50f);
        tRt.anchoredPosition = new Vector2(0f, 150f);
        Text t = tObj.AddComponent<Text>();
        t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf") ?? Resources.GetBuiltinResource<Font>("Arial.ttf");
        t.fontSize = 28;
        t.fontStyle = FontStyle.Bold;
        t.alignment = TextAnchor.MiddleCenter;
        t.color = new Color(1.0f, 0.92f, 0.35f);
        t.text = "?? KAMU BERHASIL KABUR!";

        // Epilogue
        GameObject epObj = new GameObject("Victory_Epilogue");
        epObj.transform.SetParent(vicObj.transform, false);
        RectTransform epRt = epObj.AddComponent<RectTransform>();
        epRt.sizeDelta = new Vector2(580f, 110f);
        epRt.anchoredPosition = new Vector2(0f, 65f);
        Text ep = epObj.AddComponent<Text>();
        ep.font = t.font;
        ep.fontSize = 16;
        ep.alignment = TextAnchor.MiddleCenter;
        ep.color = new Color(0.9f, 0.9f, 0.95f);
        ep.text = "Ketiga gembok kuno telah terbuka. Kamu berhasil melangkah keluar dari gerbang candi angker tepat saat fajar menyingsing. Hantu Wayang kini terkurung selamanya di dalam pelataran.";

        // Stats Time
        GameObject statObj = new GameObject("Victory_Stats");
        statObj.transform.SetParent(vicObj.transform, false);
        RectTransform sRt = statObj.AddComponent<RectTransform>();
        sRt.sizeDelta = new Vector2(580f, 40f);
        sRt.anchoredPosition = new Vector2(0f, -25f);
        victoryTimeText = statObj.AddComponent<Text>();
        victoryTimeText.font = t.font;
        victoryTimeText.fontSize = 18;
        victoryTimeText.fontStyle = FontStyle.Bold;
        victoryTimeText.alignment = TextAnchor.MiddleCenter;
        victoryTimeText.color = new Color(0.4f, 0.95f, 0.5f);
        victoryTimeText.text = "?? Waktu Melarikan Diri: 00:00";

        // Tombol Restart
        GameObject btn1Obj = new GameObject("Btn_Restart");
        btn1Obj.transform.SetParent(vicObj.transform, false);
        RectTransform b1Rt = btn1Obj.AddComponent<RectTransform>();
        b1Rt.sizeDelta = new Vector2(220f, 48f);
        b1Rt.anchoredPosition = new Vector2(-125f, -115f);
        Image b1Img = btn1Obj.AddComponent<Image>();
        b1Img.color = new Color(0.2f, 0.45f, 0.85f);
        Button b1 = btn1Obj.AddComponent<Button>();
        b1.onClick.AddListener(() => SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex));
        BoxCollider bc1 = btn1Obj.AddComponent<BoxCollider>();
        bc1.size = new Vector3(220f, 48f, 5f);

        GameObject b1TxtObj = new GameObject("Text");
        b1TxtObj.transform.SetParent(btn1Obj.transform, false);
        Text b1Txt = b1TxtObj.AddComponent<Text>();
        b1Txt.font = t.font;
        b1Txt.fontSize = 16;
        b1Txt.fontStyle = FontStyle.Bold;
        b1Txt.alignment = TextAnchor.MiddleCenter;
        b1Txt.color = Color.white;
        b1Txt.text = "🔄 MAIN LAGI";

        // Tombol Quit
        GameObject btn2Obj = new GameObject("Btn_Quit");
        btn2Obj.transform.SetParent(vicObj.transform, false);
        RectTransform b2Rt = btn2Obj.AddComponent<RectTransform>();
        b2Rt.sizeDelta = new Vector2(220f, 48f);
        b2Rt.anchoredPosition = new Vector2(125f, -115f);
        Image b2Img = btn2Obj.AddComponent<Image>();
        b2Img.color = new Color(0.85f, 0.25f, 0.25f);
        Button b2 = btn2Obj.AddComponent<Button>();
        b2.onClick.AddListener(() => {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#else
            Application.Quit();
#endif
        });
        BoxCollider bc2 = btn2Obj.AddComponent<BoxCollider>();
        bc2.size = new Vector3(220f, 48f, 5f);

        GameObject b2TxtObj = new GameObject("Text");
        b2TxtObj.transform.SetParent(btn2Obj.transform, false);
        Text b2Txt = b2TxtObj.AddComponent<Text>();
        b2Txt.font = t.font;
        b2Txt.fontSize = 16;
        b2Txt.fontStyle = FontStyle.Bold;
        b2Txt.alignment = TextAnchor.MiddleCenter;
        b2Txt.color = Color.white;
        b2Txt.text = "?? KELUAR GAME";

        victoryPanel.SetActive(false);
    }

    private void BuildVREyelids()
    {
        if (_headCam == null) return;

        // Pasangkan 2 Quad Kelopak Mata tepat di depan kamera mata VR
        Transform eyelids = _headCam.Find("VR_Eyelids");
        if (eyelids != null) return;

        GameObject root = new GameObject("VR_Eyelids");
        root.transform.SetParent(_headCam, false);
        root.transform.localPosition = new Vector3(0f, 0f, 0.35f);
        root.transform.localRotation = Quaternion.identity;

        Material blackMat = new Material(Shader.Find("Universal Render Pipeline/Unlit") ?? Shader.Find("Sprites/Default"));
        blackMat.color = Color.black;

        // Kelopak atas
        GameObject up = GameObject.CreatePrimitive(PrimitiveType.Quad);
        up.name = "Upper_Lid";
        up.transform.SetParent(root.transform, false);
        up.transform.localScale = new Vector3(1.2f, 0.6f, 1f);
        up.transform.localPosition = new Vector3(0f, 0.3f, 0f);
        Collider c1 = up.GetComponent<Collider>();
        if (c1 != null) Destroy(c1);
        up.GetComponent<MeshRenderer>().material = blackMat;
        upperEyelid = up.transform;

        // Kelopak bawah
        GameObject down = GameObject.CreatePrimitive(PrimitiveType.Quad);
        down.name = "Lower_Lid";
        down.transform.SetParent(root.transform, false);
        down.transform.localScale = new Vector3(1.2f, 0.6f, 1f);
        down.transform.localPosition = new Vector3(0f, -0.3f, 0f);
        Collider c2 = down.GetComponent<Collider>();
        if (c2 != null) Destroy(c2);
        down.GetComponent<MeshRenderer>().material = blackMat;
        lowerEyelid = down.transform;
    }

    private void Update()
    {
        if (_headCam == null)
        {
            Camera c = GetComponentInChildren<Camera>();
            if (c == null) c = Camera.main;
            if (c != null) _headCam = c.transform;
            return;
        }

        // 0. Sembunyikan total jika sedang di mode PC (bukan kacamata VR aktif)
        bool isRealVR = (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled && UnityEngine.XR.XRSettings.isDeviceActive);
        if (!isRealVR)
        {
            if (vrCanvas != null && vrCanvas.gameObject.activeSelf) vrCanvas.gameObject.SetActive(false);
            if (upperEyelid != null && upperEyelid.parent != null && upperEyelid.parent.gameObject.activeSelf)
                upperEyelid.parent.gameObject.SetActive(false);
            return;
        }

        if (vrCanvas != null && !vrCanvas.gameObject.activeSelf) vrCanvas.gameObject.SetActive(true);
        if (upperEyelid != null && upperEyelid.parent != null && !upperEyelid.parent.gameObject.activeSelf)
            upperEyelid.parent.gameObject.SetActive(true);

        // Posisikan Canvas WorldSpace VR di bawah sudut pandang agar tidak menghalangi tengah layar
        if (vrCanvas != null)
        {
            Vector3 targetPos = _headCam.position + _headCam.forward * 1.8f - _headCam.up * 0.45f;
            Quaternion targetRot = Quaternion.LookRotation(vrCanvas.transform.position - _headCam.position);
            vrCanvas.transform.position = Vector3.Lerp(vrCanvas.transform.position, targetPos, Time.deltaTime * 6f);
            vrCanvas.transform.rotation = Quaternion.Slerp(vrCanvas.transform.rotation, targetRot, Time.deltaTime * 6f);
        }

        // Update Stamina Bar
        if (_playerController != null && staminaFill != null)
        {
            float fill = Mathf.Clamp01(_playerController.currentStamina / _playerController.maxStamina);
            staminaFill.fillAmount = fill;
            staminaFill.color = Color.Lerp(new Color(0.9f, 0.25f, 0.2f), new Color(0.25f, 0.85f, 0.35f), fill);
        }

        // Update Status Kunci & Objektif
        if (_inventory != null)
        {
            bool hasRuby = _inventory.hasRubyKey;
            bool hasAmber = _inventory.hasAmberKey;
            bool hasJade = _inventory.hasJadeKey;

            if (keysText != null)
            {
                string r = hasRuby ? "<color=#55FF66>[?]</color>" : "[ ]";
                string a = hasAmber ? "<color=#55FF66>[?]</color>" : "[ ]";
                string j = hasJade ? "<color=#55FF66>[?]</color>" : "[ ]";
                keysText.text = $"??? Kuningan {r} | Besi {a} | Perunggu {j}";
            }

            if (objectiveText != null)
            {
                if (_inventory.HasAllKeys())
                {
                    float pulse = Mathf.Abs(Mathf.Sin(Time.time * 4f));
                    objectiveText.color = Color.Lerp(new Color(1f, 0.9f, 0.2f), new Color(1f, 1f, 1f), pulse);
                    objectiveText.text = "? LARI KE GERBANG DEPAN UNTUK KELUAR!";
                }
                else
                {
                    objectiveText.color = new Color(0.9f, 0.9f, 0.95f);
                    objectiveText.text = $"Kumpulkan 3 Kunci di Rumah Joglo ({_inventory.GetKeyCount()}/3)";
                }
            }
        }

        // Update Animasi Kelopak Mata VR saat Bangun Tidur
        if (_horrorVision != null && upperEyelid != null && lowerEyelid != null)
        {
            float amount = _horrorVision.eyeOpenAmount;
            if (amount < 0.99f)
            {
                upperEyelid.gameObject.SetActive(true);
                lowerEyelid.gameObject.SetActive(true);
                float yOffset = Mathf.Lerp(0f, 0.45f, amount);
                upperEyelid.localPosition = new Vector3(0f, 0.15f + yOffset, 0f);
                lowerEyelid.localPosition = new Vector3(0f, -0.15f - yOffset, 0f);
            }
            else
            {
                upperEyelid.gameObject.SetActive(false);
                lowerEyelid.gameObject.SetActive(false);
            }
        }

        // Update Victory Panel VR
        if (_horrorVision != null && _horrorVision.isEscapeEndingActive)
        {
            if (hudPanel != null) hudPanel.gameObject.SetActive(false);
            if (victoryPanel != null)
            {
                victoryPanel.SetActive(true);
                if (victoryTimeText != null)
                {
                    int mins = Mathf.FloorToInt(_horrorVision.finalSurvivalTime / 60f);
                    int secs = Mathf.FloorToInt(_horrorVision.finalSurvivalTime % 60f);
                    victoryTimeText.text = $"?? Waktu Melarikan Diri: {mins:00}m {secs:00}s (3/3 Kunci Lengkap)";
                }
            }
        }
    }
}
