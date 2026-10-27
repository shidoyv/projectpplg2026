using UnityEngine;
using UnityEditor;
using System.Text;
using System.IO;

[InitializeOnLoad]
public static class DiagnoseCandiVisibility
{
    private static readonly string OutputPath = @"c:\Users\vincent lim\Downloads\projectpplg2026-main\scratch\unity_diagnosis.txt";

    static DiagnoseCandiVisibility()
    {
        EditorApplication.delayCall += RunDiagnosis;
    }

    [InitializeOnLoadMethod]
    public static void OnScriptReload()
    {
        EditorApplication.delayCall += RunDiagnosis;
    }

    [MenuItem("Candi Borobudur/Diagnosa Mengapa Candi Hilang")]
    public static void RunDiagnosis()
    {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine("==================================================");
        sb.AppendLine("=== DIAGNOSA SISTEM PENGLIHATAN & CANDI BOROBUDUR ===");
        sb.AppendLine($"Waktu: {System.DateTime.Now:yyyy-MM-dd HH:mm:ss}");
        sb.AppendLine("==================================================");

        // 1. Periksa Objek Player & Kamera
        GameObject player = GameObject.Find("Player");
        Camera cam = null;
        if (player == null)
        {
            sb.AppendLine("❌ Objek Player TIDAK DITEMUKAN di Scene!");
        }
        else
        {
            sb.AppendLine($"✅ Player ditemukan: Posisi={player.transform.position}, Rotasi={player.transform.eulerAngles}, Aktif={player.activeInHierarchy}");
            cam = player.GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null)
            {
                sb.AppendLine($"✅ Kamera: Nama={cam.name}, Posisi={cam.transform.position}, Rotasi={cam.transform.eulerAngles}");
                sb.AppendLine($"   FarClip={cam.farClipPlane}, NearClip={cam.nearClipPlane}, FOV={cam.fieldOfView}");
                sb.AppendLine($"   UseOcclusionCulling={cam.useOcclusionCulling}, CullingMask={cam.cullingMask} (Hex: {cam.cullingMask:X})");
                sb.AppendLine($"   ClearFlags={cam.clearFlags}, BackgroundColor={cam.backgroundColor}, Enabled={cam.enabled}");
            }
            else
            {
                sb.AppendLine("❌ Kamera TIDAK DITEMUKAN pada Player!");
            }
        }

        // 2. Periksa Senter (Flashlight)
        GameObject senterObj = GameObject.Find("Spotlight_Senter");
        if (senterObj != null)
        {
            Light spot = senterObj.GetComponent<Light>();
            FlashlightController fc = senterObj.GetComponent<FlashlightController>();
            sb.AppendLine($"✅ Spotlight_Senter ditemukan: Posisi={senterObj.transform.position}, Aktif={senterObj.activeInHierarchy}");
            if (spot != null)
            {
                sb.AppendLine($"   Light: Tipe={spot.type}, Enabled={spot.enabled}, Intensitas={spot.intensity}, Range={spot.range}, Angle={spot.spotAngle}");
            }
            if (fc != null)
            {
                sb.AppendLine($"   FlashlightController: normalIntensity={fc.normalIntensity}, range={fc.range}, isOn={fc.isOn}");
            }
        }
        else
        {
            sb.AppendLine("⚠️ Spotlight_Senter TIDAK DITEMUKAN!");
        }

        // 3. Periksa Lingkungan & Pencahayaan (RenderSettings & Directional Light)
        sb.AppendLine("\n--- PENCAHAYAAN & SKYBOX ---");
        sb.AppendLine($"AmbientMode: {RenderSettings.ambientMode}");
        sb.AppendLine($"AmbientLight: {RenderSettings.ambientLight}, AmbientIntensity: {RenderSettings.ambientIntensity}");
        sb.AppendLine($"Fog: {RenderSettings.fog}, FogMode: {RenderSettings.fogMode}, FogDensity: {RenderSettings.fogDensity}, FogColor: {RenderSettings.fogColor}");
        sb.AppendLine($"Skybox: {(RenderSettings.skybox != null ? RenderSettings.skybox.name : "null")} (Shader: {(RenderSettings.skybox != null && RenderSettings.skybox.shader != null ? RenderSettings.skybox.shader.name : "null")})");

