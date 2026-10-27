using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.IO;

[InitializeOnLoad]
public static class ApplyCandiTextures
{
    static ApplyCandiTextures()
    {
        EditorApplication.delayCall += OnEditorLoaded;
    }

    private static void OnEditorLoaded()
    {
        EnsureMaterialsCreated();
        ApplyTexturesToScene(false);
    }

    [MenuItem("Candi Borobudur/Pasang Tekstur Batu Candi & Hutan (Apply Textures)")]
    public static void ApplyTexturesMenu()
    {
        EnsureMaterialsCreated();
        ApplyTexturesToScene(true);
    }

    public static void EnsureMaterialsCreated()
    {
        string matFolder = "Assets/Materials";
        if (!AssetDatabase.IsValidFolder(matFolder))
        {
            AssetDatabase.CreateFolder("Assets", "Materials");
        }

        Shader urpShader = Shader.Find("Universal Render Pipeline/Lit");
        if (urpShader == null) urpShader = Shader.Find("Universal Render Pipeline/Simple Lit");
        if (urpShader == null) urpShader = Shader.Find("Standard");

        // Set texture wrap mode to Repeat
        SetupTextureWrap("Assets/Textures/batu_andesit_relief.jpg");
        SetupTextureWrap("Assets/Textures/batu_candi_blok.jpg");
        SetupTextureWrap("Assets/Textures/tanah_pelataran.jpg");
        SetupTextureWrap("Assets/Textures/batang_pohon.jpg");

        // 1. Mat_Batu_Andesit_Relief (Dinding relief & badan utama candi)
        CreateOrUpdateMaterial(
            "Assets/Materials/Mat_Batu_Andesit_Relief.mat",
            urpShader,
            "Assets/Textures/batu_andesit_relief.jpg",
            new Vector2(4f, 4f),
            0.15f,
            0.0f,
            new Color(0.85f, 0.85f, 0.85f, 1f)
        );

        // 2. Mat_Batu_Candi_Blok (Stupa & pelataran atas)
        CreateOrUpdateMaterial(
            "Assets/Materials/Mat_Batu_Candi_Blok.mat",
            urpShader,
            "Assets/Textures/batu_candi_blok.jpg",
            new Vector2(6f, 6f),
            0.20f,
            0.0f,
            new Color(0.80f, 0.80f, 0.80f, 1f)
        );

        // 3. Mat_Tanah_Pelataran (Tanah pelataran & walkway)
        CreateOrUpdateMaterial(
            "Assets/Materials/Mat_Tanah_Pelataran.mat",
            urpShader,
            "Assets/Textures/tanah_pelataran.jpg",
            new Vector2(10f, 10f),
            0.10f,
            0.0f,
            new Color(0.75f, 0.75f, 0.75f, 1f)
        );

        // 4. Mat_Batang_Pohon (Pohon-pohon horor)
        CreateOrUpdateMaterial(
            "Assets/Materials/Mat_Batang_Pohon.mat",
            urpShader,
            "Assets/Textures/batang_pohon.jpg",
            new Vector2(2f, 6f),
            0.10f,
            0.0f,
            new Color(0.70f, 0.70f, 0.70f, 1f)
        );

        AssetDatabase.SaveAssets();
    }

    private static void SetupTextureWrap(string path)
    {
        TextureImporter ti = AssetImporter.GetAtPath(path) as TextureImporter;
        if (ti != null)
        {
            bool changed = false;
            if (ti.wrapMode != TextureWrapMode.Repeat)
            {
                ti.wrapMode = TextureWrapMode.Repeat;
                changed = true;
            }
            if (changed)
            {
                ti.SaveAndReimport();
            }
        }
    }

    private static Material CreateOrUpdateMaterial(string matPath, Shader shader, string texPath, Vector2 tiling, float smoothness, float metallic, Color color)
    {
        Material mat = AssetDatabase.LoadAssetAtPath<Material>(matPath);
        if (mat == null)
        {
            mat = new Material(shader);
            AssetDatabase.CreateAsset(mat, matPath);
        }
        else
        {
            if (shader != null && mat.shader != shader)
            {
                mat.shader = shader;
            }
        }

        Texture2D tex = AssetDatabase.LoadAssetAtPath<Texture2D>(texPath);
        if (tex != null)
        {
            mat.SetTexture("_BaseMap", tex);
            mat.SetTextureScale("_BaseMap", tiling);
            mat.SetTexture("_MainTex", tex);
            mat.SetTextureScale("_MainTex", tiling);
        }

        mat.SetColor("_BaseColor", color);
        mat.SetColor("_Color", color);
        mat.SetFloat("_Smoothness", smoothness);
        mat.SetFloat("_Metallic", metallic);

        EditorUtility.SetDirty(mat);
        return mat;
    }

    public static void ApplyTexturesToScene(bool showDialog)
    {
        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi == null) candi = GameObject.Find("Candi_Borobudur");

        if (candi == null)
        {
            foreach (var root in UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects())
            {
                if (root.name.ToLower().Contains("candi") || root.transform.childCount > 50)
                {
                    candi = root;
                    break;
                }
            }
        }

        if (candi == null)
        {
            if (showDialog)
            {
                EditorUtility.DisplayDialog("Candi Borobudur", "Objek candi_borobudur tidak ditemukan di Scene aktif! Silakan seret model candi_borobudur ke Scene terlebih dahulu.", "OK");
            }
            return;
        }

        Material andesiteRelief = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Andesit_Relief.mat");
        Material andesiteBlok = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batu_Candi_Blok.mat");
        Material tanahPelataran = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Tanah_Pelataran.mat");
        Material batangPohon = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/Mat_Batang_Pohon.mat");

        MeshRenderer[] renderers = candi.GetComponentsInChildren<MeshRenderer>(true);
        int count = 0;

        Undo.RecordObjects(renderers, "Terapkan Tekstur Candi Borobudur");

        foreach (var mr in renderers)
        {
            string n = mr.gameObject.name;

            if (n.StartsWith("Terrain_") || n.Contains("Tanah") || n.Contains("Ground") || n.Contains("Halaman"))
            {
                if (tanahPelataran != null) mr.sharedMaterial = tanahPelataran;
            }
            else if (n.StartsWith("Walkway_") || n.Contains("Paved") || n.Contains("Jalan"))
            {
                if (tanahPelataran != null) mr.sharedMaterial = tanahPelataran;
            }
            else if (n.StartsWith("Tree_Trunk_") || n.StartsWith("Horror_Tree") || n.Contains("Tree") || n.Contains("Pohon"))
            {
                if (batangPohon != null) mr.sharedMaterial = batangPohon;
            }
            else if (n.StartsWith("Tree_Foliage_") || n.Contains("Foliage") || n.Contains("Daun"))
            {
                if (batangPohon != null) mr.sharedMaterial = batangPohon;
            }
            else if (n.Contains("Stupa") || n.Contains("Arupadhatu") || n.Contains("Pinnacle") || n.Contains("Dome"))
            {
                if (andesiteBlok != null) mr.sharedMaterial = andesiteBlok;
            }
            else
            {
                if (andesiteRelief != null) mr.sharedMaterial = andesiteRelief;
            }

            EditorUtility.SetDirty(mr);
            count++;
        }

        EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
        Debug.Log($"<color=green>✅ Berhasil memasang tekstur pada {count} objek di {candi.name}!</color>");

        if (showDialog)
        {
            EditorUtility.DisplayDialog("Sukses", $"Berhasil memasang tekstur pada {count} bagian di Candi Borobudur!", "Mantap!");
        }
    }
}
