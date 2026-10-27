using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

[RequireComponent(typeof(CharacterController))]
public class PlayerController : MonoBehaviour
{
    [Header("Pergerakan")]
    public float moveSpeed = 4.5f;       // Kecepatan jalan normal
    public float sprintSpeed = 8.0f;     // Kecepatan lari (Sprint)
    public float jumpHeight = 1.2f;
    public float gravity = -18.0f;
    public float mouseSensitivity = 0.15f;
    public Transform cameraTransform;

    [Header("Stamina")]
    public float maxStamina = 100.0f;
    public float currentStamina = 100.0f;
    public float staminaDrainRate = 22.0f;   // Berkurang ~22 per detik saat lari (~4.5 detik lari)
    public float staminaRegenRate = 18.0f;   // Pulih ~18 per detik (~5.5 detik penuh)
    public float staminaRegenDelay = 1.0f;   // Jeda 1 detik setelah lari sebelum mulai pulih
    public bool showStaminaBar = true;       // Tampilkan indikator stamina
    public bool autoHideStaminaBar = true;   // Otomatis sembunyikan jika stamina 100% penuh

    [Header("Titik Spawn (Depan Gerbang)")]
    public Transform spawnPoint;

    [Header("Senter Horor (Flashlight)")]
    public Light flashlight;
    public bool flashlightOn = true;
    public float flashlightIntensity = 8.5f;
    public float flashlightRange = 65.0f;
    public float flashlightSpotAngle = 72.0f;

    [Header("Sadar dari Pingsan (Wake Up)")]
    public bool playWakeUpOnStart = true;
    private bool _isWakingUp = false;
    public bool isWakingUp => _isWakingUp;

    private CharacterController _controller;
    private Vector3 _velocity;
    private float _pitch = 0f;
    private float _regenTimer = 0f;
    private float _staminaBarAlpha = 0f;
    private bool _isSprinting = false;
    public bool isSprinting => _isSprinting;
    private float _vrSnapCooldown = 0f;

    private void Awake()
    {
        _controller = GetComponent<CharacterController>();
        if (cameraTransform == null)
        {
            Camera cam = GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null) cameraTransform = cam.transform;
        }
        currentStamina = maxStamina;

        if (playWakeUpOnStart)
        {
            _isWakingUp = true;
            flashlightOn = false;
        }

        // Pasang komponen pendukung VR otomatis
        if (GetComponent<VRPlayerRig>() == null) gameObject.AddComponent<VRPlayerRig>();
        if (GetComponent<VRHUDCanvas>() == null) gameObject.AddComponent<VRHUDCanvas>();

        // Pasang atau cari senter di kamera
        SetupFlashlightIfMissing();

