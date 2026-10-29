using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

[InitializeOnLoad]
public static class SetupRealisticKeys
{
    static SetupRealisticKeys()
    {
        EditorApplication.delayCall += TerapkanModelKunciRealistis;
    }

    [MenuItem("Tools/Terapkan Model Kunci Realistis (Bukan Bulat)")]
    public static void TerapkanModelKunciRealistis()
    {
        Scene activeScene = SceneManager.GetActiveScene();
        if (!activeScene.isLoaded) return;

        // 1. Dapatkan atau buat mesh kunci realistis sebagai asset
        Mesh keyMesh = KeyPickup.GetOrCreateRealisticKeyMesh();
        if (keyMesh == null)
        {
            Debug.LogError("[KUNCI REALISTIS] Gagal membuat mesh kunci realistis!");
            return;
        }

        string assetPath = "Assets/Models/Realistic_Antique_Key_Mesh.asset";
        Mesh savedMesh = AssetDatabase.LoadAssetAtPath<Mesh>(assetPath);
        if (savedMesh == null)
        {
            Mesh meshCopy = Object.Instantiate(keyMesh);
            meshCopy.name = "Realistic_Antique_Key_Mesh";
            AssetDatabase.CreateAsset(meshCopy, assetPath);
            AssetDatabase.SaveAssets();
            savedMesh = meshCopy;
        }

        // 2. Cari 3 kunci kuno di scene
        string[] keyNames = new string[]
        {
            "Kunci_1_Kuningan_Dukun",
            "Kunci_2_Besi_Omah",
            "Kunci_3_Perunggu_Punden"
        };

        bool anyModified = false;

        foreach (string name in keyNames)
        {
            GameObject keyObj = GameObject.Find(name);
            if (keyObj == null) continue;

            MeshFilter mf = keyObj.GetComponent<MeshFilter>();
            if (mf == null) mf = keyObj.AddComponent<MeshFilter>();

            if (mf.sharedMesh == null || mf.sharedMesh.name == "Sphere" || mf.sharedMesh.name.Contains("Sphere") || mf.sharedMesh != savedMesh)
            {
                Undo.RecordObject(mf, "Terapkan Model Kunci Realistis");
                mf.sharedMesh = savedMesh;
                anyModified = true;
            }

            // Atur skala agar proporsional dan gagah di atas altar joglo
            Transform t = keyObj.transform;
            if (t.localScale.x > 1.8f || t.localScale.x < 0.5f)
            {
                Undo.RecordObject(t, "Sesuaikan Skala Kunci Realistis");
                t.localScale = new Vector3(1.2f, 1.2f, 1.2f);
                anyModified = true;
            }

            // Pastikan collider nyaman
            SphereCollider sc = keyObj.GetComponent<SphereCollider>();
            if (sc != null)
            {
                Undo.RecordObject(sc, "Sesuaikan Collider Kunci");
                sc.radius = 0.65f;
                sc.center = new Vector3(0f, 0.05f, 0f);
            }

            // Pastikan komponen KeyPickup aktif
            KeyPickup kp = keyObj.GetComponent<KeyPickup>();
            if (kp == null) kp = keyObj.AddComponent<KeyPickup>();
        }

        if (anyModified)
        {
            EditorSceneManager.MarkSceneDirty(activeScene);
            Debug.Log("<color=green><b>[SUKSES]</b> Ketiga kunci telah diganti dari bola bulat menjadi model 3D Kunci Kuno Antik (Realistic Skeleton Key) berornamen klasik!</color>");
        }
    }
}
