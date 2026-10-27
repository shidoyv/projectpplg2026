using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
public static class CreatePlayerSpawner
{
    [MenuItem("Candi Borobudur/Atur Posisi Pemain/Walkway Masuk Selatan (Rekomendasi)")]
    public static void SetupPlayerAtCandiStairs()
    {
        SetupPlayerAndGround(new Vector3(0f, 1.5f, 48.0f), 180.0f, PlayerSpawnLocation.SouthMainEntrance, true);
    }

    [MenuItem("Candi Borobudur/Atur Posisi Pemain/Di Dekat Tangga Candi")]
    public static void SetupPlayerOnCandiTerrace()
    {
        SetupPlayerAndGround(new Vector3(0f, 1.5f, 30.0f), 180.0f, PlayerSpawnLocation.PelataranCandi, true);
    }

    [MenuItem("Candi Borobudur/Atur Posisi Pemain/Di Depan Gerbang Luar")]
    public static void SetupPlayerAtGate()
    {
        SetupPlayerAndGround(new Vector3(0f, 1.5f, 110.0f), 180.0f, PlayerSpawnLocation.GerbangLuar, true);
    }

    [MenuItem("Candi Borobudur/Atur Posisi Pemain di Depan Gerbang")]
    public static void SetupPlayerMenu()
    {
        SetupPlayerAtCandiStairs();
    }

    public static void SetupPlayerAndGround(bool showDialog)
    {
        SetupPlayerAndGround(new Vector3(0f, 1.5f, 48.0f), 180.0f, PlayerSpawnLocation.SouthMainEntrance, showDialog);
    }

