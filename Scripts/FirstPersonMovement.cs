using UnityEngine;

public enum PlayerSpawnLocation
{
    SouthMainEntrance,  // Z = 48, Rot = 180 (Menghadap langsung ke Candi Borobudur)
    PelataranCandi,     // Z = 30, Rot = 180 (Dekat tangga masuk Candi)
    GerbangLuar,        // Z = 110, Rot = 180 (Di depan gerbang luar)

    // Backward-compatibility aliases
    DepanTanggaCandi = SouthMainEntrance,
    PelataranAtasCandi = PelataranCandi,
    DepanGerbangLuar = GerbangLuar
}

[RequireComponent(typeof(CharacterController))]
public class FirstPersonMovement : MonoBehaviour
{
    [Header("Pergerakan Karakter")]
    public float walkSpeed = 5.2f;
    public float sprintSpeed = 8.8f;
    public float jumpHeight = 1.2f;
    public float gravity = -18.0f;

    [Header("Sistem Stamina")]
    public float maxStamina = 100f;
    public float currentStamina = 100f;
    public float staminaDrain = 20f;
    public float staminaRegen = 22f;

    [Header("Kamera & Mouse Look")]
    public Transform cameraTransform;
    public float mouseSensitivity = 2.5f;
    public float verticalLookLimit = 80.0f;
    public float cameraFarClip = 2000.0f;

    [Header("Spawn Awal")]
    public PlayerSpawnLocation spawnLocation = PlayerSpawnLocation.SouthMainEntrance;
    public Vector3 spawnPosition = new Vector3(0f, 1.5f, 48.0f);
    public float spawnRotationY = 180.0f;
    public bool enforceSpawnOnStart = true;

    private CharacterController _controller;
    private Vector3 _velocity;
    private float _pitch = 0f;
    private bool _isSprinting = false;
    private PlayerInventory _inventory;
    private string _notificationText = "";
    private float _notificationTimer = 0f;
    private bool _justLocked = false;

    private void Awake()
    {
        _controller = GetComponent<CharacterController>();
        if (_controller != null)
        {
            _controller.height = 1.8f;
            _controller.radius = 0.35f;
            _controller.center = new Vector3(0f, 0.9f, 0f);
            _controller.stepOffset = 0.45f;
            _controller.slopeLimit = 55.0f;
            _controller.skinWidth = 0.08f;
            _controller.minMoveDistance = 0f;
        }

        _inventory = GetComponent<PlayerInventory>();
        if (_inventory == null) _inventory = gameObject.AddComponent<PlayerInventory>();

        SetupCamera();
    }

    private void Start()
    {
        LockCursor();

        // 1. Posisikan pemain di Walkway Selatan menghadap lurus ke Candi Borobudur (Rotasi 180)
        if (enforceSpawnOnStart)
        {
            Vector3 targetSpawn = spawnPosition;
            if (spawnLocation == PlayerSpawnLocation.SouthMainEntrance)
                targetSpawn = new Vector3(0f, 1.5f, 48.0f);
            else if (spawnLocation == PlayerSpawnLocation.PelataranCandi)
                targetSpawn = new Vector3(0f, 1.5f, 30.0f);
            else if (spawnLocation == PlayerSpawnLocation.GerbangLuar)
                targetSpawn = new Vector3(0f, 1.5f, 110.0f);

            if (_controller != null) _controller.enabled = false;
            transform.position = targetSpawn;
            transform.rotation = Quaternion.Euler(0f, spawnRotationY, 0f);
            if (_controller != null) _controller.enabled = true;
        }

        // 2. Setup kamera awal menghadap horizontal
        _pitch = 0f;
        if (cameraTransform != null)
        {
            cameraTransform.localPosition = new Vector3(0f, 1.6f, 0.1f);
            cameraTransform.localRotation = Quaternion.identity;
        }

        // 3. Terapkan pencahayaan terang benderang
        FlashlightController.ApplyHorrorAtmosphere();
    }

    public void SetupCamera()
    {
        if (cameraTransform == null)
        {
            Camera cam = GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null) cameraTransform = cam.transform;
        }

