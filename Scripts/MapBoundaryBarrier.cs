using UnityEngine;

/// <summary>
/// Penghalang Pagar & Batas Peta (Invisible Boundary & Fence Barrier).
/// Menghalangi pemain melompati pagar luar candi atau keluar dari batas dunia game.
/// Bekerja otomatis baik di Unity Editor maupun saat Runtime.
/// </summary>
[ExecuteAlways]
public class MapBoundaryBarrier : MonoBehaviour
{
    [Header("Pengaturan Penghalang Pagar")]
    public float fenceHeight = 30.0f;       // Tinggi dinding penghalang tak kasat mata (30 meter, tidak bisa dilompati)
    public float fenceThickness = 2.5f;     // Ketebalan fisik collider penghalang
    public float barrierCenterY = 15.0f;    // Ketinggian pusat collider dari tanah

    [Header("Batas Peta (Failsafe)")]
    public float maxPlayableRadius = 145.0f; // Radius aman pelataran (pagar di 125m, batas di 145m)
    public float minFallY = -3.0f;           // Titik jatuh minimal sebelum di-teleport balik
    public Transform safeRespawnPoint;

    private static MapBoundaryBarrier _instance;
    public static MapBoundaryBarrier Instance => _instance;

    private void Awake()
    {
        _instance = this;
        EnsureAllBarriers();
    }

    private void Start()
    {
        EnsureAllBarriers();
    }

#if UNITY_EDITOR
    private void OnValidate()
    {
        EnsureAllBarriers();
    }
#endif

    [ContextMenu("Buat / Perbarui Semua Penghalang")]
    public void EnsureAllBarriers()
    {
        // 1. Pagar Timur (East: X = 125, Z = 0, panjang 256m)
        SetupBarrierBox("Penghalang_Pagar_Timur", 
            new Vector3(125.0f, barrierCenterY, 0f), 
            new Vector3(fenceThickness, fenceHeight, 256.0f));

        // 2. Pagar Barat (West: X = -125, Z = 0, panjang 256m)
        SetupBarrierBox("Penghalang_Pagar_Barat", 
            new Vector3(-125.0f, barrierCenterY, 0f), 
            new Vector3(fenceThickness, fenceHeight, 256.0f));

        // 3. Pagar Utara (North: Z = -125, X = 0, panjang 256m)
        SetupBarrierBox("Penghalang_Pagar_Utara", 
            new Vector3(0f, barrierCenterY, -125.0f), 
            new Vector3(256.0f, fenceHeight, fenceThickness));

        // 4. Pagar Selatan Sayap Barat (South West Wing: Z = 125, X = -64, panjang 122.5m)
        SetupBarrierBox("Penghalang_Pagar_Selatan_Barat", 
            new Vector3(-64.0f, barrierCenterY, 125.0f), 
            new Vector3(122.5f, fenceHeight, fenceThickness));

        // 5. Pagar Selatan Sayap Timur (South East Wing: Z = 125, X = 64, panjang 122.5m)
        SetupBarrierBox("Penghalang_Pagar_Selatan_Timur", 
            new Vector3(64.0f, barrierCenterY, 125.0f), 
            new Vector3(122.5f, fenceHeight, fenceThickness));

        // 6. Penghalang Atas Gerbang Selatan (Above South Gate: Y = 5.5 ke atas agar tidak bisa dilompati, namun bawahnya bisa dilewati)
        SetupBarrierBox("Penghalang_Atas_Gerbang_Selatan", 
            new Vector3(0f, 17.5f, 125.0f), 
            new Vector3(6.5f, 25.0f, fenceThickness));

        // 7. Batas Paling Luar Pelataran (Outer Edge of Courtyard Ground ±175)
        SetupBarrierBox("Batas_Luar_Pelataran_Timur", new Vector3(175.0f, 20f, 0f), new Vector3(4f, 40f, 360f));
        SetupBarrierBox("Batas_Luar_Pelataran_Barat", new Vector3(-175.0f, 20f, 0f), new Vector3(4f, 40f, 360f));
        SetupBarrierBox("Batas_Luar_Pelataran_Utara", new Vector3(0f, 20f, -175.0f), new Vector3(360f, 40f, 4f));
        SetupBarrierBox("Batas_Luar_Pelataran_Selatan", new Vector3(0f, 20f, 175.0f), new Vector3(360f, 40f, 4f));

        // 8. Lantai Pengaman Bawah Jurang (Catch Pit di Y = -4)
        SetupFloorTrigger("Lantai_Pengaman_Jatuh", new Vector3(0f, -4.0f, 0f), new Vector3(600f, 2f, 600f));
    }

