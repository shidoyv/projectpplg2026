using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.IO;

[InitializeOnLoad]
public static class FixVisibilityAndLighting
{
    static FixVisibilityAndLighting()
    {
        EditorApplication.delayCall += ExecuteFix;
    }

    [MenuItem("Candi Borobudur/Perbaiki Penglihatan & Pencahayaan Sekarang")]
    public static void ExecuteFix()
    {
        Debug.Log("<color=cyan>=== [PERBAIKAN] MENYETEL ULANG PENCAHAYAAN & PENGLIHATAN KAMERA ===</color>");

        var scene = EditorSceneManager.GetActiveScene();
        if (!scene.isLoaded || string.IsNullOrEmpty(scene.path))
        {
            scene = EditorSceneManager.OpenScene("Assets/Scenes/SampleScene.unity");
        }

        bool isURP = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline != null;
        Debug.Log($"Render Pipeline terdeteksi: {(isURP ? "URP" : "Built-in / Standard")}");

        // 1. PERBAIKI DIRECTIONAL LIGHT (REMBULAN MALAM HOROR)
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
        if (dirLightObj == null)
        {
            dirLightObj = new GameObject("Directional Light");
        }

        dirLightObj.SetActive(true);
        dirLightObj.transform.rotation = Quaternion.Euler(48f, -25f, 0f); // Menyinari candi & pelataran dari arah tenggara ke barat laut

        Light dirLight = dirLightObj.GetComponent<Light>();
        if (dirLight == null) dirLight = dirLightObj.AddComponent<Light>();
        dirLight.type = LightType.Directional;
        dirLight.color = new Color(0.38f, 0.50f, 0.72f); // Cahaya rembulan perak kebiruan
        dirLight.intensity = 0.04f;      // Terang & jelas menerangi seluruh area candi & pepohonan
        dirLight.shadows = LightShadows.Soft;
        dirLight.enabled = true;
        RenderSettings.sun = dirLight;

        // 2. PERBAIKI AMBIENT LIGHT & HAPUS FOG PEKAT
        RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
        RenderSettings.ambientSkyColor = new Color(0.28f, 0.38f, 0.55f);     // Langit malam temaram
        RenderSettings.ambientEquatorColor = new Color(0.18f, 0.25f, 0.38f); // Horison malam
        RenderSettings.ambientGroundColor = new Color(0.12f, 0.16f, 0.24f);  // Pijakan tanah/batu
        RenderSettings.ambientIntensity = 2.0f;
        RenderSettings.reflectionIntensity = 0.6f;
        RenderSettings.fog = false; // Matikan black fog yang membutakan pandangan!
        DynamicGI.UpdateEnvironment();

        // 3. PERBAIKI SKYBOX EXPOSURE
        if (RenderSettings.skybox != null)
        {
            if (RenderSettings.skybox.HasProperty("_Exposure")) RenderSettings.skybox.SetFloat("_Exposure", 0.45f);
            if (RenderSettings.skybox.HasProperty("_SkyTint")) RenderSettings.skybox.SetColor("_SkyTint", new Color(0.18f, 0.25f, 0.40f, 1.0f));
            if (RenderSettings.skybox.HasProperty("_GroundColor")) RenderSettings.skybox.SetColor("_GroundColor", new Color(0.14f, 0.18f, 0.28f, 1.0f));
            EditorUtility.SetDirty(RenderSettings.skybox);
        }

        // 4. PERBAIKI PLAYER & KAMERA
        GameObject player = GameObject.Find("Player");
        if (player != null)
        {
            FirstPersonMovement fpm = player.GetComponent<FirstPersonMovement>();
            if (fpm == null) fpm = player.AddComponent<FirstPersonMovement>();

            fpm.spawnLocation = PlayerSpawnLocation.SouthMainEntrance;
            fpm.spawnPosition = new Vector3(0f, 1.5f, 48.0f);
            fpm.spawnRotationY = 180.0f;
            fpm.enforceSpawnOnStart = true;
            fpm.cameraFarClip = 2000.0f;

            CharacterController cc = player.GetComponent<CharacterController>();
            if (cc != null)
            {
                cc.enabled = false;
                player.transform.position = new Vector3(0f, 1.5f, 48.0f);
                player.transform.rotation = Quaternion.Euler(0f, 180.0f, 0f);
                cc.enabled = true;
            }

            // Kamera
            Camera cam = player.GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null)
            {
                cam.transform.SetParent(player.transform);
                cam.transform.localPosition = new Vector3(0f, 1.6f, 0.15f);
                cam.transform.localRotation = Quaternion.identity;
                cam.fieldOfView = 75.0f;
                cam.nearClipPlane = 0.05f;
                cam.farClipPlane = 500.0f;
                cam.cullingMask = -1; // Render SEMUA layer (Everything)
                cam.useOcclusionCulling = false; // Bebas dari culling pop-in
                cam.clearFlags = CameraClearFlags.Skybox;
                cam.depth = 100f;
                fpm.cameraTransform = cam.transform;

                // Senter (Spotlight_Senter)
                Transform senterT = cam.transform.Find("Spotlight_Senter");
                GameObject senterObj;
                if (senterT == null)
                {
                    senterObj = new GameObject("Spotlight_Senter");
                    senterObj.transform.SetParent(cam.transform, false);
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
                spot.range = 48.0f;       // Sorot panjang 100 meter
                spot.spotAngle = 68.0f;     // Sudut lebar 72 derajat
                spot.innerSpotAngle = 36.0f;
                spot.color = new Color(1.0f, 0.97f, 0.90f);
                spot.intensity = 32.0f;
                spot.shadows = LightShadows.Soft;
                spot.enabled = true;

                FlashlightController fc = senterObj.GetComponent<FlashlightController>();
                if (fc == null) fc = senterObj.AddComponent<FlashlightController>();
                fc.flashlight = spot;
                fc.normalIntensity = 32.0f;
                fc.range = 48.0f;
                fc.spotAngle = 68.0f;
                fc.innerSpotAngle = 38.0f;
                fc.isOn = true;
                fc.enforcePitchBlackAtRuntime = true;

                // Fill Light di sekitar pemain
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
                fillL.range = 4.0f;
                fillL.intensity = 0.15f;
                fillL.color = new Color(1.0f, 0.96f, 0.88f);
                fillL.shadows = LightShadows.None;
                fillL.enabled = false;
                fc.fillLight = fillL;

                EditorUtility.SetDirty(cam);
                EditorUtility.SetDirty(spot);
                EditorUtility.SetDirty(fc);
            }

            EditorUtility.SetDirty(player);
        }

        // Matikan objek Horror_Moon jika menutupi pandangan
        GameObject moon = GameObject.Find("Horror_Moon");
        if (moon != null) moon.SetActive(false);

        // Simpan perubahan ke Scene
        EditorSceneManager.MarkSceneDirty(scene);
        EditorSceneManager.SaveScene(scene);
        Debug.Log("<color=green>✅ [SUKSES] Pencahayaan & Penglihatan Scene berhasil diperbaiki dan disimpan!</color>");
    }
}
