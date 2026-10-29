using System.Collections.Generic;
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
    private static Mesh _cachedRealisticKeyMesh;

    private void Awake()
    {
        EnsureRealisticKeyMesh();
    }

    private void OnValidate()
    {
        EnsureRealisticKeyMesh();
    }

    public void EnsureRealisticKeyMesh()
    {
        MeshFilter mf = GetComponent<MeshFilter>();
        if (mf == null)
        {
            mf = gameObject.AddComponent<MeshFilter>();
        }

        // Jika mesh belum terpasang atau masih menggunakan bola bulat (Sphere primitive),
        // otomatis ganti menjadi model kunci kuno realistis yang berornamen antik
        if (mf.sharedMesh == null || mf.sharedMesh.name == "Sphere" || mf.sharedMesh.name.Contains("Sphere"))
        {
            mf.sharedMesh = GetOrCreateRealisticKeyMesh();
        }

        // Sesuaikan collider agar interaksi nyaman
        SphereCollider sc = GetComponent<SphereCollider>();
        if (sc != null)
        {
            sc.radius = 0.65f;
            sc.center = new Vector3(0f, 0.05f, 0f);
        }
    }

    private void Start()
    {
        EnsureRealisticKeyMesh();
        _startPosition = transform.position;

        GameObject player = GameObject.FindWithTag("Player");
        if (player == null)
        {
            player = GameObject.Find("Player");
        }
        if (player != null)
        {
            _playerTransform = player.transform;
            _inventory = player.GetComponent<PlayerInventory>();
        }
    }

    private void Update()
    {
        if (_isCollected)
        {
            return;
        }

        // Animasi melayang & berputar anggun di atas meja/altar rumah joglo
        transform.Rotate(Vector3.up * (45f * Time.deltaTime), Space.World);
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
        if (_isCollected)
        {
            return;
        }
        if (other.CompareTag("Player") || other.name == "Player" || other.name.Contains("Hand"))
        {
            CollectKey(isVR: other.name.Contains("Hand"));
        }
    }

    public void CollectKey(bool isVR = false, bool isRightHand = true)
    {
        if (_isCollected)
        {
            return;
        }
        _isCollected = true;

        // Berikan getaran haptik (rumble feedback) ke kontroler VR saat mengambil kunci
        if (isVR || (VRPlayerRig.Instance != null && VRPlayerRig.Instance.isVREnabled))
        {
            UnityEngine.XR.XRNode node = isRightHand ? UnityEngine.XR.XRNode.RightHand : UnityEngine.XR.XRNode.LeftHand;
            UnityEngine.XR.InputDevice dev = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(node);
            if (dev.isValid)
            {
                dev.SendHapticImpulse(0, 0.85f, 0.25f);
            }
        }

        if (_inventory == null)
        {
            _inventory = PlayerInventory.Instance;
            if (_inventory == null)
            {
                GameObject p = GameObject.FindWithTag("Player");
                if (p == null)
                {
                    p = GameObject.Find("Player");
                }
                if (p != null)
                {
                    _inventory = p.GetComponent<PlayerInventory>();
                }
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

    /// <summary>
    /// Membuat model 3D kunci kuno (antique skeleton key) berornamen realistis lengkap dengan
    /// kepala lingkaran berornamen (bow), batang berkerah klasik (shaft), dan mata gerigi kuno (wards/teeth).
    /// </summary>
    public static Mesh GetOrCreateRealisticKeyMesh()
    {
        if (_cachedRealisticKeyMesh != null)
        {
            return _cachedRealisticKeyMesh;
        }

#if UNITY_EDITOR
        Mesh importedMesh = UnityEditor.AssetDatabase.LoadAssetAtPath<Mesh>("Assets/Models/Kunci_Kuno_Realistis.obj");
        if (importedMesh != null)
        {
            _cachedRealisticKeyMesh = importedMesh;
            return _cachedRealisticKeyMesh;
        }
#endif

        Mesh mesh = new Mesh();
        mesh.name = "Realistic_Antique_Skeleton_Key";

        List<Vector3> vertices = new List<Vector3>();
        List<Vector3> normals = new List<Vector3>();
        List<Vector2> uvs = new List<Vector2>();
        List<int> triangles = new List<int>();

        // 1. Torus Bow (Kepala Cincin Kunci di Atas)
        int segMajor = 28;
        int segMinor = 14;
        float bowCy = 0.40f;
        float majorR = 0.12f;
        float minorR = 0.024f;

        int[,] torusIndices = new int[segMajor, segMinor];

        for (int i = 0; i < segMajor; i++)
        {
            float theta = (i / (float)segMajor) * Mathf.PI * 2f;
            float cosT = Mathf.Cos(theta);
            float sinT = Mathf.Sin(theta);

            for (int j = 0; j < segMinor; j++)
            {
                float phi = (j / (float)segMinor) * Mathf.PI * 2f;
                float cosP = Mathf.Cos(phi);
                float sinP = Mathf.Sin(phi);

                float px = (majorR + minorR * cosP) * cosT;
                float py = bowCy + (majorR + minorR * cosP) * sinT;
                float pz = minorR * sinP;

                Vector3 norm = new Vector3(cosP * cosT, cosP * sinT, sinP).normalized;

                torusIndices[i, j] = vertices.Count;
                vertices.Add(new Vector3(px, py, pz));
                normals.Add(norm);
                uvs.Add(new Vector2((float)i / segMajor, (float)j / segMinor));
            }
        }

        for (int i = 0; i < segMajor; i++)
        {
            int iNext = (i + 1) % segMajor;
            for (int j = 0; j < segMinor; j++)
            {
                int jNext = (j + 1) % segMinor;
                int v0 = torusIndices[i, j];
                int v1 = torusIndices[iNext, j];
                int v2 = torusIndices[iNext, jNext];
                int v3 = torusIndices[i, jNext];

                triangles.Add(v0); triangles.Add(v1); triangles.Add(v2);
                triangles.Add(v0); triangles.Add(v2); triangles.Add(v3);
            }
        }

        // Helper untuk menambahkan kotak (box) ber-normal tajam & UV presisi
        void AddBox(float minX, float maxX, float minY, float maxY, float minZ, float maxZ)
        {
            void AddQuad(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, Vector3 normal)
            {
                int baseIdx = vertices.Count;
                vertices.Add(p0);
                vertices.Add(p1);
                vertices.Add(p2);
                vertices.Add(p3);

                normals.Add(normal);
                normals.Add(normal);
                normals.Add(normal);
                normals.Add(normal);

                uvs.Add(new Vector2(0f, 0f));
                uvs.Add(new Vector2(1f, 0f));
                uvs.Add(new Vector2(1f, 1f));
                uvs.Add(new Vector2(0f, 1f));

                triangles.Add(baseIdx + 0);
                triangles.Add(baseIdx + 1);
                triangles.Add(baseIdx + 2);

                triangles.Add(baseIdx + 0);
                triangles.Add(baseIdx + 2);
                triangles.Add(baseIdx + 3);
            }

            // Depan (+Z), Belakang (-Z), Atas (+Y), Bawah (-Y), Kanan (+X), Kiri (-X)
            AddQuad(new Vector3(minX, minY, maxZ), new Vector3(maxX, minY, maxZ), new Vector3(maxX, maxY, maxZ), new Vector3(minX, maxY, maxZ), Vector3.forward);
            AddQuad(new Vector3(maxX, minY, minZ), new Vector3(minX, minY, minZ), new Vector3(minX, maxY, minZ), new Vector3(maxX, maxY, minZ), Vector3.back);
            AddQuad(new Vector3(minX, maxY, maxZ), new Vector3(maxX, maxY, maxZ), new Vector3(maxX, maxY, minZ), new Vector3(minX, maxY, minZ), Vector3.up);
            AddQuad(new Vector3(minX, minY, minZ), new Vector3(maxX, minY, minZ), new Vector3(maxX, minY, maxZ), new Vector3(minX, minY, maxZ), Vector3.down);
            AddQuad(new Vector3(maxX, minY, maxZ), new Vector3(maxX, minY, minZ), new Vector3(maxX, maxY, minZ), new Vector3(maxX, maxY, maxZ), Vector3.right);
            AddQuad(new Vector3(minX, minY, minZ), new Vector3(minX, minY, maxZ), new Vector3(minX, maxY, maxZ), new Vector3(minX, maxY, minZ), Vector3.left);
        }

        // 2. Ornamen Salib/Bunga Klasik di Dalam Cincin Kepala Kunci
        AddBox(-0.085f, 0.085f, bowCy - 0.012f, bowCy + 0.012f, -0.012f, 0.012f);
        AddBox(-0.012f, 0.012f, bowCy - 0.085f, bowCy + 0.085f, -0.012f, 0.012f);
        AddBox(-0.030f, 0.030f, bowCy - 0.030f, bowCy + 0.030f, -0.016f, 0.016f);

        // 3. Batang Kunci (Shaft / Stem) dengan Kerah Dekoratif
        (float y, float r)[] shaftLevels = new (float, float)[]
        {
            (0.30f, 0.035f),   // Penghubung cincin kepala
            (0.27f, 0.045f),   // Cincin kerah atas
            (0.25f, 0.030f),   // Lekukan leher
            (0.23f, 0.040f),   // Cincin kerah kedua
            (0.21f, 0.022f),   // Batang utama atas
            (-0.10f, 0.022f),  // Batang tengah
            (-0.31f, 0.022f),  // Batang bawah
            (-0.34f, 0.026f),  // Tonjolan ujung batang
            (-0.37f, 0.002f)   // Ujung bulat bawah
        };

        int shaftSegs = 18;
        int[][] shaftRings = new int[shaftLevels.Length][];

        for (int l = 0; l < shaftLevels.Length; l++)
        {
            shaftRings[l] = new int[shaftSegs];
            float yVal = shaftLevels[l].y;
            float rVal = shaftLevels[l].r;

            for (int s = 0; s < shaftSegs; s++)
            {
                float angle = (s / (float)shaftSegs) * Mathf.PI * 2f;
                float ca = Mathf.Cos(angle);
                float sa = Mathf.Sin(angle);

                shaftRings[l][s] = vertices.Count;
                vertices.Add(new Vector3(rVal * ca, yVal, rVal * sa));
                normals.Add(new Vector3(ca, 0f, sa).normalized);
                uvs.Add(new Vector2((float)s / shaftSegs, (yVal + 0.37f) / 0.67f));
            }
        }

        for (int l = 0; l < shaftLevels.Length - 1; l++)
        {
            for (int s = 0; s < shaftSegs; s++)
            {
                int sNext = (s + 1) % shaftSegs;
                int v0 = shaftRings[l][s];
                int v1 = shaftRings[l][sNext];
                int v2 = shaftRings[l + 1][sNext];
                int v3 = shaftRings[l + 1][s];

                triangles.Add(v0); triangles.Add(v1); triangles.Add(v2);
                triangles.Add(v0); triangles.Add(v2); triangles.Add(v3);
            }
        }

        // 4. Mata Kunci Gerigi Antik (Wards / Bit)
        float tz = 0.010f; // Setengah ketebalan mata kunci
        // Batang punggung mata kunci
        AddBox(0.015f, 0.065f, -0.31f, -0.13f, -tz, tz);
        // Gerigi atas
        AddBox(0.065f, 0.145f, -0.17f, -0.13f, -tz, tz);
        // Lekukan tengah
        AddBox(0.065f, 0.115f, -0.21f, -0.17f, -tz, tz);
        // Gerigi tengah utama
        AddBox(0.065f, 0.150f, -0.26f, -0.22f, -tz, tz);
        // Gerigi bawah
        AddBox(0.065f, 0.135f, -0.31f, -0.28f, -tz, tz);

        mesh.SetVertices(vertices);
        mesh.SetNormals(normals);
        mesh.SetUVs(0, uvs);
        mesh.SetTriangles(triangles, 0);
        mesh.RecalculateBounds();

        _cachedRealisticKeyMesh = mesh;
        return _cachedRealisticKeyMesh;
    }
}
