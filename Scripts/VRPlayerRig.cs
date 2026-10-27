using UnityEngine;
using UnityEngine.XR;
using Unity.XR.CoreUtils;
using InputDevice = UnityEngine.XR.InputDevice;
using CommonUsages = UnityEngine.XR.CommonUsages;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.XR;
#endif

public class VRPlayerRig : MonoBehaviour
{
    public static VRPlayerRig Instance { get; private set; }

    [Header("Status VR")]
    public bool isVREnabled = false;
    public bool autoDetectVR = true;

    [Header("Referensi Rig")]
    public XROrigin xrOrigin;
    public Transform cameraOffset;
    public Transform headCamera;
    public Transform leftHandAnchor;
    public Transform rightHandAnchor;

    [Header("Visual Controller & Senter")]
    public GameObject leftHandVisual;
    public GameObject rightHandVisual;
    public LineRenderer rightHandLaser;
    public Transform vrFlashlightMount;

    [Header("Pengaturan Turn VR")]
    public float snapTurnAngle = 45.0f;
    public float snapTurnCooldown = 0.35f;
    private float _snapCooldownTimer = 0f;

    private PlayerController _playerController;
    private PlayerInventory _inventory;
    private CharacterController _characterController;

    private void Awake()
    {
        Instance = this;
        _playerController = GetComponent<PlayerController>();
        _inventory = GetComponent<PlayerInventory>();
        _characterController = GetComponent<CharacterController>();

        CheckAndSetupVR();
    }

    public void CheckAndSetupVR()
    {
        if (autoDetectVR)
        {
            isVREnabled = XRSettings.isDeviceActive || (XRSettings.loadedDeviceName != null && XRSettings.loadedDeviceName.Length > 0);
        }

        SetupRigHierarchy();
    }

    private void SetupRigHierarchy()
    {
        // 1. Setup Camera Offset terlebih dahulu agar XROrigin menemukannya secara otomatis di Awake
        Transform camOffset = transform.Find("Camera Offset");
        if (camOffset == null)
        {
            GameObject offsetObj = new GameObject("Camera Offset");
            offsetObj.transform.SetParent(transform, false);
            offsetObj.transform.localPosition = new Vector3(0f, 0f, 0f);
            camOffset = offsetObj.transform;
        }
        cameraOffset = camOffset;

        // 2. Pastikan Main Camera ada di dalam Camera Offset dan memiliki TrackedPoseDriver
        Camera cam = GetComponentInChildren<Camera>();
        if (cam == null) cam = Camera.main;
        if (cam != null)
        {
            headCamera = cam.transform;
            if (headCamera.parent != cameraOffset)
            {
                headCamera.SetParent(cameraOffset, true);
            }

            // Tambahkan TrackedPoseDriver untuk HMD
#if ENABLE_INPUT_SYSTEM
            TrackedPoseDriver tpd = headCamera.GetComponent<TrackedPoseDriver>();
            if (tpd == null)
            {
                tpd = headCamera.gameObject.AddComponent<TrackedPoseDriver>();
                tpd.trackingType = TrackedPoseDriver.TrackingType.RotationAndPosition;
            }
            // Aktifkan hanya jika di mode VR agar tidak mengganggu kontrol mouse di PC
            tpd.enabled = isVREnabled;
#endif
        }

        // 3. Dapatkan atau buat XROrigin setelah Camera Offset dan Kamera siap
        xrOrigin = GetComponent<XROrigin>();
        if (xrOrigin == null)
        {
            xrOrigin = gameObject.AddComponent<XROrigin>();
        }
        xrOrigin.CameraFloorOffsetObject = camOffset.gameObject;
        if (cam != null) xrOrigin.Camera = cam;

        // 4. Buat Left Hand Anchor
        Transform leftA = cameraOffset.Find("Left Hand Anchor");
        if (leftA == null)
        {
            GameObject lObj = new GameObject("Left Hand Anchor");
            lObj.transform.SetParent(cameraOffset, false);
            lObj.transform.localPosition = new Vector3(-0.25f, -0.1f, 0.4f);
            leftA = lObj.transform;
        }
        leftHandAnchor = leftA;

        // 5. Buat Right Hand Anchor
        Transform rightA = cameraOffset.Find("Right Hand Anchor");
        if (rightA == null)
        {
            GameObject rObj = new GameObject("Right Hand Anchor");
            rObj.transform.SetParent(cameraOffset, false);
            rObj.transform.localPosition = new Vector3(0.25f, -0.1f, 0.4f);
            rightA = rObj.transform;
        }
        rightHandAnchor = rightA;

        // 6. Buat Visual Controller Sederhana
        SetupHandVisuals();

        // 7. Jika di mode VR, pasangkan Senter ke Tangan Kanan
        if (isVREnabled)
        {
            AttachFlashlightToRightHand();
        }
    }