        GameObject dirLightObj = GameObject.Find("Directional Light");
        if (dirLightObj != null)
        {
            Light dl = dirLightObj.GetComponent<Light>();
            sb.AppendLine($"Directional Light: Rotasi={dirLightObj.transform.eulerAngles}, Aktif={dirLightObj.activeInHierarchy}");
            if (dl != null)
            {
                sb.AppendLine($"   Intensitas={dl.intensity}, Warna={dl.color}, Enabled={dl.enabled}");
            }
        }

        // 4. Periksa candi_borobudur
        sb.AppendLine("\n--- CANDI BOROBUDUR ---");
        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi == null) candi = GameObject.Find("Candi_Borobudur");
        if (candi == null)
        {
            sb.AppendLine("❌ Objek candi_borobudur TIDAK DITEMUKAN di Scene!");
        }
        else
        {
            sb.AppendLine($"✅ candi_borobudur: Posisi={candi.transform.position}, Rotasi={candi.transform.eulerAngles}, Skala={candi.transform.localScale}, Aktif={candi.activeInHierarchy}, Layer={candi.layer}");
            MeshRenderer[] renderers = candi.GetComponentsInChildren<MeshRenderer>(true);
            sb.AppendLine($"   Total MeshRenderer: {renderers.Length}");

            int enabledCount = 0;
            int nullMatCount = 0;
            string sampleMatName = "None";
            string sampleShaderName = "None";

            Bounds totalBounds = new Bounds(candi.transform.position, Vector3.zero);
            bool boundInit = false;

            for (int i = 0; i < renderers.Length; i++)
            {
                var r = renderers[i];
                if (r.enabled && r.gameObject.activeInHierarchy)
                {
                    enabledCount++;
                    if (!boundInit) { totalBounds = r.bounds; boundInit = true; }
                    else totalBounds.Encapsulate(r.bounds);
                }
                if (r.sharedMaterial == null) nullMatCount++;
                else if (sampleMatName == "None")
                {
                    sampleMatName = r.sharedMaterial.name;
                    sampleShaderName = r.sharedMaterial.shader != null ? r.sharedMaterial.shader.name : "null";
                }
            }
            sb.AppendLine($"   MeshRenderer Aktif={enabledCount}, Mat Kosong={nullMatCount}");
            sb.AppendLine($"   Sample Material={sampleMatName}, Shader={sampleShaderName}");
            sb.AppendLine($"   Bounding Box Candi: Center={totalBounds.center}, Size={totalBounds.size}, Min={totalBounds.min}, Max={totalBounds.max}");
        }

        // 5. Periksa Objek-Objek dalam Jarak 30m dari Pemain (terutama yang tepat di depan kamera)
        if (player != null)
        {
            sb.AppendLine("\n--- OBJEK-OBJEK DALAM JARAK 35 METER DARI PEMAIN ---");
            Vector3 pPos = player.transform.position;
            Vector3 fwd = player.transform.forward;

            MeshRenderer[] allWorldRenderers = Object.FindObjectsByType<MeshRenderer>(FindObjectsInactive.Exclude);
            int nearbyCount = 0;

            foreach (var r in allWorldRenderers)
            {
                if (r.gameObject == player) continue;
                float dist = Vector3.Distance(pPos, r.bounds.center);
                if (dist < 35.0f)
                {
                    nearbyCount++;
                    Vector3 dir = (r.bounds.center - pPos).normalized;
                    float angle = Vector3.Angle(fwd, dir);
                    string inSight = (angle < 45f) ? "[DI DEPAN MATA]" : "[DI SAMPING/BELAKANG]";
                    sb.AppendLine($"   {inSight} {r.gameObject.name}: Jarak={dist:F1}m, Pos={r.transform.position}, BoundsCenter={r.bounds.center}, Mat={(r.sharedMaterial ? r.sharedMaterial.name : "null")}");
                }
            }
            sb.AppendLine($"Total objek aktif dalam jarak 35m: {nearbyCount}");
        }

        sb.AppendLine("==================================================");

        string output = sb.ToString();
        Debug.Log(output);

        try
        {
            string dir = Path.GetDirectoryName(OutputPath);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            File.WriteAllText(OutputPath, output, Encoding.UTF8);
            Debug.Log($"Hasil diagnosa berhasil ditulis ke: {OutputPath}");
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"Gagal menulis file diagnosa: {ex.Message}");
        }
    }
}