    public static void SetupPlayerAndGround(Vector3 spawnPos, float rotY, PlayerSpawnLocation loc, bool showDialog)
    {
        Debug.Log($"<color=cyan>=== SETUP SPAWN PEMAIN DI {loc} ({spawnPos}) ===</color>");

        EnsureCleanColliders();

        GameObject player = GameObject.Find("Player");
        if (player == null)
        {
            player = new GameObject("Player");
            player.tag = "Player";
        }

        // Hapus SEMUA collider lain agar CharacterController bergerak bebas tanpa macet!
        Collider[] playerCols = player.GetComponents<Collider>();
        foreach (var c in playerCols)
        {
            if (c != null && !(c is CharacterController))
            {
                GameObject.DestroyImmediate(c);
            }
        }

        // Hapus MeshFilter dan MeshRenderer capsule bawaan jika ada agar tidak ada konflik
        MeshRenderer mr = player.GetComponent<MeshRenderer>();
        if (mr != null) GameObject.DestroyImmediate(mr);
        MeshFilter mf = player.GetComponent<MeshFilter>();
        if (mf != null) GameObject.DestroyImmediate(mf);

        CharacterController cc = player.GetComponent<CharacterController>();
        if (cc == null) cc = player.AddComponent<CharacterController>();
        cc.height = 1.8f;
        cc.radius = 0.35f;
        cc.center = new Vector3(0f, 0.9f, 0f);
        cc.stepOffset = 0.45f;
        cc.slopeLimit = 55.0f;
        cc.skinWidth = 0.08f;
        cc.minMoveDistance = 0f;

        // Teleportasi bersih ke titik spawn yang dipilih menghadap lurus ke Candi Borobudur (rotasi 0)
        cc.enabled = false;
        player.transform.position = spawnPos;
        player.transform.rotation = Quaternion.Euler(0f, rotY, 0f);
        cc.enabled = true;

        FirstPersonMovement fpm = player.GetComponent<FirstPersonMovement>();
        if (fpm == null) fpm = player.AddComponent<FirstPersonMovement>();
        fpm.walkSpeed = 5.5f;
        fpm.sprintSpeed = 9.5f;
        fpm.mouseSensitivity = 2.5f;
        fpm.cameraFarClip = 400.0f;
        fpm.spawnLocation = loc;
        fpm.spawnPosition = spawnPos;
        fpm.spawnRotationY = rotY;
        fpm.enforceSpawnOnStart = true;

        PlayerInventory inv = player.GetComponent<PlayerInventory>();
        if (inv == null) inv = player.AddComponent<PlayerInventory>();

        // Setup Kamera
        Camera mainCam = Camera.main;
        if (mainCam == null)
        {
            mainCam = player.GetComponentInChildren<Camera>();
        }
        if (mainCam == null)
        {
            GameObject camObj = new GameObject("Main Camera");
            mainCam = camObj.AddComponent<Camera>();
            camObj.AddComponent<AudioListener>();
        }

        mainCam.transform.SetParent(player.transform);
        mainCam.transform.localPosition = new Vector3(0f, 1.6f, 0.2f);
        mainCam.transform.localRotation = Quaternion.identity;
        mainCam.tag = "MainCamera";
        mainCam.nearClipPlane = 0.1f;
        mainCam.farClipPlane = 400.0f; // Jarak pandang luas 400m agar seluruh pelataran candi terlihat tanpa terpotong
        mainCam.clearFlags = CameraClearFlags.Skybox;
        mainCam.depth = 100f;

        fpm.cameraTransform = mainCam.transform;

        // Setup Senter
        Transform existingFlashlight = mainCam.transform.Find("Spotlight_Senter");
        GameObject flashlightObj;
        if (existingFlashlight == null)
        {
            flashlightObj = new GameObject("Spotlight_Senter");
            flashlightObj.transform.SetParent(mainCam.transform);
            flashlightObj.transform.localPosition = new Vector3(0.18f, -0.15f, 0.25f);
            flashlightObj.transform.localRotation = Quaternion.identity;
        }
        else
        {
            flashlightObj = existingFlashlight.gameObject;
        }

        bool isURP = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline != null;
        float spotInt = isURP ? 2500.0f : 8.5f;

        Light spot = flashlightObj.GetComponent<Light>();
        if (spot == null) spot = flashlightObj.AddComponent<Light>();
        spot.type = LightType.Spot;
        spot.range = 100.0f;
        spot.spotAngle = 72.0f;
        spot.innerSpotAngle = 38.0f;
        spot.color = new Color(1.0f, 0.97f, 0.90f);
        spot.intensity = spotInt;
        spot.shadows = LightShadows.None;

        flashlightObj.transform.localRotation = Quaternion.Euler(3.5f, 0f, 0f);

        FlashlightController flCtrl = flashlightObj.GetComponent<FlashlightController>();
        if (flCtrl == null) flCtrl = flashlightObj.AddComponent<FlashlightController>();
        flCtrl.flashlight = spot;
        flCtrl.range = 100.0f;
        flCtrl.normalIntensity = spotInt;
        flCtrl.spotAngle = 72.0f;
        flCtrl.innerSpotAngle = 38.0f;
        flCtrl.enforcePitchBlackAtRuntime = true;
        flCtrl.isOn = true;

        EnsureCourtyardGround();
        EnsureGateLanterns();
        FlashlightController.ApplyHorrorAtmosphere();

        EditorUtility.SetDirty(player);
        EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
        Debug.Log($"<color=green>✅ Player berhasil dikonfigurasi di {loc} ({spawnPos}) menghadap langsung ke Candi Borobudur!</color>");

        if (showDialog)
        {
            EditorUtility.DisplayDialog("Sukses", $"Player berhasil disetel di {loc}!\n\nPosisi: {spawnPos}\n\n1. Klik Play\n2. Candi Borobudur akan langsung berdiri megah tepat di depan mata Anda!\n3. Gunakan WASD untuk berjalan/menaiki tangga candi, Shift lari, Spasi lompat, Mouse melihat sekeliling, F senter.", "Siap!");
        }
    }