    private void SetupHandVisuals()
    {
        if (leftHandVisual == null && leftHandAnchor != null)
        {
            Transform v = leftHandAnchor.Find("Left_Hand_Model");
            if (v == null)
            {
                GameObject mesh = GameObject.CreatePrimitive(PrimitiveType.Cube);
                mesh.name = "Left_Hand_Model";
                mesh.transform.SetParent(leftHandAnchor, false);
                mesh.transform.localPosition = Vector3.zero;
                mesh.transform.localScale = new Vector3(0.06f, 0.05f, 0.12f);
                Collider c = mesh.GetComponent<Collider>();
                if (c != null) c.isTrigger = true;
                v = mesh.transform;
            }
            leftHandVisual = v.gameObject;
        }

        if (rightHandVisual == null && rightHandAnchor != null)
        {
            Transform v = rightHandAnchor.Find("Right_Hand_Model");
            if (v == null)
            {
                GameObject mesh = GameObject.CreatePrimitive(PrimitiveType.Cube);
                mesh.name = "Right_Hand_Model";
                mesh.transform.SetParent(rightHandAnchor, false);
                mesh.transform.localPosition = Vector3.zero;
                mesh.transform.localScale = new Vector3(0.06f, 0.05f, 0.12f);
                Collider c = mesh.GetComponent<Collider>();
                if (c != null) c.isTrigger = true;
                v = mesh.transform;
            }
            rightHandVisual = v.gameObject;

            // Tambahkan Laser Pointer ke tangan kanan untuk interaksi
            Transform laserT = rightHandAnchor.Find("Right_Laser_Pointer");
            if (laserT == null)
            {
                GameObject lObj = new GameObject("Right_Laser_Pointer");
                lObj.transform.SetParent(rightHandAnchor, false);
                rightHandLaser = lObj.AddComponent<LineRenderer>();
                rightHandLaser.startWidth = 0.005f;
                rightHandLaser.endWidth = 0.002f;
                rightHandLaser.positionCount = 2;
                rightHandLaser.material = new Material(Shader.Find("Universal Render Pipeline/Unlit") ?? Shader.Find("Sprites/Default"));
                rightHandLaser.startColor = new Color(0.95f, 0.85f, 0.35f, 0.6f);
                rightHandLaser.endColor = new Color(0.95f, 0.85f, 0.35f, 0.05f);
            }
            else
            {
                rightHandLaser = laserT.GetComponent<LineRenderer>();
            }
        }
    }

    public void AttachFlashlightToRightHand()
    {
        if (rightHandAnchor == null) return;

        // Cari Spotlight_Senter di pemain
        Transform flT = null;
        if (headCamera != null) flT = headCamera.Find("Spotlight_Senter");
        if (flT == null) flT = transform.Find("Spotlight_Senter");

        if (flT != null)
        {
            flT.SetParent(rightHandAnchor, false);
            flT.localPosition = new Vector3(0f, 0.02f, 0.08f);
            flT.localRotation = Quaternion.identity;
            vrFlashlightMount = flT;
            Debug.Log("[VRPlayerRig] Spotlight_Senter berhasil dipasang ke Tangan Kanan VR!");
        }
    }