        if (cameraTransform != null)
        {
            if (cameraTransform.parent != transform)
            {
                cameraTransform.SetParent(transform);
            }
            cameraTransform.localPosition = new Vector3(0f, 1.6f, 0.1f);
            cameraTransform.localRotation = Quaternion.identity;

            Camera c = cameraTransform.GetComponent<Camera>();
            if (c != null)
            {
                c.enabled = true;
                c.tag = "MainCamera";
                c.fieldOfView = 75.0f;
                c.nearClipPlane = 0.05f;
                c.farClipPlane = cameraFarClip;
                c.depth = 100f;
                c.cullingMask = -1; // Render seluruh layer
                c.useOcclusionCulling = false;
                c.clearFlags = CameraClearFlags.Skybox;
                c.backgroundColor = new Color(0.04f, 0.06f, 0.10f, 1f);
            }

            // Matikan kamera lain di scene yang bukan milik player
            foreach (var otherCam in Object.FindObjectsByType<Camera>(FindObjectsInactive.Include))
            {
                if (otherCam != null && otherCam.transform != cameraTransform && otherCam.transform.parent != transform)
                {
                    otherCam.enabled = false;
                    otherCam.tag = "Untagged";
                    if (otherCam.name.Contains("Camera")) otherCam.gameObject.SetActive(false);
                }
            }
        }
    }

    private void Update()
    {
        // 1. Mouse Look
        HandleMouseLook();

        // 2. Pergerakan Karakter (WASD)
        HandleMovement();

        // 3. Update Notifikasi HUD
        if (_notificationTimer > 0f)
        {
            _notificationTimer -= Time.deltaTime;
            if (_notificationTimer <= 0f) _notificationText = "";
        }

        // Failsafe jika jatuh dari pelataran
        if (transform.position.y < -8f)
        {
            if (_controller != null) _controller.enabled = false;
            transform.position = new Vector3(0f, 1.5f, -38.0f);
            _velocity = Vector3.zero;
            if (_controller != null) _controller.enabled = true;
        }
    }

    private void HandleMouseLook()
    {
        // Klik untuk mengunci kursor kembali
        if (Input.GetMouseButtonDown(0) && Cursor.lockState != CursorLockMode.Locked)
        {
            LockCursor();
        }
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            UnlockCursor();
        }

        if (Cursor.lockState != CursorLockMode.Locked) return;

        if (_justLocked)
        {
            _justLocked = false;
            return;
        }

        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

        // Putar badan pemain secara horizontal (kiri/kanan)
        transform.Rotate(Vector3.up * mouseX);

        // Putar kepala/kamera secara vertikal (atas/bawah)
        _pitch -= mouseY;
        _pitch = Mathf.Clamp(_pitch, -verticalLookLimit, verticalLookLimit);

        if (cameraTransform != null)
        {
            cameraTransform.localRotation = Quaternion.Euler(_pitch, 0f, 0f);
        }
    }

    private void HandleMovement()
    {
        if (_controller == null) return;

        bool isGrounded = _controller.isGrounded;
        if (isGrounded && _velocity.y < 0f)
        {
            _velocity.y = -2f;
        }

        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        Vector3 moveInput = (transform.right * h + transform.forward * v).normalized;

        // Sistem Sprint & Stamina
        bool wantsSprint = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
        if (wantsSprint && moveInput.magnitude > 0.1f && currentStamina > 5f)
        {
            _isSprinting = true;
            currentStamina = Mathf.Max(0f, currentStamina - (staminaDrain * Time.deltaTime));
        }
        else
        {
            _isSprinting = false;
            currentStamina = Mathf.Min(maxStamina, currentStamina + (staminaRegen * Time.deltaTime));
        }

        float speed = _isSprinting ? sprintSpeed : walkSpeed;
        _controller.Move(moveInput * (speed * Time.deltaTime));

        // Melompat
        if (isGrounded && Input.GetButtonDown("Jump"))
        {
            _velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
        }

        // Gravitasi
        _velocity.y += gravity * Time.deltaTime;
        _controller.Move(_velocity * Time.deltaTime);
    }

    public void ShowNotification(string message, float duration = 4.0f)
    {
        _notificationText = message;
        _notificationTimer = duration;
    }

    public void LockCursor()
    {
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
        _justLocked = true;
    }

    public void UnlockCursor()
    {
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }

    private void ClearCorridorObstacles()
    {
        // Matikan Horror_Moon quad putih yang menutupi candi jika ada
        GameObject moon = GameObject.Find("Horror_Moon");
        if (moon != null) moon.SetActive(false);

        // Bersihkan koridor tengah (X antara -4.5 s/d +4.5 dari Z=-60 s/d Z=-20) agar jalan ke Candi lapang
        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi == null) candi = GameObject.Find("Candi_Borobudur");
        if (candi != null)
        {
            foreach (Transform t in candi.GetComponentsInChildren<Transform>(true))
            {
                if (t != null && t != candi.transform)
                {
                    Vector3 pos = t.position;
                    if (Mathf.Abs(pos.x) < 4.5f && ((pos.z > -65f && pos.z < -20f) || (pos.z > 20f && pos.z < 125f)))
                    {
                        string n = t.name.ToLower();
                        if (n.Contains("tree") || n.Contains("pohon") || n.Contains("cylinder") || n.Contains("cone"))
                        {
                            float newX = pos.x >= 0f ? 8.0f : -8.0f;
                            t.position = new Vector3(newX, pos.y, pos.z);
                        }
                    }
                }
            }
        }
    }

    private void OnGUI()
    {
        // 1. Crosshair titik putih di tengah layar
        float cx = Screen.width * 0.5f;
        float cy = Screen.height * 0.5f;
        GUI.color = new Color(1f, 1f, 1f, 0.75f);
        GUI.DrawTexture(new Rect(cx - 2, cy - 2, 4, 4), Texture2D.whiteTexture);

        // 2. Bar Stamina di pojok kiri bawah
        float barW = 160f;
        float barH = 10f;
        float barX = 25f;
        float barY = Screen.height - 40f;

        // Background bar
        GUI.color = new Color(0.1f, 0.1f, 0.1f, 0.7f);
        GUI.DrawTexture(new Rect(barX, barY, barW, barH), Texture2D.whiteTexture);

        // Fill bar stamina
        float staminaPct = currentStamina / maxStamina;
        GUI.color = _isSprinting ? new Color(0.2f, 0.7f, 1.0f, 0.9f) : new Color(0.1f, 0.5f, 0.9f, 0.8f);
        GUI.DrawTexture(new Rect(barX, barY, barW * staminaPct, barH), Texture2D.whiteTexture);

        // Label Stamina & Petunjuk
        GUI.color = Color.white;
        GUI.Label(new Rect(barX, barY - 22f, 300f, 20f), "⚡ STAMINA (SHIFT)");
        GUI.Label(new Rect(barX, barY - 42f, 400f, 20f), "WASD: Gerak | SPASI: Lompat | MOUSE: Lihat");

        // 3. Status Senter di pojok kanan bawah
        FlashlightController fl = GetComponentInChildren<FlashlightController>();
        bool senterOn = fl != null && fl.isOn;
        string senterText = senterOn ? "🔦 SENTER [F]: MENYALA" : "🔦 SENTER [F]: MATI";
        GUI.color = senterOn ? new Color(1.0f, 0.95f, 0.6f) : new Color(0.6f, 0.6f, 0.6f);
        GUI.Label(new Rect(Screen.width - 200f, Screen.height - 40f, 180f, 25f), senterText);

        // 4. Status Kunci di pojok kanan atas
        if (_inventory != null)
        {
            GUI.color = Color.white;
            GUI.Label(new Rect(Screen.width - 240f, 25f, 220f, 25f), $"🗝️ KUNCI KUNO: {_inventory.GetKeyCount()} / 3");
            string kRuby = _inventory.hasRubyKey ? "<color=#ff5555>● Ruby</color>" : "<color=#777777>○ Ruby</color>";
            string kAmber = _inventory.hasAmberKey ? "<color=#ffaa33>● Amber</color>" : "<color=#777777>○ Amber</color>";
            string kJade = _inventory.hasJadeKey ? "<color=#55ff88>● Jade</color>" : "<color=#777777>○ Jade</color>";
            GUIStyle keyStyle = new GUIStyle(GUI.skin.label) { richText = true };
            GUI.Label(new Rect(Screen.width - 240f, 45f, 220f, 25f), $"{kRuby}  {kAmber}  {kJade}", keyStyle);
        }

        // 5. Notifikasi Banner di bagian atas tengah layar
        if (!string.IsNullOrEmpty(_notificationText))
        {
            GUIStyle notifStyle = new GUIStyle(GUI.skin.box);
            notifStyle.alignment = TextAnchor.MiddleCenter;
            notifStyle.fontSize = 15;
            notifStyle.normal.textColor = Color.yellow;
            float nW = 480f;
            float nH = 36f;
            GUI.Box(new Rect((Screen.width - nW) * 0.5f, 40f, nW, nH), _notificationText, notifStyle);
        }
    }
}
