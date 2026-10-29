using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
public static class SetupCandiDanHalaman
{
    static SetupCandiDanHalaman()
    {
        EditorApplication.delayCall += () =>
        {
            if (!EditorApplication.isPlayingOrWillChangePlaymode)
            {
                HapusSemuaMistDanLightTidakGuna();
                GameObject candi = GameObject.Find("candi_borobudur");
                if (candi == null)
                {
                    MunculkanCandiDanHalaman();
                }
                else
                {
                    SetupSistemGerbangTerkunci(candi);
                }
                if (GameObject.Find("Player") == null || GameObject.Find("Titik_Spawn_Pemain") == null)
                {
                    PasangKarakterPemain();
                }
                if (GameObject.Find("Hantu_Wayang") == null)
                {
                    PasangHantuWayang();
                }
                if (GameObject.Find("Kunci_1_Kuningan_Dukun") == null || GameObject.Find("Kunci_2_Besi_Omah") == null || GameObject.Find("Kunci_3_Perunggu_Punden") == null)
                {
                    SebarTigaKunciDiRumahRumah();
                }
                PasangColliderTembokRumahDanPohon();
                SetupSuasanaHororMalam();
            }
        };
    }

    [MenuItem("Candi Borobudur/Munculkan Candi & Halaman")]
    public static void MunculkanCandiDanHalaman()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        Debug.Log("<color=cyan>=== [SETUP] MEMUNCULKAN CANDI BOROBUDUR, HALAMAN & HANTU WAYANG ===</color>");

        // Hapus mist/light tidak berguna terlebih dahulu
        HapusSemuaMistDanLightTidakGuna();

        // 1. Instansiasi Candi Borobudur dari Model FBX
        GameObject candiObj = GameObject.Find("candi_borobudur");
        if (candiObj == null)
        {
            GameObject candiPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Models/candi_borobudur.fbx");
            if (candiPrefab != null)
            {
                candiObj = (GameObject)PrefabUtility.InstantiatePrefab(candiPrefab);
                candiObj.name = "candi_borobudur";
                Undo.RegisterCreatedObjectUndo(candiObj, "Instantiate Candi Borobudur");
            }
            else
            {
                Debug.LogError("Assets/Models/candi_borobudur.fbx tidak ditemukan di Assets/Models/!");
            }
        }

        if (candiObj != null)
        {
            candiObj.transform.position = Vector3.zero;
            candiObj.transform.rotation = Quaternion.identity;
            candiObj.transform.localScale = Vector3.one;

            ApplyMaterialsToCandi(candiObj);
        }

        // 2. Buat Pelataran Halaman (Courtyard Ground)
        EnsureCourtyardGround();

        // 3. Atur Suasana Gelap & Seram (Malam Horor, Kabut, Rembulan Redup)
        SetupSuasanaHororMalam();

        // 4. Pasang Collider pada Tembok Rumah, Pohon, Pagar & Tangga
        PasangColliderTembokRumahDanPohon();

        // 5. Pasang Karakter Pemain Tepat di Depan Gerbang
        PasangKarakterPemain();

        // 6. Pasang Hantu Wayang di Area Kotak Dalam
        PasangHantuWayang();

        // 7. Sebar 3 Kunci Kuno di Rumah-Rumah Joglo (Menggunakan Mesh Penyangkut Kunci / Shackle)
        SebarTigaKunciDiRumahRumah();

        // 8. Fokuskan Scene View ke Candi
        FocusSceneView(candiObj);