    private void Update()
    {
        // Update status deteksi jika device baru dinyalakan
        if (!isVREnabled && XRSettings.isDeviceActive)
        {
            isVREnabled = true;
            AttachFlashlightToRightHand();
        }

        if (!isVREnabled) return;

        UpdateVRPoses();
        UpdateVRMovement();
        UpdateVRInteractions();
    }

    private void UpdateVRPoses()
    {
        // 1. Update Posisi & Rotasi Tangan Kiri
        InputDevice leftDevice = InputDevices.GetDeviceAtXRNode(XRNode.LeftHand);
        if (leftDevice.isValid && leftHandAnchor != null)
        {
            if (leftDevice.TryGetFeatureValue(CommonUsages.devicePosition, out Vector3 lPos))
                leftHandAnchor.localPosition = lPos;
            if (leftDevice.TryGetFeatureValue(CommonUsages.deviceRotation, out Quaternion lRot))
                leftHandAnchor.localRotation = lRot;
        }

        // 2. Update Posisi & Rotasi Tangan Kanan
        InputDevice rightDevice = InputDevices.GetDeviceAtXRNode(XRNode.RightHand);
        if (rightDevice.isValid && rightHandAnchor != null)
        {
            if (rightDevice.TryGetFeatureValue(CommonUsages.devicePosition, out Vector3 rPos))
                rightHandAnchor.localPosition = rPos;
            if (rightDevice.TryGetFeatureValue(CommonUsages.deviceRotation, out Quaternion rRot))
                rightHandAnchor.localRotation = rRot;
        }

        // 3. Update Laser Pointer Tangan Kanan
        if (rightHandLaser != null && rightHandAnchor != null)
        {
            Vector3 start = rightHandAnchor.position;
            Vector3 forward = rightHandAnchor.forward;
            RaycastHit hit;
            float maxDist = 6.0f;
            Vector3 end = start + forward * maxDist;

            bool isHoveringInteractive = false;
            if (Physics.Raycast(start, forward, out hit, maxDist))
            {
                end = hit.point;
                if (hit.collider != null)
                {
                    if (hit.collider.GetComponentInParent<KeyPickup>() != null ||
                        hit.collider.GetComponentInParent<LockedGate>() != null ||
                        hit.collider.GetComponentInParent<UnityEngine.UI.Button>() != null)
                    {
                        isHoveringInteractive = true;
                    }
                }
            }

            Color laserCol = isHoveringInteractive ? new Color(0.35f, 0.98f, 0.45f, 0.85f) : new Color(0.95f, 0.85f, 0.35f, 0.5f);
            rightHandLaser.startColor = laserCol;
            rightHandLaser.endColor = new Color(laserCol.r, laserCol.g, laserCol.b, 0.05f);

            rightHandLaser.SetPosition(0, start);
            rightHandLaser.SetPosition(1, end);
        }
    }

