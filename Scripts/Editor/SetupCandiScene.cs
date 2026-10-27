using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
public static class SetupCandiScene
{
    [InitializeOnLoadMethod]
    private static void OnEditorLoad()
    {
        EditorApplication.delayCall += () =>
        {
            if (!EditorApplication.isPlayingOrWillChangePlaymode)
            {
                SetupEntireScene();
            }
        };
    }

    [MenuItem("Candi Borobudur/Setup Game Lengkap (Clean & Fix)")]
    public static void SetupEntireScene()
    {
        Debug.Log("<color=cyan>=== [CLEAN SETUP] MENATA ULANG SELURUH SCENE & PENCAHAYAAN SECARA BERSIH ===</color>");

        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        bool isURP = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline != null;

        // 1. HAPUS OBJEK RUSAK / HORROR MOON QUAD YANG MENUTUPI KAMERA
        GameObject oldMoon = GameObject.Find("Horror_Moon");
        if (oldMoon != null)
        {
            GameObject.DestroyImmediate(oldMoon);
            Debug.Log("🗑️ Horror_Moon quad raksasa berhasil dimusnahkan!");
        }

        // 2. ATUR PENCAHAYAAN LINGKUNGAN (MOONLIGHT & AMBIENT)
        SetupLightingAndEnvironment(isURP);

        // 3. PASTIKAN PIJAKAN TANAH PELATARAN (COURTYARD GROUND)
        EnsureCourtyardGround();

        // 4. SETUP PEMAIN (PLAYER) & KAMERA
        SetupPlayer(isURP);

        // 5. SETUP 3 KUNCI KUNO DI RUMAH JOGLO
        SetupKeys();

        // 6. SETUP GERBANG DAN GEMBOK (Z = -66)
        SetupGate();

        // 7. SETUP HANTU WAYANG
        SetupGhost();

        // 8. SETUP AUDIO MANAGER
        SetupAudio();

        // Simpan Scene
        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);
        Debug.Log("<color=green>✅ [SUKSES TOTAL] Seluruh scene telah diatur ulang dengan bersih, terang, dan siap dimainkan!</color>");
    }

    private static void SetupLightingAndEnvironment(bool isURP)
    {
        // Directional Light (Cahaya Utama Terang Benderang)
        GameObject dirLightObj = GameObject.Find("Directional Light");
        if (dirLightObj == null)
        {
            foreach (var l in Object.FindObjectsByType<Light>(FindObjectsInactive.Include))
            {
                if (l != null && l.type == LightType.Directional)
                {
                    dirLightObj = l.gameObject;
                    break;
                }
            }
        }

        if (dirLightObj == null) dirLightObj = new GameObject("Directional Light");
        dirLightObj.SetActive(true);
        dirLightObj.transform.rotation = Quaternion.Euler(50f, -30f, 0f);

        Light dirLight = dirLightObj.GetComponent<Light>();
        if (dirLight == null) dirLight = dirLightObj.AddComponent<Light>();
        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.95f, 0.97f, 1.0f);
        dirLight.intensity = isURP ? 2000.0f : 2.5f;
        dirLight.shadows = LightShadows.Soft;
        dirLight.shadowStrength = 0.35f;
        dirLight.enabled = true;
        RenderSettings.sun = dirLight;

        // Ambient Light (Full Visibility - Seluruh Candi & Alam Terlihat Jelas)
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.80f, 0.86f, 0.96f);
        RenderSettings.ambientEquatorColor = new Color(0.70f, 0.76f, 0.88f);
        RenderSettings.ambientGroundColor = new Color(0.60f, 0.66f, 0.78f);
        RenderSettings.ambientIntensity = 3.0f;
        RenderSettings.reflectionIntensity = 0.8f;
        RenderSettings.fog = false; // Matikan fog 100%
        DynamicGI.UpdateEnvironment();

        // Skybox
        if (RenderSettings.skybox != null)
        {
            if (RenderSettings.skybox.HasProperty("_Exposure")) RenderSettings.skybox.SetFloat("_Exposure", 1.0f);
            if (RenderSettings.skybox.HasProperty("_SkyTint")) RenderSettings.skybox.SetColor("_SkyTint", new Color(0.6f, 0.75f, 0.95f, 1.0f));
            if (RenderSettings.skybox.HasProperty("_GroundColor")) RenderSettings.skybox.SetColor("_GroundColor", new Color(0.5f, 0.6f, 0.75f, 1.0f));
        }
    }

    private static void EnsureCourtyardGround()
    {
        GameObject ground = GameObject.Find("Courtyard_Ground");
        if (ground == null)
        {
            ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
            ground.name = "Courtyard_Ground";
        }

        ground.transform.position = new Vector3(0f, -0.6f, 0f);
        ground.transform.localScale = new Vector3(350f, 1.0f, 350f);

        Material groundMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Tanah_Pelataran.mat");
        if (groundMat != null)
        {
            MeshRenderer mr = ground.GetComponent<MeshRenderer>();
            if (mr != null) mr.sharedMaterial = groundMat;
        }

        BoxCollider bc = ground.GetComponent<BoxCollider>();
        if (bc == null) bc = ground.AddComponent<BoxCollider>();
        bc.enabled = true;
    }

    private static void SetupPlayer(bool isURP)
    {
        GameObject player = GameObject.Find("Player");
        if (player == null)
        {
            player = new GameObject("Player");
            player.tag = "Player";
        }

        // Hapus collider lama yang bukan CharacterController
        foreach (var col in player.GetComponents<Collider>())
        {
            if (!(col is CharacterController)) GameObject.DestroyImmediate(col);
        }

        // Hapus mesh renderer/filter jika ada pada root Player
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

        // Posisikan Player di Walkway Masuk Selatan (Z = 48) menghadap Candi Borobudur (Rotasi Y = 180)
        cc.enabled = false;
        player.transform.position = new Vector3(0f, 1.5f, 48.0f);
        player.transform.rotation = Quaternion.Euler(0f, 180.0f, 0f); // Menghadap lurus ke Candi
        cc.enabled = true;

        FirstPersonMovement fpm = player.GetComponent<FirstPersonMovement>();
        if (fpm == null) fpm = player.AddComponent<FirstPersonMovement>();
        fpm.spawnLocation = PlayerSpawnLocation.SouthMainEntrance;
        fpm.spawnPosition = new Vector3(0f, 1.5f, 48.0f);
        fpm.spawnRotationY = 180.0f;
        fpm.enforceSpawnOnStart = true;
        fpm.cameraFarClip = 2000.0f;

        PlayerInventory inv = player.GetComponent<PlayerInventory>();
        if (inv == null) player.AddComponent<PlayerInventory>();

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
        mainCam.transform.localPosition = new Vector3(0f, 1.6f, 0.1f);
        mainCam.transform.localRotation = Quaternion.identity;
        mainCam.tag = "MainCamera";
        mainCam.fieldOfView = 75.0f;
        mainCam.nearClipPlane = 0.03f;
        mainCam.farClipPlane = 2000.0f;
        mainCam.clearFlags = CameraClearFlags.Skybox;
        mainCam.cullingMask = -1;
        mainCam.useOcclusionCulling = false;
        mainCam.depth = 100f;

        fpm.cameraTransform = mainCam.transform;

        // Setup Senter Jarak Jauh (300 Meter, Lebar 95 Derajat)
        Transform senterT = mainCam.transform.Find("Spotlight_Senter");
        GameObject senterObj;
        if (senterT == null)
        {
            senterObj = new GameObject("Spotlight_Senter");
            senterObj.transform.SetParent(mainCam.transform, false);
            senterObj.transform.localPosition = new Vector3(0.18f, -0.15f, 0.25f);
            senterObj.transform.localRotation = Quaternion.Euler(3.5f, 0f, 0f);
        }
        else
        {
            senterObj = senterT.gameObject;
        }

        Light spot = senterObj.GetComponent<Light>();
        if (spot == null) spot = senterObj.AddComponent<Light>();
        spot.type = LightType.Spot;
        spot.range = 300.0f;
        spot.spotAngle = 95.0f;
        spot.innerSpotAngle = 60.0f;
        spot.color = new Color(1.0f, 0.98f, 0.92f);
        spot.intensity = isURP ? 4500.0f : 15.0f;
        spot.shadows = LightShadows.None;
        spot.enabled = true;

        FlashlightController fc = senterObj.GetComponent<FlashlightController>();
        if (fc == null) fc = senterObj.AddComponent<FlashlightController>();
        fc.flashlight = spot;
        fc.normalIntensity = isURP ? 4500.0f : 15.0f;
        fc.range = 300.0f;
        fc.spotAngle = 95.0f;
        fc.innerSpotAngle = 60.0f;
        fc.isOn = true;

        // Setup Fill / Omni Light di Sekitar Pemain (150 Meter)
        Transform fillT = senterObj.transform.Find("Flashlight_Fill_Light");
        GameObject fillObj;
        if (fillT == null)
        {
            fillObj = new GameObject("Flashlight_Fill_Light");
            fillObj.transform.SetParent(senterObj.transform, false);
            fillObj.transform.localPosition = Vector3.zero;
        }
        else
        {
            fillObj = fillT.gameObject;
        }

        Light fillL = fillObj.GetComponent<Light>();
        if (fillL == null) fillL = fillObj.AddComponent<Light>();
        fillL.type = LightType.Point;
        fillL.range = 150.0f;
        fillL.color = new Color(1.0f, 0.98f, 0.92f);
        fillL.intensity = isURP ? 800.0f : 4.0f;
        fillL.shadows = LightShadows.None;
        fillL.enabled = true;
        fc.fillLight = fillL;
    }

    private static void SetupKeys()
    {
        CreateKeyInstance("Kunci_1_Ruby (Joglo Dukun)", new Vector3(-90.0f, 0.8f, 88.0f), KeyType.Ruby);
        CreateKeyInstance("Kunci_2_Amber (Joglo Utama)", new Vector3(90.0f, 0.8f, -88.0f), KeyType.Amber);
        CreateKeyInstance("Kunci_3_Jade (Joglo Punden)", new Vector3(-90.0f, 0.8f, -88.0f), KeyType.Jade);
    }

    private static void CreateKeyInstance(string name, Vector3 pos, KeyType type)
    {
        GameObject key = GameObject.Find(name);
        if (key == null)
        {
            key = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            key.name = name;
            key.transform.localScale = new Vector3(0.4f, 0.08f, 0.4f);
        }

        key.transform.position = pos;

        SphereCollider sc = key.GetComponent<SphereCollider>();
        if (sc == null) sc = key.AddComponent<SphereCollider>();
        sc.isTrigger = true;
        sc.radius = 1.5f;

        KeyPickup kp = key.GetComponent<KeyPickup>();
        if (kp == null) kp = key.AddComponent<KeyPickup>();
        kp.keyType = type;
        kp.namaKunci = name;
    }

    private static void SetupGate()
    {
        GameObject gateTrigger = GameObject.Find("Trigger_Gerbang");
        if (gateTrigger == null) gateTrigger = new GameObject("Trigger_Gerbang");
        // Di pilar gerbang luar Selatan (Z = 125.0)
        gateTrigger.transform.position = new Vector3(0f, 1.5f, 125.0f);

        BoxCollider bc = gateTrigger.GetComponent<BoxCollider>();
        if (bc == null) bc = gateTrigger.AddComponent<BoxCollider>();
        bc.isTrigger = true;
        bc.size = new Vector3(8f, 5f, 6f);

        LockedGate lg = gateTrigger.GetComponent<LockedGate>();
        if (lg == null) lg = gateTrigger.AddComponent<LockedGate>();

        // Posisikan Lentera Pilar di samping gerbang luar
        GameObject lenteraKiri = GameObject.Find("Lentera_Pilar_Kiri");
        if (lenteraKiri != null) lenteraKiri.transform.position = new Vector3(-3.2f, 2.5f, 125.0f);
        GameObject lenteraKanan = GameObject.Find("Lentera_Pilar_Kanan");
        if (lenteraKanan != null) lenteraKanan.transform.position = new Vector3(3.2f, 2.5f, 125.0f);

        // Hubungkan daun pintu jika ada di candi
        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi != null)
        {
            Transform pKiri = candi.transform.Find("Pintu_Gerbang_Kiri");
            Transform pKanan = candi.transform.Find("Pintu_Gerbang_Kanan");
            if (pKiri != null) lg.daunPintuKiri = pKiri;
            if (pKanan != null) lg.daunPintuKanan = pKanan;
        }
    }

    private static void SetupGhost()
    {
        GameObject ghost = GameObject.Find("Hantu_Wayang");
        if (ghost != null)
        {
            GhostAI ai = ghost.GetComponent<GhostAI>();
            if (ai == null) ai = ghost.AddComponent<GhostAI>();
        }
    }

    private static void SetupAudio()
    {
        GameObject audioMgr = GameObject.Find("Horror_Audio_Manager");
        if (audioMgr == null) audioMgr = new GameObject("Horror_Audio_Manager");

        HorrorAudioManager ham = audioMgr.GetComponent<HorrorAudioManager>();
        if (ham == null) ham = audioMgr.AddComponent<HorrorAudioManager>();
    }
}
