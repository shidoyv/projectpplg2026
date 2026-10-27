using UnityEngine;

public class KeyPickup : MonoBehaviour
{
    [Header("Identitas Kunci")]
    public KeyType keyType = KeyType.Ruby;
    public string namaKunci = "Kunci Kuningan Kuno";
    public string lokasiKunci = "Rumah Joglo Dukun (Barat Laut)";
    public float interactionDistance = 2.4f;

    private Transform _playerTransform;
    private PlayerInventory _inventory;
    private Vector3 _startPosition;
    private bool _isCollected = false;

    private void Start()
    {
        _startPosition = transform.position;

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
        if (_isCollected) return;

        // Animasi melayang & berputar anggun di atas altar rumah joglo
        transform.Rotate(Vector3.up * (50f * Time.deltaTime), Space.World);
        float bobbing = Mathf.Sin(Time.time * 2.2f) * 0.08f;
        transform.position = _startPosition + new Vector3(0f, bobbing, 0f);

        // 1. VR Direct Grab: Deteksi jika tangan virtual VR mendekat ke kunci (< 0.45m)
        if (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled)
        {
            Transform rHand = VRPlayerRig.Instance.rightHandAnchor;
            if (rHand != null && Vector3.Distance(transform.position, rHand.position) <= 0.45f)
            {
                CollectKey(isVR: true, isRightHand: true);
                return;
            }
            Transform lHand = VRPlayerRig.Instance.leftHandAnchor;
            if (lHand != null && Vector3.Distance(transform.position, lHand.position) <= 0.45f)
            {
                CollectKey(isVR: true, isRightHand: false);
                return;
            }
        }

        // 2. Ambil jika pemain PC mendekat
        if (_playerTransform != null)
        {
            float dist = Vector3.Distance(transform.position, _playerTransform.position);
            if (dist <= interactionDistance)
            {
                CollectKey();
            }
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (_isCollected) return;
        if (other.CompareTag("Player") || other.name == "Player" || other.name.Contains("Hand"))
        {
            CollectKey(isVR: other.name.Contains("Hand"));
        }
    }

    public void CollectKey(bool isVR = false, bool isRightHand = true)
    {
        if (_isCollected) return;
        _isCollected = true;

        // Berikan getaran haptik (rumble feedback) ke kontroler VR saat mengambil kunci
        if (isVR || (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled))
        {
            UnityEngine.XR.XRNode node = isRightHand ? UnityEngine.XR.XRNode.RightHand : UnityEngine.XR.XRNode.LeftHand;
            UnityEngine.XR.InputDevice dev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(node);
            if (dev.isValid) dev.SendHapticImpulse(0, 0.85f, 0.25f);
        }

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

        if (_inventory != null)
        {
            _inventory.AddKey(keyType);
            int count = _inventory.GetKeyCount();
            string countMsg = count >= 3 ? "SEMUA 3 KUNCI TERKUMPUL!" : $"{count}/3 Kunci";
            _inventory.ShowNotification($"🔑 {namaKunci.ToUpper()} DITEMUKAN! ({countMsg})\n{lokasiKunci}");
        }

        // Suara lonceng kuno mistis naik nada saat kunci diambil
        AudioSource.PlayClipAtPoint(CreatePickupSound(), transform.position, 1.0f);

        Destroy(gameObject);
    }

    private static AudioClip CreatePickupSound()
    {
        int sampleRate = 44100;
        int sampleCount = sampleRate / 3; // 0.33 detik
        AudioClip clip = AudioClip.Create("KeyPickupTone", sampleCount, 1, sampleRate, false);
        float[] samples = new float[sampleCount];
        for (int i = 0; i < sampleCount; i++)
        {
            float t = (float)i / sampleRate;
            float freq1 = 780f + (t * 500f);
            float freq2 = 1560f;
            float wave = Mathf.Sin(2f * Mathf.PI * freq1 * t) * 0.7f + Mathf.Sin(2f * Mathf.PI * freq2 * t) * 0.3f;
            float env = Mathf.Exp(-t * 8.5f);
            samples[i] = wave * env;
        }
        clip.SetData(samples, 0);
        return clip;
    }
}