    private void UpdateVRMovement()
    {
        if (_playerController == null || _playerController.isGameWon || _playerController.isWakingUp) return;

        // Baca Joystick Tangan Kiri untuk Locomotion Jalan / Lari
        InputDevice leftDevice = InputDevices.GetDeviceAtXRNode(XRNode.LeftHand);
        if (leftDevice.isValid)
        {
            if (leftDevice.TryGetFeatureValue(CommonUsages.primary2DAxis, out Vector2 moveStick))
            {
                if (moveStick.sqrMagnitude > 0.05f && headCamera != null)
                {
                    Vector3 forward = headCamera.forward;
                    forward.y = 0f;
                    forward.Normalize();

                    Vector3 right = headCamera.right;
                    right.y = 0f;
                    right.Normalize();

                    Vector3 moveDir = (forward * moveStick.y + right * moveStick.x);

                    // Periksa sprint jika thumbstick ditekan (click) atau trigger kiri ditarik
                    bool isSprinting = false;
                    if (leftDevice.TryGetFeatureValue(CommonUsages.primary2DAxisClick, out bool click) && click) isSprinting = true;
                    if (leftDevice.TryGetFeatureValue(CommonUsages.trigger, out float trigVal) && trigVal > 0.5f) isSprinting = true;

                    float speed = isSprinting ? _playerController.sprintSpeed : _playerController.moveSpeed;
                    if (isSprinting)
                    {
                        _playerController.currentStamina = Mathf.Max(0f, _playerController.currentStamina - _playerController.staminaDrainRate * Time.deltaTime);
                        if (_playerController.currentStamina <= 0f) speed = _playerController.moveSpeed;
                    }

                    if (_characterController != null && _characterController.enabled)
                    {
                        _characterController.Move(moveDir * (speed * Time.deltaTime));
                    }
                }
            }
        }

        // Baca Joystick Tangan Kanan untuk Snap Turn (Memutar Badan VR)
        if (_snapCooldownTimer > 0f) _snapCooldownTimer -= Time.deltaTime;

        InputDevice rightDevice = InputDevices.GetDeviceAtXRNode(XRNode.RightHand);
        if (rightDevice.isValid && _snapCooldownTimer <= 0f)
        {
            if (rightDevice.TryGetFeatureValue(CommonUsages.primary2DAxis, out Vector2 turnStick))
            {
                if (Mathf.Abs(turnStick.x) > 0.65f)
                {
                    float angle = (turnStick.x > 0f) ? snapTurnAngle : -snapTurnAngle;
                    transform.Rotate(Vector3.up * angle);
                    _snapCooldownTimer = snapTurnCooldown;
                }
            }
        }
    }

    private void UpdateVRInteractions()
    {
        InputDevice rightDevice = InputDevices.GetDeviceAtXRNode(XRNode.RightHand);
        if (!rightDevice.isValid) return;

        // 1. Toggle Senter dengan Tombol Primary (A/X)
        if (rightDevice.TryGetFeatureValue(CommonUsages.primaryButton, out bool primaryPressed))
        {
            // Periksa edge trigger untuk tombol senter
            if (primaryPressed && !_wasPrimaryPressed)
            {
                if (_playerController != null && _playerController.flashlight != null)
                {
                    _playerController.flashlightOn = !_playerController.flashlightOn;
                    _playerController.flashlight.enabled = _playerController.flashlightOn;
                }
            }
            _wasPrimaryPressed = primaryPressed;
        }

        // 2. Interaksi Ambil Kunci atau Buka Gerbang dengan Trigger / Grip Tangan Kanan
        bool triggerPressed = false;
        if (rightDevice.TryGetFeatureValue(CommonUsages.triggerButton, out bool trg) && trg) triggerPressed = true;
        if (rightDevice.TryGetFeatureValue(CommonUsages.gripButton, out bool grp) && grp) triggerPressed = true;

        if (triggerPressed && !_wasTriggerPressed && rightHandAnchor != null)
        {
            RaycastHit hit;
            if (Physics.Raycast(rightHandAnchor.position, rightHandAnchor.forward, out hit, 6.0f))
            {
                // 1. Klik Tombol UI 3D (Main Lagi / Keluar Game)
                UnityEngine.UI.Button btn = hit.collider.GetComponentInParent<UnityEngine.UI.Button>();
                if (btn != null)
                {
                    btn.onClick.Invoke();
                    rightDevice.SendHapticImpulse(0, 0.75f, 0.18f);
                }

                // 2. Ambil Kunci
                KeyPickup key = hit.collider.GetComponentInParent<KeyPickup>();
                if (key != null)
                {
                    key.CollectKey(isVR: true, isRightHand: true);
                }

                // 3. Buka Gerbang
                LockedGate gate = hit.collider.GetComponentInParent<LockedGate>();
                if (gate != null)
                {
                    if (!gate.isUnlocked)
                    {
                        gate.TryUnlockGate();
                    }
                    else
                    {
                        gate.TriggerEscapeEnding();
                    }
                    rightDevice.SendHapticImpulse(0, 0.9f, 0.35f);
                }
            }
        }
        _wasTriggerPressed = triggerPressed;
    }

    private bool _wasPrimaryPressed = false;
    private bool _wasTriggerPressed = false;
}