        // Simpan Scene
        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);

        Debug.Log("<color=green><b>[BERHASIL]</b> Candi, Halaman, Karakter Pemain, dan Hantu Wayang siap dimainkan!</color>");
    }

    [MenuItem("Candi Borobudur/Pasang Collider Tembok Rumah & Pohon")]
    public static void PasangColliderTembokRumahDanPohon()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        // 1. Pastikan ModelImporter FBX memiliki addCollider = true
        ModelImporter importer = AssetImporter.GetAtPath("Assets/Models/candi_borobudur.fbx") as ModelImporter;
        if (importer != null && !importer.addCollider)
        {
            importer.addCollider = true;
            importer.SaveAndReimport();
        }

        GameObject candiObj = GameObject.Find("candi_borobudur");
        if (candiObj == null)
        {
            Debug.LogWarning("candi_borobudur tidak ditemukan di scene!");
            return;
        }

        int addedCount = 0;
        MeshFilter[] meshFilters = candiObj.GetComponentsInChildren<MeshFilter>(true);
        foreach (var mf in meshFilters)
        {
            if (mf == null || mf.sharedMesh == null || mf.sharedMesh.vertexCount == 0) continue;

            string n = mf.gameObject.name.ToLower();
            // Rumah / Joglo (tembok, dinding, lantai, tiang, pintu), Pohon, Tembok Pagar Luar, Gerbang, Tangga, Candi
            bool isTarget = n.Contains("joglo") || 
                            n.Contains("tree") || 
                            n.Contains("pohon") || 
                            n.Contains("wall") || 
                            n.Contains("fence") || 
                            n.Contains("pagar") ||
                            n.Contains("gate") || 
                            n.Contains("pintu") || 
                            n.Contains("gerbang") ||
                            n.Contains("rantai") ||
                            n.Contains("balustrade") ||
                            n.Contains("borobudur") ||
                            n.Contains("stupa") ||
                            n.Contains("step") ||
                            n.Contains("tangga") ||
                            n.Contains("relung") ||
                            n.Contains("rupadhatu") ||
                            n.Contains("arupadhatu");

            if (isTarget)
            {
                Collider col = mf.GetComponent<Collider>();
                if (col == null)
                {
                    MeshCollider mc = Undo.AddComponent<MeshCollider>(mf.gameObject);
                    mc.sharedMesh = mf.sharedMesh;
                    addedCount++;
                }
            }
        }

        // Pastikan Courtyard_Ground juga memiliki BoxCollider solid
        EnsureCourtyardGround();

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);
        Debug.Log($"<color=green><b>[BERHASIL]</b> Collider solid terpasang pada {addedCount} objek tembok rumah, pohon, pagar, dan tangga!</color>");
    }

    [MenuItem("Candi Borobudur/Hapus Mist Corridor & Light Tidak Guna")]
    public static void HapusSemuaMistDanLightTidakGuna()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        // 1. Matikan importLights pada FBX Importer
        string[] fbxPaths = new string[] {
            "Assets/Models/candi_borobudur.fbx",
            "Assets/Models/candi_borobudur_3d.blend",
            "Assets/Models/karakter_hantu_wayang.fbx"
        };

        foreach (string path in fbxPaths)
        {
            ModelImporter mi = AssetImporter.GetAtPath(path) as ModelImporter;
            if (mi != null && mi.importLights)
            {
                mi.importLights = false;
                mi.SaveAndReimport();
            }
        }

        int count = 0;
        // 2. Hancurkan semua object mist/corridor/light tidak berguna di scene
        GameObject candiObj = GameObject.Find("candi_borobudur");
        if (candiObj != null)
        {
            Transform[] children = candiObj.GetComponentsInChildren<Transform>(true);
            foreach (var t in children)
            {
                if (t == null || t.gameObject == candiObj) continue;
                string n = t.name.ToLower();
                if (n.Contains("mist") || n.Contains("corridor") || n == "light" || n.Contains("sun_borobudur") || n.Contains("point."))
                {
                    Light l = t.GetComponent<Light>();
                    if (l != null) Object.DestroyImmediate(l);
                    Object.DestroyImmediate(t.gameObject);
                    count++;
                }
            }
        }

        foreach (var ro in activeScene.GetRootGameObjects())
        {
            if (ro == null) continue;
            string n = ro.name.ToLower();
            if (n.Contains("mist") || n.Contains("corridor"))
            {
                Object.DestroyImmediate(ro);
                count++;
            }
        }

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);
        Debug.Log($"<color=green><b>[BERHASIL]</b> {count} objek Mist Corridor / Light bawaan FBX telah dibersihkan!</color>");
    }

    [MenuItem("Candi Borobudur/Pasang Titik Spawn & Karakter di Depan Gerbang")]
    public static void PasangKarakterPemain()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        // 1. Buat atau Temukan Titik_Spawn_Pemain tepat di depan gerbang selatan (gerbang ada di Z = 125, pemain di Z = 118)
        GameObject spawnPointObj = GameObject.Find("Titik_Spawn_Pemain");
        if (spawnPointObj == null)
        {
            spawnPointObj = new GameObject("Titik_Spawn_Pemain");
            Undo.RegisterCreatedObjectUndo(spawnPointObj, "Create Titik Spawn Pemain");
        }
        spawnPointObj.transform.position = new Vector3(0f, 1.0f, 118.0f);
        spawnPointObj.transform.rotation = Quaternion.Euler(0f, 180.0f, 0f); // Menghadap ke arah Candi Borobudur

        // 2. Setup Karakter Player
        GameObject player = GameObject.Find("Player");
        if (player == null)
        {
            player = new GameObject("Player");
            player.tag = "Player";
            Undo.RegisterCreatedObjectUndo(player, "Create Player");
        }

        // Hapus collider lama selain CharacterController
        foreach (var col in player.GetComponents<Collider>())
        {
            if (!(col is CharacterController)) Object.DestroyImmediate(col);
        }

        CharacterController cc = player.GetComponent<CharacterController>();
        if (cc == null) cc = player.AddComponent<CharacterController>();
        cc.height = 1.8f;
        cc.radius = 0.35f;
        cc.center = new Vector3(0f, 0.9f, 0f);
        cc.stepOffset = 0.45f;
        cc.slopeLimit = 55.0f;
        cc.minMoveDistance = 0f;

        // Posisikan Karakter tepat di Titik Spawn di depan gerbang
        cc.enabled = false;
        player.transform.position = spawnPointObj.transform.position;
        player.transform.rotation = spawnPointObj.transform.rotation;
        cc.enabled = true;

        PlayerController pc = player.GetComponent<PlayerController>();
        if (pc == null) pc = player.AddComponent<PlayerController>();
        pc.spawnPoint = spawnPointObj.transform;

        PlayerInventory pi = player.GetComponent<PlayerInventory>();
        if (pi == null) pi = player.AddComponent<PlayerInventory>();

        // Hubungkan Kamera Utama ke Player
        Camera cam = Camera.main;
        if (cam == null) cam = player.GetComponentInChildren<Camera>();
        if (cam != null)
        {
            cam.transform.SetParent(player.transform);
            cam.transform.localPosition = new Vector3(0f, 1.6f, 0f);
            cam.transform.localRotation = Quaternion.identity;
            cam.fieldOfView = 65f;
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 2000f;
            pc.cameraTransform = cam.transform;

            // Pastikan tidak ada objek senter lama
            Transform senterT = cam.transform.Find("Spotlight_Senter");
            if (senterT != null) Object.DestroyImmediate(senterT.gameObject);
        }

        // Pilih dan fokuskan Scene View ke Pemain di Depan Gerbang
        Selection.activeGameObject = player;
        FocusSceneView(player);

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);

        Debug.Log("<color=green><b>[BERHASIL]</b> Karakter pemain & Titik Spawn terpasang di depan gerbang (X = 0, Z = 118)!</color>");
    }

    [MenuItem("Candi Borobudur/Pasang Hantu Wayang (Muncul Acak di Kotak Dalam)")]
    public static void PasangHantuWayang()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        // 1. Buat atau Temukan Area_Kotak_Dalam (Area Kotak Tempat Hantu Muncul)
        GameObject areaObj = GameObject.Find("Area_Kotak_Dalam");
        if (areaObj == null)
        {
            areaObj = new GameObject("Area_Kotak_Dalam");
            Undo.RegisterCreatedObjectUndo(areaObj, "Create Area Kotak Dalam");
        }
        areaObj.transform.position = new Vector3(0f, 0.5f, 0f);
        BoxCollider bc = areaObj.GetComponent<BoxCollider>();
        if (bc == null) bc = areaObj.AddComponent<BoxCollider>();
        bc.isTrigger = true;
        bc.size = new Vector3(240f, 4f, 240f); // Seluruh daerah di dalam pagar (pagar ada di X=±125, Z=±125)
        bc.center = Vector3.zero;

        // 2. Siapkan Material Hantu Wayang
        EnsureWayangMaterials();

        // 3. Instansiasi Hantu Wayang dari Model FBX
        GameObject ghostObj = GameObject.Find("Hantu_Wayang");
        if (ghostObj == null)
        {
            GameObject ghostPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Models/karakter_hantu_wayang.fbx");
            if (ghostPrefab != null)
            {
                ghostObj = (GameObject)PrefabUtility.InstantiatePrefab(ghostPrefab);
                ghostObj.name = "Hantu_Wayang";
                Undo.RegisterCreatedObjectUndo(ghostObj, "Instantiate Hantu Wayang");
            }
            else
            {
                Debug.LogError("Assets/Models/karakter_hantu_wayang.fbx tidak ditemukan!");
                return;
            }
        }

        // Setup CharacterController
        CharacterController cc = ghostObj.GetComponent<CharacterController>();
        if (cc == null) cc = ghostObj.AddComponent<CharacterController>();
        cc.height = 1.9f;
        cc.radius = 0.35f;
        cc.center = new Vector3(0f, 0.95f, 0f);
        cc.stepOffset = 0.45f;
        cc.slopeLimit = 55.0f;

        // Setup HantuWayangAI
        HantuWayangAI ai = ghostObj.GetComponent<HantuWayangAI>();
        if (ai == null) ai = ghostObj.AddComponent<HantuWayangAI>();
        ai.areaKotakDalam = bc;
        ai.boxCenter = areaObj.transform.position;
        ai.boxSize = bc.size;
        ai.patrolSpeed = 4.5f;
        ai.chaseSpeed = 7.2f;
        ai.detectionRadius = 60.0f;
        ai.flashlightBonusRange = 45.0f;
        ai.sprintBonusRange = 30.0f;
        ai.loseTargetDistance = 90.0f;
        ai.attackRadius = 2.0f;
        ai.minSpawnDistFromPlayer = 20.0f;
        ai.autoRelocate = true;
        ai.relocateInterval = 25.0f;

        GameObject player = GameObject.Find("Player");
        if (player != null) ai.player = player.transform;

        // Terapkan material ke seluruh mesh Hantu Wayang
        ApplyMaterialsToGhost(ghostObj);

        // Munculkan hantu di posisi acak di dalam kotak
        ai.SpawnAtRandomPosition();

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);

        Debug.Log("<color=green><b>[BERHASIL]</b> Hantu Wayang telah dipasang dan muncul secara acak di dalam Area Kotak Dalam!</color>");
    }

    private static void EnsureWayangMaterials()
    {
        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        CreateMatIfMissing("Assets/Materials/Mat_Wayang_Body.mat", litShader, "Assets/Textures/ardzuna_body_baseColor.jpeg", Color.white, 0.1f);
        CreateMatIfMissing("Assets/Materials/Mat_Wayang_Body_FLIP.mat", litShader, "Assets/Textures/ardzuna_body_FLIP_baseColor.jpeg", Color.white, 0.1f);
        CreateMatIfMissing("Assets/Materials/Mat_Wayang_Sukienka.mat", litShader, "Assets/Textures/ardzuna_sukienka_baseColor.jpeg", Color.white, 0.2f);
        CreateMatIfMissing("Assets/Materials/Mat_Wayang_Wood.mat", litShader, null, new Color(0.24f, 0.16f, 0.09f), 0.05f);
        CreateMatIfMissing("Assets/Materials/Mat_Wayang_Eyes.mat", litShader, null, new Color(1.0f, 0.15f, 0.15f), 0.5f, true);
    }

    private static void CreateMatIfMissing(string path, Shader shader, string texPath, Color color, float smoothness, bool isEmissive = false)
    {
        Material mat = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (mat == null)
        {
            mat = new Material(shader);
            AssetDatabase.CreateAsset(mat, path);
        }
        mat.shader = shader;
        mat.color = color;
        mat.SetColor("_BaseColor", color);
        mat.SetFloat("_Smoothness", smoothness);
        mat.SetFloat("_EnvironmentReflections", 0f);

        if (!string.IsNullOrEmpty(texPath))
        {
            Texture2D tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
            if (tex != null)
            {
                mat.mainTexture = tex;
                mat.SetTexture("_BaseMap", tex);
            }
        }

        if (isEmissive)
        {
            mat.EnableKeyword("_EMISSION");
            mat.SetColor("_EmissionColor", new Color(1.0f, 0.15f, 0.15f) * 2.5f);
        }

        EditorUtility.SetDirty(mat);
    }

    private static void ApplyMaterialsToGhost(GameObject ghostObj)
    {
        Material matBody = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Wayang_Body.mat");
        Material matFlip = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Wayang_Body_FLIP.mat");
        Material matSkirt = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Wayang_Sukienka.mat");
        Material matWood = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Wayang_Wood.mat");
        Material matEyes = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Wayang_Eyes.mat");

        MeshRenderer[] renderers = ghostObj.GetComponentsInChildren<MeshRenderer>(true);
        foreach (var mr in renderers)
        {
            if (mr == null) continue;
            string n = mr.name.ToLower();

            if (n.Contains("eye") || n.Contains("mata"))
            {
                if (matEyes != null) mr.sharedMaterial = matEyes;
            }
            else if (n.Contains("skirt") || n.Contains("sukienka") || n.Contains("batik"))
            {
                if (matSkirt != null) mr.sharedMaterial = matSkirt;
            }
            else if (n.Contains("pedestal") || n.Contains("base") || n.Contains("tier") || n.Contains("wood"))
            {
                if (matWood != null) mr.sharedMaterial = matWood;
            }
            else if (n.Contains("flip"))
            {
                if (matFlip != null) mr.sharedMaterial = matFlip;
            }
            else
            {
                if (matBody != null) mr.sharedMaterial = matBody;
            }
        }
    }

    [MenuItem("Candi Borobudur/Terapkan Suasana Gelap & Seram (Malam Horor)")]
    public static void SetupSuasanaHororMalam()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        // 1. Cahaya Rembulan Malam Mencekam (Bukan Biru, warna perak abu-abu dingin redup)
        GameObject dirLightObj = GameObject.Find("Directional Light");
        if (dirLightObj == null)
        {
            dirLightObj = new GameObject("Directional Light");
            Light l = dirLightObj.AddComponent<Light>();
            l.type = LightType.Directional;
            Undo.RegisterCreatedObjectUndo(dirLightObj, "Create Directional Light");
        }

        // Cahaya rembulan dari sudut tinggi miring menyinari tepi candi dan pohon
        dirLightObj.transform.rotation = Quaternion.Euler(65f, 160f, 0f);
        Light dl = dirLightObj.GetComponent<Light>();
        if (dl != null)
        {
            dl.type = LightType.Directional;
            dl.color = new Color(0.68f, 0.70f, 0.74f); // Perak rembulan malam dingin (tidak biru kartun)
            dl.intensity = 0.16f; // Gelap pekat realistis, menonjolkan siluet stupa dan pohon
            dl.shadows = LightShadows.Soft;
            dl.enabled = true;
            RenderSettings.sun = dl;
        }

        // 2. Ambient Malam Mistik & Gelap
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.06f, 0.06f, 0.07f);
        RenderSettings.ambientEquatorColor = new Color(0.04f, 0.04f, 0.05f);
        RenderSettings.ambientGroundColor = new Color(0.02f, 0.02f, 0.03f);
        RenderSettings.ambientIntensity = 0.35f;
        RenderSettings.subtractiveShadowColor = new Color(0.01f, 0.01f, 0.02f);

        // 3. Skybox Malam Gelap Gulita
        Shader skyShader = Shader.Find("Skybox/Procedural");
        if (skyShader != null)
        {
            string skyPath = "Assets/Materials/Skybox_Horror_Night.mat";
            Material skyMat = AssetDatabase.LoadAssetAtPath<Material>(skyPath);
            if (skyMat == null)
            {
                skyMat = new Material(skyShader);
                AssetDatabase.CreateAsset(skyMat, skyPath);
            }
            skyMat.shader = skyShader;
            skyMat.SetColor("_SkyTint", new Color(0.05f, 0.05f, 0.06f)); // Langit malam pekat
            skyMat.SetColor("_GroundColor", new Color(0.02f, 0.02f, 0.02f)); // Tanah gelap
            skyMat.SetFloat("_AtmosphereThickness", 0.45f);
            skyMat.SetFloat("_Exposure", 0.05f); // Eksposur rendah = malam gelap gulita
            EditorUtility.SetDirty(skyMat);
            RenderSettings.skybox = skyMat;
        }

        // 4. Kabut Hitam Pekat Mencekam (Penglihatan Terbatas Linear Fog)
        RenderSettings.fog = true;
        RenderSettings.fogMode = FogMode.Linear;
        RenderSettings.fogStartDistance = 2.0f;
        RenderSettings.fogEndDistance = 22.0f;
        RenderSettings.fogColor = new Color(0.012f, 0.012f, 0.018f); // Hitam pekat gulita
        RenderSettings.ambientIntensity = 0.12f;

        // Background kamera & batas pandang
        Camera cam = Camera.main;
        if (cam != null)
        {
            cam.backgroundColor = new Color(0.012f, 0.012f, 0.018f);
            cam.farClipPlane = 30.0f;

            HorrorVisionEffect hve = cam.GetComponent<HorrorVisionEffect>();
            if (hve == null) cam.gameObject.AddComponent<HorrorVisionEffect>();
        }

        // 5. Pasang Obor Api Menyala Berkedip di Tiang Gerbang
        PasangOborTiangGerbang();

        // 6. Pasang Horror Audio Manager (Suara Angin Horor & Musik Ketegangan)
        PasangHorrorAudioManager();

        // 7. Pastikan Senter Pemain Siap
        GameObject player = GameObject.Find("Player");
        if (player != null)
        {
            PlayerController pc = player.GetComponent<PlayerController>();
            if (pc != null) pc.SetupFlashlightIfMissing();
        }

        // 8. Perbarui Mata Merah Hantu Wayang
        EnsureWayangMaterials();

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);

        Debug.Log("<color=green><b>[BERHASIL]</b> Suasana gelap dan seram (malam horor, kabut mistis, obor gerbang, senter & audio mencekam) telah aktif!</color>");
    }

    private static void PasangOborTiangGerbang()
    {
        // Tiang gerbang selatan di Z = 125, X = ±2.85
        Vector3 posKiri = new Vector3(-2.85f, 2.3f, 124.75f);
        Vector3 posKanan = new Vector3(2.85f, 2.3f, 124.75f);

        SetupSatuObor("Obor_Gerbang_Kiri", posKiri);
        SetupSatuObor("Obor_Gerbang_Kanan", posKanan);
    }

    private static void SetupSatuObor(string nama, Vector3 pos)
    {
        GameObject obor = GameObject.Find(nama);
        if (obor == null)
        {
            obor = new GameObject(nama);
            Undo.RegisterCreatedObjectUndo(obor, "Create " + nama);
        }

        obor.transform.position = pos;

        Light l = obor.GetComponent<Light>();
        if (l == null) l = obor.AddComponent<Light>();
        l.type = LightType.Point;
        l.color = new Color(1.0f, 0.58f, 0.18f); // Nyala api obor oranye hangat
        l.intensity = 1.9f;
        l.range = 8.5f;
        l.shadows = LightShadows.None; // Bebaskan 12 cubemap shadow passes agar URP shadow atlas tidak overload
        l.enabled = true;

        TorchFlicker tf = obor.GetComponent<TorchFlicker>();
        if (tf == null) tf = obor.AddComponent<TorchFlicker>();
        tf.baseIntensity = 1.9f;
        tf.flickerSpeed = 14.0f;
        tf.flickerAmount = 0.45f;
    }

    private static void PasangHorrorAudioManager()
    {
        GameObject audioObj = GameObject.Find("Horror_Audio_Manager");
        if (audioObj == null)
        {
            audioObj = new GameObject("Horror_Audio_Manager");
            Undo.RegisterCreatedObjectUndo(audioObj, "Create Horror Audio Manager");
        }

        HorrorAudioManager ham = audioObj.GetComponent<HorrorAudioManager>();
        if (ham == null) ham = audioObj.AddComponent<HorrorAudioManager>();

        AudioClip ambient = AssetDatabase.LoadAssetAtPath<AudioClip>("Assets/Audio/horror_ambient.mp3");
        AudioClip tension = AssetDatabase.LoadAssetAtPath<AudioClip>("Assets/Audio/caverns_horror_loop.ogg");

        if (ambient != null) ham.ambientClip = ambient;
        if (tension != null) ham.tensionClip = tension;

        GameObject player = GameObject.Find("Player");
        if (player != null) ham.player = player.transform;

        GameObject ghost = GameObject.Find("Hantu_Wayang");
        if (ghost != null) ham.ghost = ghost.transform;

        ham.maxAmbientVolume = 0.40f;
        ham.maxTensionVolume = 0.65f;
        ham.proximityDistance = 25.0f;
    }

    private static void UpdateMaterialsTanpaRefleksiBiru()
    {
        Material matPohon = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batang_Pohon.mat");
        if (matPohon != null)
        {
            matPohon.SetColor("_BaseColor", new Color(0.42f, 0.32f, 0.24f));
            matPohon.SetFloat("_Smoothness", 0.0f);
            matPohon.SetFloat("_EnvironmentReflections", 0.0f);
            matPohon.SetFloat("_SpecularHighlights", 0.0f);
            EditorUtility.SetDirty(matPohon);
        }

        Material matBlok = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Candi_Blok.mat");
        if (matBlok != null)
        {
            matBlok.SetColor("_BaseColor", new Color(0.65f, 0.63f, 0.60f));
            matBlok.SetFloat("_Smoothness", 0.05f);
            matBlok.SetFloat("_EnvironmentReflections", 0.0f);
            matBlok.SetFloat("_SpecularHighlights", 0.0f);
            EditorUtility.SetDirty(matBlok);
        }

        Material matRelief = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Andesit_Relief.mat");
        if (matRelief != null)
        {
            matRelief.SetColor("_BaseColor", new Color(0.68f, 0.66f, 0.63f));
            matRelief.SetFloat("_Smoothness", 0.05f);
            matRelief.SetFloat("_EnvironmentReflections", 0.0f);
            matRelief.SetFloat("_SpecularHighlights", 0.0f);
            EditorUtility.SetDirty(matRelief);
        }

        Material matTanah = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Tanah_Pelataran.mat");
        if (matTanah != null)
        {
            matTanah.SetColor("_BaseColor", new Color(0.85f, 0.82f, 0.78f));
            matTanah.SetFloat("_Smoothness", 0.0f);
            matTanah.SetFloat("_EnvironmentReflections", 0.0f);
            matTanah.SetFloat("_SpecularHighlights", 0.0f);
            EditorUtility.SetDirty(matTanah);
        }

        AssetDatabase.SaveAssets();
    }

    private static void ApplyMaterialsToCandi(GameObject candiObj)
    {
        Material matBlok = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Candi_Blok.mat");
        Material matRelief = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Andesit_Relief.mat");
        Material matPohon = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batang_Pohon.mat");

        MeshRenderer[] renderers = candiObj.GetComponentsInChildren<MeshRenderer>(true);
        foreach (var mr in renderers)
        {
            if (mr == null) continue;

            string n = mr.name.ToLower();
            if (n.Contains("tree") || n.Contains("pohon") || n.Contains("leaf") || n.Contains("daun"))
            {
                if (matPohon != null) mr.sharedMaterial = matPohon;
            }
            else if (n.Contains("relief") || n.Contains("balustrade") || n.Contains("relung") || 
                     n.Contains("cylinder") || n.Contains("cone") || n.Contains("cube"))
            {
                if (matRelief != null) mr.sharedMaterial = matRelief;
            }
            else
            {
                if (matBlok != null) mr.sharedMaterial = matBlok;
            }
        }
    }

    private static void EnsureCourtyardGround()
    {
        GameObject ground = GameObject.Find("Courtyard_Ground");
        if (ground == null)
        {
            ground = GameObject.CreatePrimitive(PrimitiveType.Cube);
            ground.name = "Courtyard_Ground";
            Undo.RegisterCreatedObjectUndo(ground, "Create Courtyard Ground");
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
        bc.size = Vector3.one;
        bc.center = Vector3.zero;
        bc.enabled = true;
    }

    private static void FocusSceneView(GameObject target)
    {
        if (SceneView.lastActiveSceneView != null)
        {
            if (target != null && target.name == "Player")
            {
                // Kamera editor fokus ke pemain di depan gerbang
                SceneView.lastActiveSceneView.LookAt(new Vector3(0f, 1.8f, 118.0f), Quaternion.Euler(12f, 180f, 0f), 15f);
            }
            else
            {
                SceneView.lastActiveSceneView.LookAt(new Vector3(0f, 10f, 0f), Quaternion.Euler(15f, 180f, 0f), 85f);
            }
            SceneView.lastActiveSceneView.Repaint();
        }
    }

    [MenuItem("Candi Borobudur/Sebar 3 Kunci di Rumah-Rumah")]
    public static void SebarTigaKunciDiRumahRumah()
    {
        var activeScene = EditorSceneManager.GetActiveScene();
        if (!activeScene.isLoaded || string.IsNullOrEmpty(activeScene.path))
        {
            activeScene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        GameObject candiObj = GameObject.Find("candi_borobudur");
        if (candiObj == null)
        {
            Debug.LogWarning("candi_borobudur belum ada di scene. Memunculkan candi terlebih dahulu...");
            MunculkanCandiDanHalaman();
            candiObj = GameObject.Find("candi_borobudur");
            if (candiObj == null) return;
        }

        // 1. Pastikan Player memiliki komponen PlayerInventory
        GameObject player = GameObject.Find("Player");
        if (player != null)
        {
            PlayerInventory inv = player.GetComponent<PlayerInventory>();
            if (inv == null) inv = player.AddComponent<PlayerInventory>();
        }

        // 2. Siapkan 3 Material Kunci (Kuningan Kuno, Besi Tempa, Perunggu Kuno) - Tanpa Emisi/Cahaya
        Shader litShader = Shader.Find("Universal Render Pipeline/Lit");
        if (litShader == null) litShader = Shader.Find("Standard");

        Material matKuningan = CreateKeyMaterial("Assets/Materials/Mat_Kunci_1_Kuningan.mat", litShader,
            new Color(0.72f, 0.58f, 0.18f), 0.85f, 0.65f);

        Material matBesi = CreateKeyMaterial("Assets/Materials/Mat_Kunci_2_Besi.mat", litShader,
            new Color(0.45f, 0.38f, 0.32f), 0.90f, 0.55f);

        Material matPerunggu = CreateKeyMaterial("Assets/Materials/Mat_Kunci_3_Perunggu.mat", litShader,
            new Color(0.22f, 0.48f, 0.38f), 0.80f, 0.60f);

        // 3. Ambil 3 Mesh Penyangkut Kunci (Shackle) dari Gembok FBX
        Mesh meshShackle1 = CariMeshShackle(candiObj, "Gembok_1_Kuningan_Kuno_Shackle");
        Mesh meshShackle2 = CariMeshShackle(candiObj, "Gembok_2_Besi_Kuno_Shackle");
        Mesh meshShackle3 = CariMeshShackle(candiObj, "Gembok_3_Perunggu_Kuno_Shackle");

        // Failsafe jika salah satu mesh null
        if (meshShackle1 == null && meshShackle2 != null) meshShackle1 = meshShackle2;
        if (meshShackle2 == null && meshShackle1 != null) meshShackle2 = meshShackle1;
        if (meshShackle3 == null && meshShackle1 != null) meshShackle3 = meshShackle1;
        if (meshShackle1 == null)
        {
            Mesh fallback = BuatProceduralShackleMesh();
            meshShackle1 = fallback;
            meshShackle2 = fallback;
            meshShackle3 = fallback;
        }

        // 4. Cari Posisi 3 Rumah Joglo (Di atas balai-balai / Amben atau dalam ruangan)
        Vector3 posDukun = CariPosisiAmbenAtauRumah(candiObj, "Joglo_NW_Dukun", new Vector3(-87.62f, 1.15f, -90.00f));
        Vector3 posOmah = CariPosisiAmbenAtauRumah(candiObj, "Joglo_SE_Omah", new Vector3(87.62f, 1.15f, 90.00f));
        Vector3 posPunden = CariPosisiAmbenAtauRumah(candiObj, "Joglo_SW_Punden", new Vector3(-92.00f, 1.15f, 85.62f));

        // 5. Instansiasi / Konfigurasi 3 Objek Kunci (Tanpa Cahaya / Gelap agar Menantang)
        SetupSatuKunci("Kunci_1_Kuningan_Dukun", posDukun, meshShackle1, matKuningan,
            KeyType.Ruby, "Kunci Kuningan Kuno", "Rumah Joglo Dukun (Barat Laut / NW)");

        SetupSatuKunci("Kunci_2_Besi_Omah", posOmah, meshShackle2, matBesi,
            KeyType.Amber, "Kunci Besi Tempa", "Rumah Joglo Omah (Tenggara / SE)");

        SetupSatuKunci("Kunci_3_Perunggu_Punden", posPunden, meshShackle3, matPerunggu,
            KeyType.Jade, "Kunci Perunggu Kuno", "Rumah Joglo Punden (Barat Daya / SW)");

        // 6. Konfigurasi Sistem Gerbang Terkunci di Pintu Utama Masuk Candi (Z = 66)
        SetupSistemGerbangTerkunci(candiObj);

        EditorSceneManager.MarkSceneDirty(activeScene);
        EditorSceneManager.SaveScene(activeScene);

        Debug.Log("<color=green><b>[BERHASIL]</b> 3 Kunci kuno telah disebar tanpa cahaya di Rumah Dukun (NW), Rumah Omah (SE), dan Rumah Punden (SW)! Pemain harus mencari menggunakan senter.</color>");
    }

    private static Material CreateKeyMaterial(string path, Shader shader, Color baseColor, float metallic, float smoothness)
    {
        Material mat = AssetDatabase.LoadAssetAtPath<Material>(path);
        if (mat == null)
        {
            mat = new Material(shader);
            AssetDatabase.CreateAsset(mat, path);
        }
        mat.shader = shader;
        mat.color = baseColor;
        mat.SetColor("_BaseColor", baseColor);
        mat.SetFloat("_Metallic", metallic);
        mat.SetFloat("_Smoothness", smoothness);
        // Nonaktifkan emisi/glow agar kunci tidak bersinar dalam gelap
        mat.DisableKeyword("_EMISSION");
        mat.SetColor("_EmissionColor", Color.black);
        mat.globalIlluminationFlags = MaterialGlobalIlluminationFlags.None;
        EditorUtility.SetDirty(mat);
        return mat;
    }

    private static Mesh CariMeshShackle(GameObject candiObj, string shackleName)
    {
        // 1. Cek model khusus "Penyangkut Kunci" di Assets/Models/penyangkut_kunci/
        string[] penyangkutPaths = new string[] {
            "Assets/Models/penyangkut_kunci/Penyangkut Kunci (EC (TRG) 8E).fbx",
            "Assets/Models/Penyangkut Kunci (EC (TRG) 8E).fbx"
        };
        foreach (var p in penyangkutPaths)
        {
            Object[] assets = AssetDatabase.LoadAllAssetsAtPath(p);
            if (assets != null)
            {
                foreach (var a in assets)
                {
                    if (a is Mesh m && (m.name.Contains("Penyangkut") || m.name.Contains("EC") || m.name.Contains("Mesh")))
                    {
                        return m;
                    }
                }
            }
        }

        // 2. Cari langsung dari MeshFilter pada anak candiObj (Gembok Shackle)
        MeshFilter[] filters = candiObj.GetComponentsInChildren<MeshFilter>(true);
        foreach (var mf in filters)
        {
            if (mf != null && mf.gameObject.name.Contains(shackleName) && mf.sharedMesh != null)
            {
                return mf.sharedMesh;
            }
        }

        // 3. Cari dari semua sub-asset FBX candi_borobudur
        Object[] subAssets = AssetDatabase.LoadAllAssetsAtPath("Assets/Models/candi_borobudur.fbx");
        foreach (var sub in subAssets)
        {
            if (sub is Mesh m && m.name.Contains(shackleName))
            {
                return m;
            }
        }

        return null;
    }

    private static Vector3 CariPosisiAmbenAtauRumah(GameObject candiObj, string housePrefix, Vector3 fallbackPos)
    {
        Transform[] children = candiObj.GetComponentsInChildren<Transform>(true);
        // Cari amben (balai-balai tempat meletakkan barang/sesajen di dalam joglo)
        foreach (var t in children)
        {
            if (t != null && t.name.Contains(housePrefix) && t.name.Contains("Amben"))
            {
                return t.position + new Vector3(0f, 0.85f, 0f);
            }
        }

        // Jika amben spesifik belum terpisah, cari rumah joglonya
        foreach (var t in children)
        {
            if (t != null && t.name.Equals(housePrefix, System.StringComparison.OrdinalIgnoreCase))
            {
                return t.position + new Vector3(0f, 1.15f, 0f);
            }
        }

        return fallbackPos;
    }

    private static void SetupSatuKunci(string namaObj, Vector3 posisi, Mesh shackleMesh, Material keyMaterial,
        KeyType keyType, string namaKunci, string lokasiKunci)
    {
        GameObject keyObj = GameObject.Find(namaObj);
        if (keyObj == null)
        {
            keyObj = new GameObject(namaObj);
            Undo.RegisterCreatedObjectUndo(keyObj, "Create " + namaObj);
        }

        keyObj.transform.position = posisi;
        keyObj.transform.rotation = Quaternion.Euler(0f, 45f, 0f);
        keyObj.transform.localScale = new Vector3(1.6f, 1.6f, 1.6f);

        // Pasang Mesh Shackle (Penyangkut Kunci)
        MeshFilter mf = keyObj.GetComponent<MeshFilter>();
        if (mf == null) mf = keyObj.AddComponent<MeshFilter>();
        mf.sharedMesh = shackleMesh;

        MeshRenderer mr = keyObj.GetComponent<MeshRenderer>();
        if (mr == null) mr = keyObj.AddComponent<MeshRenderer>();
        mr.sharedMaterial = keyMaterial;

        // Pasang SphereCollider trigger untuk deteksi diambil
        SphereCollider sc = keyObj.GetComponent<SphereCollider>();
        if (sc == null) sc = keyObj.AddComponent<SphereCollider>();
        sc.isTrigger = true;
        sc.radius = 1.4f;

        // Hapus Point Light / cahaya pada kunci agar gelap dan menantang (player harus mencari memakai senter)
        Light pl = keyObj.GetComponent<Light>();
        if (pl != null) Object.DestroyImmediate(pl);

        // Pasang komponen KeyPickup
        KeyPickup kp = keyObj.GetComponent<KeyPickup>();
        if (kp == null) kp = keyObj.AddComponent<KeyPickup>();
        kp.keyType = keyType;
        kp.namaKunci = namaKunci;
        kp.lokasiKunci = lokasiKunci;
        kp.interactionDistance = 2.4f;
    }

    private static Mesh BuatProceduralShackleMesh()
    {
        return KeyPickup.GetOrCreateRealisticKeyMesh();
    }



    private static void SetupSistemGerbangTerkunci(GameObject candiObj)
    {
        Transform pintuKiri = null;
        Transform pintuKanan = null;
        GameObject palangObj = null;
        GameObject gembok1 = null;
        GameObject gembok2 = null;
        GameObject gembok3 = null;

        Transform[] allTransforms = candiObj.GetComponentsInChildren<Transform>(true);
        foreach (var t in allTransforms)
        {
            if (t == null) continue;
            string n = t.name;
            if (n.Contains("Pintu_Gerbang_Kiri")) pintuKiri = t;
            else if (n.Contains("Pintu_Gerbang_Kanan")) pintuKanan = t;
            else if (n.Contains("Palang_Besi_Pengunci")) palangObj = t.gameObject;
            else if (n.Contains("Gembok_1_Kuningan_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembok1 = t.gameObject;
            else if (n.Contains("Gembok_2_Besi_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembok2 = t.gameObject;
            else if (n.Contains("Gembok_3_Perunggu_Kuno") && !n.Contains("Shackle") && !n.Contains("Emblem") && !n.Contains("Keyhole")) gembok3 = t.gameObject;
        }

        GameObject gateTriggerObj = GameObject.Find("Sistem_Gerbang_Terkunci");
        if (gateTriggerObj == null)
        {
            gateTriggerObj = new GameObject("Sistem_Gerbang_Terkunci");
            Undo.RegisterCreatedObjectUndo(gateTriggerObj, "Create Sistem Gerbang Terkunci");
        }

        // Posisi di gerbang tengah pelataran (Z ~ 66.0)
        gateTriggerObj.transform.position = (pintuKiri != null) ? new Vector3(0f, 1.5f, pintuKiri.position.z) : new Vector3(0f, 1.5f, 66.0f);

        BoxCollider bc = gateTriggerObj.GetComponent<BoxCollider>();
        if (bc == null) bc = gateTriggerObj.AddComponent<BoxCollider>();
        bc.isTrigger = true;
        bc.size = new Vector3(10f, 4f, 6f);

        LockedGate lg = gateTriggerObj.GetComponent<LockedGate>();
        if (lg == null) lg = gateTriggerObj.AddComponent<LockedGate>();
        if (pintuKiri != null) lg.daunPintuKiri = pintuKiri;
        if (pintuKanan != null) lg.daunPintuKanan = pintuKanan;
        if (palangObj != null) lg.palangBesi = palangObj;
        if (gembok1 != null) lg.gembokRuby = gembok1;
        if (gembok2 != null) lg.gembokAmber = gembok2;
        if (gembok3 != null) lg.gembokJade = gembok3;
        lg.interactionRange = 5.0f;

        EditorUtility.SetDirty(lg);
        if (!EditorApplication.isPlaying)
        {
            EditorSceneManager.MarkSceneDirty(gateTriggerObj.scene);
        }
    }
}