        // Posisikan karakter tepat di depan gerbang saat mulai
        PosisikanDiDepanGerbang();
    }

    private void Start()
    {
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;

        // Pastikan kembali posisi tepat di depan gerbang & senter aktif
        PosisikanDiDepanGerbang();
        SetupFlashlightIfMissing();
    }

    public void PosisikanDiDepanGerbang()
    {
        if (spawnPoint == null)
        {
            GameObject sp = GameObject.Find("Titik_Spawn_Pemain");
            if (sp != null) spawnPoint = sp.transform;
        }

        Vector3 targetPos = (spawnPoint != null) ? spawnPoint.position : new Vector3(0f, 1.0f, 118.0f);
        Quaternion targetRot = (spawnPoint != null) ? spawnPoint.rotation : Quaternion.Euler(0f, 180.0f, 0f);

        TeleportTo(targetPos, targetRot);
    }

    public void TeleportTo(Vector3 pos, Quaternion rot)
    {
        if (_controller != null) _controller.enabled = false;
        transform.position = pos;
        transform.rotation = rot;
        if (_controller != null) _controller.enabled = true;
    }

    public void SetupFlashlightIfMissing()
    {
        if (cameraTransform == null)
        {
            Camera cam = GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null) cameraTransform = cam.transform;
        }
        if (cameraTransform == null) return;

        Transform flT = cameraTransform.Find("Spotlight_Senter");
        if (flT == null)
        {
            GameObject flObj = new GameObject("Spotlight_Senter");
            flObj.transform.SetParent(cameraTransform, false);
            flObj.transform.localPosition = new Vector3(0.2f, -0.2f, 0.35f);
            flObj.transform.localRotation = Quaternion.identity;

            flashlight = flObj.AddComponent<Light>();
            flashlight.type = LightType.Spot;
            flashlight.color = new Color(1.0f, 0.97f, 0.90f); // Cahaya bohlam terang senter
            flashlight.range = flashlightRange;
            flashlight.spotAngle = flashlightSpotAngle;
            flashlight.innerSpotAngle = 46.0f;
            flashlight.intensity = flashlightIntensity;
            flashlight.shadows = LightShadows.Soft;
            flashlight.enabled = flashlightOn;

            // Fill light di sekitar pemain agar tidak terlalu gelap gulita di dekat kaki
            GameObject fillObj = new GameObject("Flashlight_Fill");
            fillObj.transform.SetParent(flObj.transform, false);
            fillObj.transform.localPosition = Vector3.zero;
            Light fill = fillObj.AddComponent<Light>();
            fill.type = LightType.Point;
            fill.color = new Color(1.0f, 0.98f, 0.92f);
            fill.range = 12.0f;
            fill.intensity = 1.6f;
            fill.shadows = LightShadows.None;
            fill.enabled = flashlightOn;
        }
        else
        {
            flashlight = flT.GetComponent<Light>();
            if (flashlight != null)
            {
                flashlight.color = new Color(1.0f, 0.97f, 0.90f);
                flashlight.intensity = flashlightIntensity;
                flashlight.range = flashlightRange;
                flashlight.spotAngle = flashlightSpotAngle;
                flashlight.innerSpotAngle = 46.0f;
                flashlight.enabled = flashlightOn;
            }
            Transform fillT = flT.Find("Flashlight_Fill");
            if (fillT != null)
            {
                Light fLight = fillT.GetComponent<Light>();
                if (fLight != null)
                {
                    fLight.color = new Color(1.0f, 0.98f, 0.92f);
                    fLight.range = 12.0f;
                    fLight.intensity = 1.6f;
                    fLight.enabled = flashlightOn;
                }
            }
        }
    }

    private void HandleFlashlight()
    {
        bool toggle = false;
#if ENABLE_INPUT_SYSTEM
        if (Keyboard.current != null && Keyboard.current.fKey.wasPressedThisFrame) toggle = true;
#else
        if (Input.GetKeyDown(KeyCode.F)) toggle = true;
#endif
        if (toggle && flashlight != null)
        {
            flashlightOn = !flashlightOn;
            flashlight.enabled = flashlightOn;
            Transform fill = flashlight.transform.Find("Flashlight_Fill");
            if (fill != null)
            {
                Light fLight = fill.GetComponent<Light>();
                if (fLight != null) fLight.enabled = flashlightOn;
            }
        }

        // Efek kedip horor jika hantu wayang mendekat
        if (flashlightOn && flashlight != null)
        {
            GameObject hantu = GameObject.Find("Hantu_Wayang");
            if (hantu != null)
            {
                float dist = Vector3.Distance(transform.position, hantu.transform.position);
                if (dist < 32.0f)
                {
                    float glitchChance = Mathf.Lerp(0.04f, 0.28f, 1f - (dist / 32.0f));
                    if (Random.value < glitchChance)
                    {
                        flashlight.intensity = Random.Range(0.05f, flashlightIntensity * 0.45f);
                    }
                    else
                    {
                        flashlight.intensity = Mathf.MoveTowards(flashlight.intensity, flashlightIntensity, Time.deltaTime * 8f);
                    }
                }
                else
                {
                    flashlight.intensity = Mathf.MoveTowards(flashlight.intensity, flashlightIntensity, Time.deltaTime * 10f);
                }
            }
        }
    }

    private bool _isUnderJumpscare = false;
    public bool isUnderJumpscare => _isUnderJumpscare;

    public void OnGhostAttack(Vector3 ghostPos)
    {
        _isUnderJumpscare = true;

        // Kuras habis stamina pemain agar terengah-engah dan panik
        currentStamina = 0f;
        _regenTimer = staminaRegenDelay * 3.5f;

        // Flashlight korslet berkedip liar (strobe)
        StartCoroutine(FlashlightJumpscareGlitch());
    }

    public void OnJumpscareEnd()
    {
        _isUnderJumpscare = false;

        // Dorongan kejut mundur keras dari hantu
        if (_controller != null)
        {
            Vector3 pushDir = -transform.forward;
            pushDir.y = 0.25f;
            _velocity = pushDir * 11f;
        }

        // Kembalikan senter
        if (flashlight != null)
        {
            flashlight.intensity = flashlightIntensity;
            flashlight.enabled = flashlightOn;
        }
    }

    private System.Collections.IEnumerator FlashlightJumpscareGlitch()
    {
        float timer = 0f;
        while (timer < 1.4f)
        {
            timer += Time.deltaTime;
            if (flashlight != null)
            {
                flashlight.enabled = (Random.value > 0.45f);
                flashlight.intensity = Random.Range(0.05f, flashlightIntensity * 1.3f);
            }
            yield return null;
        }
        if (flashlight != null)
        {
            flashlight.enabled = flashlightOn;
            flashlight.intensity = flashlightIntensity;
        }
    }

    public void CompleteWakeUp()
    {
        _isWakingUp = false;
        flashlightOn = true;
        if (flashlight != null)
        {
            flashlight.enabled = true;
            Transform fill = flashlight.transform.Find("Flashlight_Fill");
            if (fill != null)
            {
                Light fl = fill.GetComponent<Light>();
                if (fl != null) fl.enabled = true;
            }
        }
        _pitch = 0f;
    }

    public bool isGameWon { get; set; } = false;

    private void Update()
    {
        if (_isWakingUp || _isUnderJumpscare || isGameWon)
        {
            return;
        }

        HandleMouse();
        HandleMovement();
        HandleFlashlight();
    }

    private void HandleMouse()
    {
        // Jika kacamata VR aktif, orientasi pandangan dikendalikan langsung oleh headset VR
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled) return;

        float mouseX = 0f;
        float mouseY = 0f;