    private GameObject SetupBarrierBox(string barrierName, Vector3 pos, Vector3 size)
    {
        Transform child = transform.Find(barrierName);
        GameObject obj;
        if (child == null)
        {
            obj = new GameObject(barrierName);
            obj.transform.SetParent(transform, false);
        }
        else
        {
            obj = child.gameObject;
        }

        obj.transform.position = pos;
        obj.transform.rotation = Quaternion.identity;
        obj.transform.localScale = Vector3.one;

        BoxCollider bc = obj.GetComponent<BoxCollider>();
        if (bc == null) bc = obj.AddComponent<BoxCollider>();
        bc.size = size;
        bc.center = Vector3.zero;
        bc.isTrigger = false; // Solid physical collider (CharacterController tidak bisa tembus)
        bc.enabled = true;

        return obj;
    }

    private GameObject SetupFloorTrigger(string triggerName, Vector3 pos, Vector3 size)
    {
        Transform child = transform.Find(triggerName);
        GameObject obj;
        if (child == null)
        {
            obj = new GameObject(triggerName);
            obj.transform.SetParent(transform, false);
        }
        else
        {
            obj = child.gameObject;
        }

        obj.transform.position = pos;
        obj.transform.rotation = Quaternion.identity;
        obj.transform.localScale = Vector3.one;

        BoxCollider bc = obj.GetComponent<BoxCollider>();
        if (bc == null) bc = obj.AddComponent<BoxCollider>();
        bc.size = size;
        bc.center = Vector3.zero;
        bc.isTrigger = true; // Trigger zone untuk mendeteksi jika pemain jatuh
        bc.enabled = true;

        return obj;
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player") || other.GetComponent<CharacterController>() != null)
        {
            KembalikanPemainKePelataran(other.gameObject);
        }
    }

    private void Update()
    {
        if (!Application.isPlaying) return;

        // Failsafe monitoring posisi pemain setiap frame
        GameObject player = GameObject.FindWithTag("Player");
        if (player == null) player = GameObject.Find("Player");
        if (player != null)
        {
            Vector3 p = player.transform.position;
            // Jika jatuh ke bawah tanah atau menembus keluar batas pelataran
            if (p.y < minFallY || Mathf.Abs(p.x) > maxPlayableRadius || Mathf.Abs(p.z) > maxPlayableRadius)
            {
                KembalikanPemainKePelataran(player);
            }
        }
    }

    public void KembalikanPemainKePelataran(GameObject player)
    {
        if (player == null) return;

        Vector3 respawnPos = new Vector3(0f, 1.0f, 118.0f); // Titik aman di depan gerbang
        if (safeRespawnPoint != null)
        {
            respawnPos = safeRespawnPoint.position;
        }
        else
        {
            GameObject sp = GameObject.Find("Titik_Spawn_Pemain");
            if (sp != null) respawnPos = sp.transform.position;
        }

        PlayerController pc = player.GetComponent<PlayerController>();
        if (pc != null)
        {
            pc.TeleportTo(respawnPos, Quaternion.Euler(0f, 180f, 0f));
            return;
        }

        CharacterController cc = player.GetComponent<CharacterController>();
        if (cc != null) cc.enabled = false;
        player.transform.position = respawnPos;
        player.transform.rotation = Quaternion.Euler(0f, 180f, 0f);
        if (cc != null) cc.enabled = true;
    }

#if UNITY_EDITOR
    private void OnDrawGizmos()
    {
        Gizmos.color = new Color(0.15f, 0.90f, 0.95f, 0.35f);
        // Visualisasi garis batas penghalang di Scene View
        Gizmos.DrawWireCube(new Vector3(125.0f, barrierCenterY, 0f), new Vector3(fenceThickness, fenceHeight, 256.0f));
        Gizmos.DrawWireCube(new Vector3(-125.0f, barrierCenterY, 0f), new Vector3(fenceThickness, fenceHeight, 256.0f));
        Gizmos.DrawWireCube(new Vector3(0f, barrierCenterY, -125.0f), new Vector3(256.0f, fenceHeight, fenceThickness));
        Gizmos.DrawWireCube(new Vector3(-64.0f, barrierCenterY, 125.0f), new Vector3(122.5f, fenceHeight, fenceThickness));
        Gizmos.DrawWireCube(new Vector3(64.0f, barrierCenterY, 125.0f), new Vector3(122.5f, fenceHeight, fenceThickness));
        Gizmos.DrawWireCube(new Vector3(0f, 17.5f, 125.0f), new Vector3(6.5f, 25.0f, fenceThickness));
    }
#endif
}