    public static void EnsureGateLanterns()
    {
        // Lentera Pilar Kiri Gerbang (Z = -66, X = -4.2)
        SetupSingleLantern("Lentera_Pilar_Kiri", new Vector3(-4.2f, 2.5f, -66.0f));
        // Lentera Pilar Kanan Gerbang (Z = -66, X = 4.2)
        SetupSingleLantern("Lentera_Pilar_Kanan", new Vector3(4.2f, 2.5f, -66.0f));
    }

    private static void SetupSingleLantern(string name, Vector3 pos)
    {
        GameObject lantern = GameObject.Find(name);
        if (lantern == null)
        {
            lantern = new GameObject(name);
        }
        lantern.transform.position = pos;

        Light l = lantern.GetComponent<Light>();
        if (l == null) l = lantern.AddComponent<Light>();
        l.type = LightType.Point;
        l.color = new Color(1.0f, 0.65f, 0.25f);
        l.intensity = 3.5f;
        l.range = 14.0f;
        l.shadows = LightShadows.Soft;
    }

    public static void EnsureCleanColliders()
    {
        // 1. Matikan objek Horror_Moon quad putih yang menutupi candi
        GameObject moon = GameObject.Find("Horror_Moon");
        if (moon != null) moon.SetActive(false);

        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi == null) candi = GameObject.Find("Candi_Borobudur");

        if (candi != null)
        {
            Collider[] existingColliders = candi.GetComponentsInChildren<Collider>(true);
            int removedFoliage = 0;

            foreach (var col in existingColliders)
            {
                string n = col.gameObject.name;
                if (n.Contains("Foliage") || n.Contains("Leaf") || n.Contains("Leaves") || n.Contains("Branch"))
                {
                    GameObject.DestroyImmediate(col);
                    removedFoliage++;
                }
            }

            if (removedFoliage > 0)
            {
                Debug.Log($"<color=yellow>Menghapus {removedFoliage} collider daun/ranting yang sempat menjebak pemain!</color>");
            }

            // 2. Geser pohon yang berdiri tepat di lorong jalan utama ke candi
            Transform[] children = candi.GetComponentsInChildren<Transform>(true);
            foreach (Transform t in children)
            {
                if (t != null && t != candi.transform && (t.name.Contains("Tree") || t.name.Contains("Pohon")))
                {
                    Vector3 pos = t.position;
                    if (Mathf.Abs(pos.x) < 4.5f && pos.z > -66f && pos.z < -10f)
                    {
                        float newX = (pos.x >= 0f) ? 6.2f : -6.2f;
                        t.position = new Vector3(newX, pos.y, pos.z);
                    }
                }
            }
        }
    }

    public static void EnsureCourtyardGround()
    {
        GameObject ground = GameObject.Find("Courtyard_Ground");
        if (ground != null)
        {
            GameObject.DestroyImmediate(ground);
        }

        // Buat Plane datar pelataran 350x350 meter
        ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
        ground.name = "Courtyard_Ground";
        ground.transform.position = new Vector3(0f, -0.05f, 0f);
        ground.transform.rotation = Quaternion.identity;
        ground.transform.localScale = new Vector3(35f, 1f, 35f); // 350 x 350 meter

        // Hapus MeshCollider bawaan dan gunakan BoxCollider tebal 1 meter di BAWAH permukaan
        Collider mc = ground.GetComponent<Collider>();
        if (mc != null) GameObject.DestroyImmediate(mc);

        BoxCollider bc = ground.AddComponent<BoxCollider>();
        // Ukuran lokal: 10 * 35 = 350 meter X dan Z, 1 meter tebal Y
        bc.size = new Vector3(10f, 1.0f, 10f);
        bc.center = new Vector3(0f, -0.5f, 0f); // Tepat di bawah permukaan (Y = -0.05 s/d -1.05)

        Material matTanah = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Tanah_Pelataran.mat");
        if (matTanah != null)
        {
            ground.GetComponent<MeshRenderer>().sharedMaterial = matTanah;
        }

        Debug.Log("<color=green>✅ Pijakan tanah pelataran candi (Courtyard_Ground) datar & solid siap digunakan!</color>");
    }
}
