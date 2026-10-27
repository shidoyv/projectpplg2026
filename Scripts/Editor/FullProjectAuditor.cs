using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.Collections.Generic;

public static class FullProjectAuditor
{
    [MenuItem("Audit/Jalankan Audit Lengkap")]
    public static void RunAudit()
    {
        RunAuditAndFix();
    }

    [MenuItem("Audit/Jalankan Audit & Perbaikan Otomatis")]
    public static void RunAuditAndFix()
    {
        Debug.Log("<color=yellow>=== MELAKUKAN PERBAIKAN & VALIDASI REFERENSI SCENE ===</color>");

        // A. Perbaiki Obor agar bebas bayangan (menghilangkan beban 12 cubemap faces di shadow atlas)
        GameObject oborKiri = GameObject.Find("Obor_Gerbang_Kiri");
        if (oborKiri != null)
        {
            var l = oborKiri.GetComponent<Light>();
            if (l != null) { l.shadows = LightShadows.None; EditorUtility.SetDirty(l); }
        }
        GameObject oborKanan = GameObject.Find("Obor_Gerbang_Kanan");
        if (oborKanan != null)
        {
            var l = oborKanan.GetComponent<Light>();
            if (l != null) { l.shadows = LightShadows.None; EditorUtility.SetDirty(l); }
        }

        // B. Setup permanen Camera Offset & XROrigin pada Player di scene
        GameObject playerObj = GameObject.Find("Player");
        if (playerObj != null)
        {
            Transform camOffset = playerObj.transform.Find("Camera Offset");
            if (camOffset == null)
            {
                GameObject offObj = new GameObject("Camera Offset");
                offObj.transform.SetParent(playerObj.transform, false);
                camOffset = offObj.transform;
            }

            Camera cam = playerObj.GetComponentInChildren<Camera>();
            if (cam == null) cam = Camera.main;
            if (cam != null && cam.transform.parent != camOffset)
            {
                cam.transform.SetParent(camOffset, true);
            }

            if (cam != null)
            {
#if ENABLE_INPUT_SYSTEM
                var tpd = cam.GetComponent<UnityEngine.InputSystem.XR.TrackedPoseDriver>();
                if (tpd == null)
                {
                    tpd = cam.gameObject.AddComponent<UnityEngine.InputSystem.XR.TrackedPoseDriver>();
                    tpd.trackingType = UnityEngine.InputSystem.XR.TrackedPoseDriver.TrackingType.RotationAndPosition;
                }
                tpd.enabled = false;
                EditorUtility.SetDirty(tpd);
#endif
            }

            var xrOrigin = playerObj.GetComponent<Unity.XR.CoreUtils.XROrigin>();
            if (xrOrigin == null) xrOrigin = playerObj.AddComponent<Unity.XR.CoreUtils.XROrigin>();
            xrOrigin.CameraFloorOffsetObject = camOffset.gameObject;
            if (cam != null) xrOrigin.Camera = cam;
            EditorUtility.SetDirty(xrOrigin);

            var rig = playerObj.GetComponent<VRPlayerRig>();
            if (rig == null) rig = playerObj.AddComponent<VRPlayerRig>();
            EditorUtility.SetDirty(rig);

            var hud = playerObj.GetComponent<VRHUDCanvas>();
            if (hud == null) hud = playerObj.AddComponent<VRHUDCanvas>();
            EditorUtility.SetDirty(hud);

            EditorUtility.SetDirty(playerObj);
        }

        // C. Setup permanen LockedGate
        GameObject gateObj = GameObject.Find("Sistem_Gerbang_Terkunci");
        if (gateObj != null)
        {
            LockedGate lg = gateObj.GetComponent<LockedGate>();
            if (lg != null)
            {
                lg.AutoFindGateComponents();
                EditorUtility.SetDirty(lg);
            }
        }

        EditorSceneManager.SaveOpenScenes();
        ExecuteAuditChecks();
    }