#if ENABLE_INPUT_SYSTEM
        if (Mouse.current != null)
        {
            Vector2 delta = Mouse.current.delta.ReadValue();
            mouseX = delta.x * mouseSensitivity;
            mouseY = delta.y * mouseSensitivity;

            if (Mouse.current.leftButton.wasPressedThisFrame && Cursor.lockState != CursorLockMode.Locked)
            {
                Cursor.lockState = CursorLockMode.Locked;
                Cursor.visible = false;
            }
        }
        if (Keyboard.current != null && Keyboard.current.escapeKey.wasPressedThisFrame)
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
#else
        mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * 10f;
        mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * 10f;

        if (Input.GetMouseButtonDown(0) && Cursor.lockState != CursorLockMode.Locked)
        {
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
#endif

        if (Cursor.lockState != CursorLockMode.Locked) return;

        transform.Rotate(Vector3.up * mouseX);

        _pitch -= mouseY;
        _pitch = Mathf.Clamp(_pitch, -80f, 80f);

        if (cameraTransform != null)
        {
            cameraTransform.localRotation = Quaternion.Euler(_pitch, 0f, 0f);
        }
    }

    private void HandleMovement()
    {
        if (_controller == null) return;

        float h = 0f;
        float v = 0f;
        bool jump = false;
        bool isShiftPressed = false;

#if ENABLE_INPUT_SYSTEM
        if (Keyboard.current != null)
        {
            if (Keyboard.current.wKey.isPressed || Keyboard.current.upArrowKey.isPressed) v += 1f;
            if (Keyboard.current.sKey.isPressed || Keyboard.current.downArrowKey.isPressed) v -= 1f;
            if (Keyboard.current.dKey.isPressed || Keyboard.current.rightArrowKey.isPressed) h += 1f;
            if (Keyboard.current.aKey.isPressed || Keyboard.current.leftArrowKey.isPressed) h -= 1f;
            if (Keyboard.current.spaceKey.wasPressedThisFrame) jump = true;
            isShiftPressed = Keyboard.current.leftShiftKey.isPressed || Keyboard.current.rightShiftKey.isPressed;
        }
#else
        h = Input.GetAxisRaw("Horizontal");
        v = Input.GetAxisRaw("Vertical");
        jump = Input.GetButtonDown("Jump");
        isShiftPressed = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
#endif

        // Integrasi Input Joystick VR (Continuous Move & Snap Turn) jika VR aktif
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
        {
            // 1. Joystick Tangan Kiri: Bergerak Maju, Mundur, dan Samping (Locomotion)
            UnityEngine.XR.InputDevice leftDev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.LeftHand);
            if (leftDev.isValid)
            {
                if (leftDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 vrStick) && vrStick.sqrMagnitude > 0.04f)
                {
                    h = vrStick.x;
                    v = vrStick.y;
                }
                if (leftDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxisClick, out bool cClick) && cClick) isShiftPressed = true;
                if (leftDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.trigger, out float cTrig) && cTrig > 0.5f) isShiftPressed = true;
            }

            // 2. Joystick Tangan Kanan: Snap Turn 45 derajat (mencegah mual)
            UnityEngine.XR.InputDevice rightDev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.RightHand);
            if (rightDev.isValid && _vrSnapCooldown <= 0f)
            {
                if (rightDev.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 turnStick))
                {
                    if (Mathf.Abs(turnStick.x) > 0.65f)
                    {
                        float snapAngle = (turnStick.x > 0f) ? 45.0f : -45.0f;
                        transform.Rotate(Vector3.up * snapAngle);
                        _vrSnapCooldown = 0.35f;
                    }
                }
            }
            if (_vrSnapCooldown > 0f) _vrSnapCooldown -= Time.deltaTime;
        }

        bool isGrounded = _controller.isGrounded;
        if (isGrounded && _velocity.y < 0f)
        {
            _velocity.y = -2f;
        }

        // Logika Sprint & Stamina
        bool isMoving = (h != 0f || v != 0f);
        bool wantsToSprint = isShiftPressed && isMoving && isGrounded && (currentStamina > 0.5f);

        if (wantsToSprint)
        {
            _isSprinting = true;
            currentStamina -= staminaDrainRate * Time.deltaTime;
            if (currentStamina < 0f) currentStamina = 0f;
            _regenTimer = staminaRegenDelay;
        }
        else
        {
            _isSprinting = false;
            if (_regenTimer > 0f)
            {
                _regenTimer -= Time.deltaTime;
            }
            else if (currentStamina < maxStamina)
            {
                currentStamina += staminaRegenRate * Time.deltaTime;
                if (currentStamina > maxStamina) currentStamina = maxStamina;
            }
        }

        float currentSpeed = _isSprinting ? sprintSpeed : moveSpeed;
        Vector3 fwd = (cameraTransform != null && VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
            ? Vector3.ProjectOnPlane(cameraTransform.forward, Vector3.up).normalized
            : transform.forward;
        Vector3 rgt = (cameraTransform != null && VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
            ? Vector3.ProjectOnPlane(cameraTransform.right, Vector3.up).normalized
            : transform.right;

        Vector3 move = (rgt * h + fwd * v).normalized;
        _controller.Move(move * (currentSpeed * Time.deltaTime));

        if (jump && isGrounded)
        {
            _velocity.y = Mathf.Sqrt(jumpHeight * -2.0f * gravity);
        }

        _velocity.y += gravity * Time.deltaTime;
        _controller.Move(_velocity * Time.deltaTime);

        // Failsafe jika jatuh dari pelataran
        if (transform.position.y < -15f)
        {
            _velocity = Vector3.zero;
            PosisikanDiDepanGerbang();
        }
    }

    private void OnGUI()
    {
        if (!showStaminaBar) return;
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled) return;

        // Auto-hide: bar muncul halus saat lari atau stamina berkurang, dan menghilang halus saat penuh 100%
        float targetAlpha = (autoHideStaminaBar && currentStamina >= maxStamina - 0.5f && !_isSprinting) ? 0f : 1f;
        _staminaBarAlpha = Mathf.MoveTowards(_staminaBarAlpha, targetAlpha, Time.deltaTime * 3.5f);

        if (_staminaBarAlpha <= 0.01f) return;

        float barWidth = 220f;
        float barHeight = 12f;
        float x = (Screen.width - barWidth) * 0.5f;   // Posisi tengah bawah layar
        float y = Screen.height - 35f;

        Color originalColor = GUI.color;

        // Background bar (hitam transparan lembut)
        GUI.color = new Color(0.08f, 0.08f, 0.08f, 0.65f * _staminaBarAlpha);
        GUI.DrawTexture(new Rect(x - 2, y - 2, barWidth + 4, barHeight + 4), Texture2D.whiteTexture);

        // Fill bar (gradasi warna alami: hijau -> kuning -> merah saat stamina menipis)
        float pct = Mathf.Clamp01(currentStamina / maxStamina);
        Color fillColor = pct > 0.5f
            ? Color.Lerp(new Color(0.95f, 0.85f, 0.2f), new Color(0.2f, 0.85f, 0.35f), (pct - 0.5f) * 2f)
            : Color.Lerp(new Color(0.9f, 0.25f, 0.2f), new Color(0.95f, 0.85f, 0.2f), pct * 2f);
        fillColor.a = 0.9f * _staminaBarAlpha;

        GUI.color = fillColor;
        GUI.DrawTexture(new Rect(x, y, barWidth * pct, barHeight), Texture2D.whiteTexture);

        GUI.color = originalColor;

        // Indikator Senter di pojok kiri bawah
        GUI.color = new Color(0.9f, 0.9f, 0.9f, 0.7f);
        GUI.Label(new Rect(20, Screen.height - 35, 200, 25), "[F] Senter: " + (flashlightOn ? "ON" : "OFF"));
        GUI.color = originalColor;
    }
}