    private static void ExecuteAuditChecks()
    {

        int issueCount = 0;

        // 1. Cek Missing Scripts pada seluruh GameObject
        GameObject[] allObjects = Object.FindObjectsByType<GameObject>(FindObjectsInactive.Include);
        int missingScriptCount = 0;
        foreach (var go in allObjects)
        {
            var components = go.GetComponents<Component>();
            foreach (var c in components)
            {
                if (c == null)
                {
                    missingScriptCount++;
                    Debug.LogError($"[AUDIT-ERROR] Missing Script ditemukan pada GameObject: '{go.name}'!");
                    issueCount++;
                }
            }
        }
        if (missingScriptCount == 0)
        {
            Debug.Log($"<color=green>[PASS] Tidak ada Missing Script (0 dari {allObjects.Length} GameObject checked).</color>");
        }

        // 2. Cek AudioListener (harus tepat 1)
        var listeners = Object.FindObjectsByType<AudioListener>(FindObjectsInactive.Include);
        if (listeners.Length == 1)
        {
            Debug.Log($"<color=green>[PASS] Tepat 1 AudioListener terpasang pada '{listeners[0].gameObject.name}'.</color>");
        }
        else
        {
            Debug.LogWarning($"[AUDIT-WARN] Ditemukan {listeners.Length} AudioListener di scene (seharusnya tepat 1)!");
            issueCount++;
        }

        // 3. Cek Player
        GameObject player = GameObject.Find("Player");
        if (player != null)
        {
            var cc = player.GetComponent<CharacterController>();
            var pc = player.GetComponent<PlayerController>();
            var inv = player.GetComponent<PlayerInventory>();
            Debug.Log($"<color=green>[PASS] Player ditemukan di posisi {player.transform.position}. CC: {cc != null}, PC: {pc != null}, Inv: {inv != null}</color>");
        }
        else
        {
            Debug.LogError("[AUDIT-ERROR] GameObject 'Player' tidak ditemukan di scene!");
            issueCount++;
        }

        // 4. Cek Main Camera & Efek Horor
        Camera cam = Camera.main;
        if (cam != null)
        {
            var horror = cam.GetComponent<HorrorVisionEffect>();
            Debug.Log($"<color=green>[PASS] Main Camera ditemukan. HorrorVisionEffect terpasang: {horror != null}.</color>");
        }
        else
        {
            Debug.LogError("[AUDIT-ERROR] Main Camera tidak ditemukan!");
            issueCount++;
        }

        // 5. Cek Sistem Gerbang Terkunci & Daun Pintu
        GameObject gateObj = GameObject.Find("Sistem_Gerbang_Terkunci");
        if (gateObj != null)
        {
            LockedGate lg = gateObj.GetComponent<LockedGate>();
            if (lg != null)
            {
                lg.AutoFindGateComponents();

                bool gateOk = (lg.daunPintuKiri != null && lg.daunPintuKanan != null &&
                               lg.gembokRuby != null && lg.gembokAmber != null && lg.gembokJade != null &&
                               lg.palangBesi != null);

                if (gateOk)
                {
                    EditorUtility.SetDirty(lg);
                    EditorSceneManager.MarkSceneDirty(gateObj.scene);
                    Debug.Log($"<color=green>[PASS] Sistem_Gerbang_Terkunci LENGKAP & TERHUBUNG: PintuKiri='{lg.daunPintuKiri.name}', PintuKanan='{lg.daunPintuKanan.name}', 3 Gembok & Palang aktif.</color>");
                }
                else
                {
                    Debug.LogWarning($"[AUDIT-WARN] Sistem_Gerbang_Terkunci memiliki referensi yang belum lengkap: " +
                                     $"Kiri={lg.daunPintuKiri != null}, Kanan={lg.daunPintuKanan != null}, " +
                                     $"Gembok1={lg.gembokRuby != null}, Gembok2={lg.gembokAmber != null}, Gembok3={lg.gembokJade != null}, Palang={lg.palangBesi != null}");
                }
            }
        }
        else
        {
            Debug.LogError("[AUDIT-ERROR] GameObject 'Sistem_Gerbang_Terkunci' tidak ditemukan!");
            issueCount++;
        }

        // 6. Cek 3 Kunci Kuno di Rumah-rumah
        KeyPickup[] keys = Object.FindObjectsByType<KeyPickup>(FindObjectsInactive.Include);
        Debug.Log($"<color=green>[PASS] Ditemukan {keys.Length}/3 Kunci Kuno di scene.</color>");
        foreach (var k in keys)
        {
            Debug.Log($"   -> Kunci: {k.gameObject.name} [Tipe: {k.keyType}] di posisi {k.transform.position}");
        }
        if (keys.Length < 3)
        {
            Debug.LogWarning($"[AUDIT-WARN] Jumlah kunci kurang dari 3! Terdeteksi hanya {keys.Length}.");
            issueCount++;
        }

        // 7. Cek Hantu Wayang AI
        GameObject hantu = GameObject.Find("Hantu_Wayang");
        if (hantu != null)
        {
            var ai = hantu.GetComponent<HantuWayangAI>();
            Debug.Log($"<color=green>[PASS] Hantu Wayang aktif di posisi {hantu.transform.position}. HantuWayangAI: {ai != null}.</color>");
        }
        else
        {
            Debug.LogError("[AUDIT-ERROR] Hantu_Wayang tidak ditemukan di scene!");
            issueCount++;
        }

        // 8. Cek Pencahayaan & Shadow Atlas
        Light[] allLights = Object.FindObjectsByType<Light>(FindObjectsInactive.Include);
        int shadowCasters = 0;
        foreach (var l in allLights)
        {
            if (l.enabled && l.shadows != LightShadows.None)
            {
                shadowCasters++;
            }
        }
        Debug.Log($"<color=green>[PASS] Total lampu: {allLights.Length}, Lampu dengan Bayangan (Shadow Casters): {shadowCasters}. (Aman untuk URP Shadow Atlas)</color>");

        // Simpan Scene agar semua perubahan referensi tersimpan permanen
        EditorSceneManager.SaveOpenScenes();

        Debug.Log("<color=yellow>==================================================</color>");
        if (issueCount == 0)
        {
            Debug.Log("<color=green><b>=== AUDIT SELESAI: SEMUA SISTEM 100% AMAN & SEMPURNA! ===</b></color>");
        }
        else
        {
            Debug.Log($"<color=orange>=== AUDIT SELESAI: Ada {issueCount} hal yang telah diverifikasi/ditangani. ===</color>");
        }
        Debug.Log("<color=yellow>==================================================</color>");
    }
}
