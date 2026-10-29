using System.Collections.Generic;
using UnityEngine;

public class HantuWayangAI : MonoBehaviour
{
    [Header("Target & Referensi")]
    public Transform player;
    public PlayerController playerController;
    public BoxCollider areaKotakDalam;

    [Header("Batas Area Kotak Dalam (Seluruh Daerah di Dalam Pagar)")]
    public Vector3 boxCenter = new Vector3(0f, 0.5f, 0f);
    public Vector3 boxSize = new Vector3(240f, 4f, 240f);

    [Header("Perilaku Kecepatan & Deteksi (Mode Agresif / Sulit)")]
    public float patrolSpeed = 4.5f;             // Patroli gesit (sama dengan kecepatan jalan pemain)
    public float chaseSpeed = 7.2f;              // Kecepatan kejar tinggi (pemain harus sprint 8.0 m/s untuk kabur!)
    public float detectionRadius = 60.0f;        // Jarak deteksi dasar (sangat peka)
    public float flashlightBonusRange = 45.0f;   // Bonus jarak jika senter pemain menyala (hingga 105m!)
    public float sprintBonusRange = 30.0f;       // Bonus jarak jika pemain lari/sprint (langkah kaki terdengar hingga 90m!)
    public float loseTargetDistance = 90.0f;     // Hantu tidak mudah menyerah mengejar
    public float attackRadius = 2.0f;
    public float minSpawnDistFromPlayer = 20.0f;

    [Header("Perburuan Cerdas (Stalking Sekitar Pemain & Rumah Kunci)")]
    [Range(0f, 1f)]
    public float stalkNearPlayerChance = 0.70f;  // 70% waktu berpatroli mendekati radius sekitar pemain
    public float minStalkDist = 18.0f;           // Mengintai di jarak 18 - 42 meter
    public float maxStalkDist = 42.0f;

    [Header("Titik & Konfigurasi Kemunculan Acak (Random Spawn System)")]
    [Tooltip("Daftar titik Transform di scene jika ingin menentukan spawn point kustom di Inspector. Jika kosong, sistem otomatis menggunakan zona acak seluruh candi.")]
    public Transform[] customSpawnPoints;
    [Tooltip("Jarak aman minimal dari pemain saat kemunculan awal/respawn agar tidak langsung menempel.")]
    public float minInitialSpawnDist = 40.0f;
    [Tooltip("Apakah relokasi acak otomatis aktif saat pemain sedang eksplorasi.")]
    public bool autoRelocate = true;
    [Tooltip("Durasi jeda relokasi acak minimal (detik).")]
    public float minRelocateInterval = 22.0f;
    [Tooltip("Durasi jeda relokasi acak maksimal (detik).")]
    public float maxRelocateInterval = 38.0f;
    public float relocateInterval = 25.0f;       // Dipertahankan untuk kompatibilitas Inspector
    [Tooltip("Hindari memunculkan hantu tepat di arah pandang senter/kamera pemain saat relokasi.")]
    public bool avoidSpawningInPlayerView = true;

    [Header("Efek Mistis Mengambang & Cahaya Roh")]
    public bool floatingBobbing = true;
    public float floatAmplitude = 0.14f;
    public float floatFrequency = 2.2f;
    public Light spiritLight;

    private CharacterController _controller;
    private Camera _cachedCamera;
    private Vector3 _targetPoint;
    private float _waitTime = 0f;
    private float _targetWaitDuration = 0.6f;
    private float _relocateTimer = 0f;
    private float _currentRelocateInterval = 25.0f;
    private float _baseY = 0.5f;
    private bool _isPerformingJumpscare = false;

    // Lokasi rumah-rumah Joglo tempat kunci disembunyikan
    private readonly Vector3[] _jogloHousePositions = new Vector3[]
    {
        new Vector3(-87.62f, 0.5f, -90.0f), // Joglo 1 (Kunci Dukun)
        new Vector3(87.62f, 0.5f, 90.0f),   // Joglo 2 (Kunci Omah)
        new Vector3(-92.0f, 0.5f, 85.62f)   // Joglo 3 (Kunci Punden)
    };

    // Zona-zona strategis kemunculan acak di seluruh pelataran candi dan sekitarnya
    private readonly Vector3[] _presetSpawnZones = new Vector3[]
    {
        new Vector3(-87.62f, 0.5f, -90.0f), // Zona 1: Halaman Joglo Kunci Dukun (Barat Laut)
        new Vector3(87.62f, 0.5f, 90.0f),   // Zona 2: Halaman Joglo Kunci Omah (Timur Laut)
        new Vector3(-92.0f, 0.5f, 85.62f),  // Zona 3: Halaman Joglo Kunci Punden (Barat Daya)
        new Vector3(0.0f, 0.5f, -95.0f),    // Zona 4: Halaman Belakang Candi Utama
        new Vector3(0.0f, 0.5f, -35.0f),    // Zona 5: Pelataran Tengah Candi
        new Vector3(82.0f, 0.5f, -25.0f),   // Zona 6: Hutan Bambu Timur
        new Vector3(-82.0f, 0.5f, 15.0f),   // Zona 7: Sudut Pohon Beringin Barat
        new Vector3(50.0f, 0.5f, -70.0f),   // Zona 8: Pelataran Candi Tenggara
        new Vector3(-50.0f, 0.5f, -70.0f),  // Zona 9: Pelataran Candi Barat Daya
        new Vector3(0.0f, 0.5f, 25.0f)      // Zona 10: Koridor Depan Menuju Candi
    };

    public bool IsChasing { get; private set; } = false;

    private void Awake()
    {
        _controller = GetComponent<CharacterController>();
        _baseY = transform.position.y;
        _cachedCamera = Camera.main;
        _currentRelocateInterval = relocateInterval > 0f ? relocateInterval : 25.0f;
    }

    private void Start()
    {
        // Cari player jika belum diisi
        if (player == null)
        {
            GameObject p = GameObject.FindWithTag("Player");
            if (p == null)
            {
                p = GameObject.Find("Player");
            }
            if (p != null)
            {
                player = p.transform;
                playerController = p.GetComponent<PlayerController>();
            }
        }
        else if (playerController == null)
        {
            playerController = player.GetComponent<PlayerController>();
        }

        if (_cachedCamera == null && Camera.main != null)
        {
            _cachedCamera = Camera.main;
        }

        // Cari Area_Kotak_Dalam jika ada di scene
        if (areaKotakDalam == null)
        {
            GameObject areaObj = GameObject.Find("Area_Kotak_Dalam");
            if (areaObj != null)
            {
                areaKotakDalam = areaObj.GetComponent<BoxCollider>();
            }
        }

        // Setup lampu roh horor jika belum ada
        SetupSpiritLightIfMissing();

        // Munculkan pertama kali di titik acak yang aman dan bervariasi
        SpawnInitialPosition();
    }

    private void SetupSpiritLightIfMissing()
    {
        if (spiritLight == null)
        {
            spiritLight = GetComponentInChildren<Light>();
        }

        if (spiritLight == null)
        {
            GameObject lObj = new GameObject("HantuSpiritLight");
            lObj.transform.SetParent(transform, false);
            lObj.transform.localPosition = new Vector3(0f, 1.8f, 0.3f);
            spiritLight = lObj.AddComponent<Light>();
            spiritLight.type = LightType.Point;
            spiritLight.color = new Color(1.0f, 0.18f, 0.18f);
            spiritLight.range = 7.0f;
            spiritLight.intensity = 2.5f;
            spiritLight.shadows = LightShadows.None;
        }
    }

    public Bounds GetAreaBounds()
    {
        if (areaKotakDalam != null)
        {
            return areaKotakDalam.bounds;
        }
        return new Bounds(boxCenter, boxSize);
    }

    public Vector3 ClampToArea(Vector3 pos)
    {
        Bounds b = GetAreaBounds();
        pos.x = Mathf.Clamp(pos.x, b.min.x + 1.0f, b.max.x - 1.0f);
        pos.z = Mathf.Clamp(pos.z, b.min.z + 1.0f, b.max.z - 1.0f);
        return pos;
    }

    public Vector3 GetRandomPointInArea()
    {
        Bounds b = GetAreaBounds();
        float rx = Random.Range(b.min.x + 2.0f, b.max.x - 2.0f);
        float rz = Random.Range(b.min.z + 2.0f, b.max.z - 2.0f);
        return new Vector3(rx, _baseY, rz);
    }

    public float GetEffectiveDetectionRange()
    {
        float range = detectionRadius;
        if (playerController != null)
        {
            if (playerController.flashlightOn)
            {
                range += flashlightBonusRange;
            }
            if (playerController.isSprinting)
            {
                range += sprintBonusRange;
            }
        }
        return range;
    }

    public Vector3 SelectSmartRandomSpawnPosition()
    {
        Vector3 playerPos = player != null ? player.position : new Vector3(0f, 0.5f, 75f);
        float safeDist = Mathf.Max(minInitialSpawnDist, minSpawnDistFromPlayer);

        // 1. Cek titik kustom jika diatur di Inspector
        if (customSpawnPoints != null && customSpawnPoints.Length > 0)
        {
            List<Vector3> validCustomPoints = new List<Vector3>();
            for (int i = 0; i < customSpawnPoints.Length; i++)
            {
                if (customSpawnPoints[i] != null)
                {
                    Vector3 pt = customSpawnPoints[i].position;
                    if (Vector3.Distance(pt, playerPos) >= safeDist)
                    {
                        validCustomPoints.Add(pt);
                    }
                }
            }

            if (validCustomPoints.Count > 0)
            {
                int pick = Random.Range(0, validCustomPoints.Count);
                return ClampToArea(validCustomPoints[pick]);
            }
        }

        // 2. Kumpulkan kandidat dari Preset Spawn Zones yang aman dari pemain
        List<Vector3> candidates = new List<Vector3>();
        for (int i = 0; i < _presetSpawnZones.Length; i++)
        {
            Vector3 zone = _presetSpawnZones[i];
            // Berikan variasi sebaran acak ±6 meter di sekitar zona
            Vector2 circle = Random.insideUnitCircle * 6.0f;
            Vector3 candidate = new Vector3(zone.x + circle.x, _baseY, zone.z + circle.y);
            candidate = ClampToArea(candidate);

            // Jangan spawn di area depan gerbang luar (Z > 65) dan harus berjarak aman dari pemain
            if (candidate.z <= 60.0f && Vector3.Distance(candidate, playerPos) >= safeDist)
            {
                candidates.Add(candidate);
            }
        }

        // 3. Tambahkan titik acak tambahan di dalam pelataran
        for (int i = 0; i < 6; i++)
        {
            Vector3 randPt = GetRandomPointInArea();
            if (randPt.z <= 55.0f && Vector3.Distance(randPt, playerPos) >= safeDist)
            {
                candidates.Add(randPt);
            }
        }

        // 4. Pilih secara acak dari semua kandidat valid
        if (candidates.Count > 0)
        {
            int selectedIndex = Random.Range(0, candidates.Count);
            return candidates[selectedIndex];
        }

        // Fallback aman jika semua kandidat terlalu dekat dengan pemain
        Vector3 fallback = new Vector3(Random.Range(-50f, 50f), _baseY, Random.Range(-95f, -40f));
        return ClampToArea(fallback);
    }

    public void SpawnInitialPosition()
    {
        Vector3 targetPos = SelectSmartRandomSpawnPosition();
        TeleportTo(targetPos);
        PickNewPatrolTarget();
        _relocateTimer = 0f;
        _currentRelocateInterval = Random.Range(minRelocateInterval, maxRelocateInterval);
    }

    public void SpawnAtRandomPosition()
    {
        SpawnInitialPosition();
    }

    public void RelocateNearPlayer()
    {
        // Jika pemain tidak ada, masih di area pintu gerbang (Z > 65), atau baru mulai (5 detik pertama)
        if (player == null || player.position.z > 65.0f || Time.timeSinceLevelLoad < 5.0f)
        {
            TeleportTo(SelectSmartRandomSpawnPosition());
            PickNewPatrolTarget();
            return;
        }

        float dist = Random.Range(minStalkDist, maxStalkDist);
        Vector3 targetPos;

        if (avoidSpawningInPlayerView)
        {
            // Ambil arah pandang pemain (gunakan kamera jika ada, atau transform player)
            Vector3 forwardDir = player.forward;
            if (_cachedCamera != null)
            {
                forwardDir = _cachedCamera.transform.forward;
            }
            forwardDir.y = 0f;
            if (forwardDir.sqrMagnitude < 0.001f)
            {
                forwardDir = Vector3.forward;
            }
            forwardDir.Normalize();

            // Sudut acak di luar pandangan tengah pemain (antara 70 s/d 290 derajat)
            // Hantu mengintai dari samping atau belakang pemain
            float baseAngle = Mathf.Atan2(forwardDir.x, forwardDir.z) * Mathf.Rad2Deg;
            float angleOffset = Random.value < 0.5f ? Random.Range(70f, 155f) : Random.Range(205f, 290f);
            float finalAngle = (baseAngle + angleOffset) * Mathf.Deg2Rad;

            Vector3 offset = new Vector3(Mathf.Sin(finalAngle) * dist, 0f, Mathf.Cos(finalAngle) * dist);
            targetPos = ClampToArea(player.position + offset);
        }
        else
        {
            float angle = Random.Range(0f, 360f) * Mathf.Deg2Rad;
            Vector3 offset = new Vector3(Mathf.Cos(angle) * dist, 0f, Mathf.Sin(angle) * dist);
            targetPos = ClampToArea(player.position + offset);
        }

        targetPos.y = _baseY;
        TeleportTo(targetPos);
        PickNewPatrolTarget();

        // Acak durasi relokasi berikutnya
        _currentRelocateInterval = Random.Range(minRelocateInterval, maxRelocateInterval);
    }

    private void RelocateAfterAttack()
    {
        if (player == null)
        {
            SpawnInitialPosition();
            return;
        }

        // Setelah menyerang, hantu menghilang dan spawn kembali di salah satu zona acak yang aman dan jauh
        Vector3 farSpawn = SelectSmartRandomSpawnPosition();
        TeleportTo(farSpawn);
        PickNewPatrolTarget();
        _relocateTimer = 0f;
        _currentRelocateInterval = Random.Range(minRelocateInterval, maxRelocateInterval);
    }

    private void TeleportTo(Vector3 pos)
    {
        if (_controller != null)
        {
            _controller.enabled = false;
        }

        transform.position = pos;
        _baseY = pos.y;

        if (_controller != null)
        {
            _controller.enabled = true;
        }

        // Hadapkan hantu menghadap ke arah pelataran atau pemain
        if (player != null)
        {
            Vector3 lookTarget = new Vector3(player.position.x, transform.position.y, player.position.z);
            Vector3 lookDir = (lookTarget - transform.position).normalized;
            if (lookDir.sqrMagnitude > 0.001f)
            {
                transform.rotation = Quaternion.LookRotation(lookDir);
            }
        }
    }

    private void PickNewPatrolTarget()
    {
        _waitTime = 0f;
        _targetWaitDuration = Random.Range(0.4f, 1.2f);

        // 1. 70% Peluang: Stalking / mengintai di sekitar pemain (18m - 42m)
        if (player != null && Random.value < stalkNearPlayerChance)
        {
            float angle = Random.Range(0f, 360f) * Mathf.Deg2Rad;
            float dist = Random.Range(minStalkDist, maxStalkDist);
            Vector3 offset = new Vector3(Mathf.Cos(angle) * dist, 0f, Mathf.Sin(angle) * dist);
            _targetPoint = ClampToArea(player.position + offset);
            _targetPoint.y = _baseY;
            return;
        }

        // 2. 30% Peluang: Patroli ke salah satu rumah Joglo (tempat kunci dicari pemain)
        if (_jogloHousePositions.Length > 0 && Random.value < 0.7f)
        {
            int idx = Random.Range(0, _jogloHousePositions.Length);
            Vector3 housePos = _jogloHousePositions[idx];
            // Tambahkan variasi sedikit di sekitar halaman rumah
            housePos.x += Random.Range(-8f, 8f);
            housePos.z += Random.Range(-8f, 8f);
            _targetPoint = ClampToArea(housePos);
            _targetPoint.y = _baseY;
            return;
        }

        // 3. Fallback titik acak di dalam area
        _targetPoint = GetRandomPointInArea();
    }

    private void Update()
    {
        if (_isPerformingJumpscare)
        {
            return;
        }

        // 1. Relokasi cerdas berkala mendekati pemain jika tidak sedang mengejar
        if (autoRelocate && !IsChasing)
        {
            _relocateTimer += Time.deltaTime;
            if (_relocateTimer >= _currentRelocateInterval)
            {
                _relocateTimer = 0f;
                RelocateNearPlayer();
                return;
            }
        }

        // 2. Deteksi Player dengan Multi-Sensory (Senter ON + Sprint footstep bonus)
        float distToPlayer = player != null ? Vector3.Distance(transform.position, player.position) : 999f;
        Bounds bounds = GetAreaBounds();
        bool playerInArea = player != null && bounds.Contains(new Vector3(player.position.x, bounds.center.y, player.position.z));

        float effectiveRange = GetEffectiveDetectionRange();

        // Zona aman pintu gerbang awal (Z > 65) dan jeda 5 detik pertama saat mulai game:
        // Hantu TIDAK boleh mengejar saat pemain baru mulai di depan gerbang!
        bool playerInSafeZone = (player != null && player.position.z > 65.0f) || (Time.timeSinceLevelLoad < 5.0f);

        // Logika Transisi Kejar:
        // Hanya bisa mulai mengejar jika pemain berada di dalam pelataran candi dan BUKAN di zona gerbang awal
        if (player != null && playerInArea && !playerInSafeZone)
        {
            if (!IsChasing && distToPlayer <= effectiveRange)
            {
                IsChasing = true;
            }
            else if (IsChasing && distToPlayer > loseTargetDistance)
            {
                IsChasing = false;
                PickNewPatrolTarget();
            }
        }
        else
        {
            IsChasing = false;
        }

        // 3. Eksekusi Perilaku
        if (IsChasing)
        {
            ChasePlayer(distToPlayer);
        }
        else
        {
            PatrolInArea();
        }

        // 4. Pastikan posisi hantu selalu di dalam batas area kotak dalam
        Vector3 currentPos = transform.position;
        Vector3 clamped = ClampToArea(currentPos);
        if (currentPos.x != clamped.x || currentPos.z != clamped.z)
        {
            if (_controller != null)
            {
                _controller.enabled = false;
            }
            transform.position = new Vector3(clamped.x, currentPos.y, clamped.z);
            if (_controller != null)
            {
                _controller.enabled = true;
            }
        }

        // 5. Efek mengambang mistis naik-turun halus
        if (floatingBobbing)
        {
            float bob = Mathf.Sin(Time.time * floatFrequency) * floatAmplitude;
            Vector3 p = transform.position;
            p.y = _baseY + bob;
            transform.position = p;
        }
    }

    private void ChasePlayer(float distToPlayer)
    {
        Vector3 target = player.position;
        target.y = transform.position.y;

        // Hadapkan hantu dengan cepat ke arah pemain
        Vector3 dir = (target - transform.position).normalized;
        if (dir.sqrMagnitude > 0.001f)
        {
            Quaternion lookRot = Quaternion.LookRotation(dir);
            transform.rotation = Quaternion.Slerp(transform.rotation, lookRot, Time.deltaTime * 7f);
        }

        // Serang jika sudah dalam jangkauan serangan
        if (distToPlayer <= attackRadius)
        {
            AttackPlayer();
            return;
        }

        // Bergerak mengejar dengan kecepatan tinggi (7.2 m/s)
        Vector3 desiredPos = transform.position + dir * (chaseSpeed * Time.deltaTime);
        Vector3 clampedTarget = ClampToArea(desiredPos);
        Vector3 moveDelta = clampedTarget - transform.position;

        if (_controller != null && _controller.enabled)
        {
            _controller.Move(moveDelta);
        }
        else
        {
            transform.position += moveDelta;
        }
    }

    private void PatrolInArea()
    {
        Vector3 target = _targetPoint;
        target.y = transform.position.y;

        float dist = Vector3.Distance(transform.position, target);
        if (dist <= 2.0f)
        {
            _waitTime += Time.deltaTime;
            if (_waitTime >= _targetWaitDuration)
            {
                PickNewPatrolTarget();
            }
            return;
        }

        Vector3 dir = (target - transform.position).normalized;
        if (dir.sqrMagnitude > 0.001f)
        {
            Quaternion lookRot = Quaternion.LookRotation(dir);
            transform.rotation = Quaternion.Slerp(transform.rotation, lookRot, Time.deltaTime * 4.5f);
        }

        Vector3 desiredPos = transform.position + dir * (patrolSpeed * Time.deltaTime);
        Vector3 clampedTarget = ClampToArea(desiredPos);
        Vector3 moveDelta = clampedTarget - transform.position;

        if (_controller != null && _controller.enabled)
        {
            _controller.Move(moveDelta);
        }
        else
        {
            transform.position += moveDelta;
        }
    }

    private void AttackPlayer()
    {
        if (_isPerformingJumpscare || player == null)
        {
            return;
        }
        _isPerformingJumpscare = true;

        PlayerController pc = playerController != null ? playerController : player.GetComponent<PlayerController>();
        HorrorVisionEffect vision = _cachedCamera != null ? _cachedCamera.GetComponent<HorrorVisionEffect>() : null;
        if (vision == null && Camera.main != null)
        {
            vision = Camera.main.GetComponent<HorrorVisionEffect>();
        }
        if (vision == null && player != null)
        {
            vision = player.GetComponentInChildren<HorrorVisionEffect>();
        }

        // 1. Posisikan hantu menerjang langsung tepat di depan mata pemain (0.8m)
        Vector3 forwardDir = player.forward;
        forwardDir.y = 0f;
        if (forwardDir.sqrMagnitude < 0.01f)
        {
            forwardDir = transform.forward;
        }
        forwardDir.Normalize();

        Vector3 jumpscarePos = player.position + forwardDir * 0.82f;
        jumpscarePos.y = _baseY;

        if (_controller != null)
        {
            _controller.enabled = false;
        }
        transform.position = jumpscarePos;
        transform.LookAt(new Vector3(player.position.x, transform.position.y, player.position.z));
        if (_controller != null)
        {
            _controller.enabled = true;
        }

        // 2. Trigger Jumpscare Visual & Audio di Kamera Pemain
        if (vision != null)
        {
            vision.TriggerJumpscare(transform);
        }

        // 3. Trigger Efek Pemain (Stamina habis, senter korslet)
        if (pc != null)
        {
            pc.OnGhostAttack(transform.position);
        }

        // 4. Setelah durasi jumpscare, hantu menghilang dan merelokasi diri untuk mengintai lagi
        float duration = (vision != null) ? vision.jumpscareDuration : 1.5f;
        StartCoroutine(PostJumpscareRelocate(duration));
    }

    private System.Collections.IEnumerator PostJumpscareRelocate(float delay)
    {
        yield return new WaitForSeconds(delay);
        RelocateAfterAttack();
        IsChasing = false;
        _relocateTimer = 0f;
        _isPerformingJumpscare = false;
    }

    private void OnDrawGizmos()
    {
        Bounds b = GetAreaBounds();
        Gizmos.color = new Color(1.0f, 0.2f, 0.2f, 0.08f);
        Gizmos.DrawCube(b.center, b.size);
        Gizmos.color = new Color(1.0f, 0.2f, 0.2f, 0.7f);
        Gizmos.DrawWireCube(b.center, b.size);

        if (IsChasing)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, attackRadius);
        }
        else
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawLine(transform.position, _targetPoint);
        }

        // Visualisasikan zona-zona kemunculan acak di Editor
        Gizmos.color = new Color(0.1f, 0.85f, 0.95f, 0.45f);
        for (int i = 0; i < _presetSpawnZones.Length; i++)
        {
            Gizmos.DrawWireSphere(_presetSpawnZones[i], 5.0f);
        }

        if (customSpawnPoints != null)
        {
            Gizmos.color = new Color(0.95f, 0.2f, 0.95f, 0.75f);
            for (int i = 0; i < customSpawnPoints.Length; i++)
            {
                if (customSpawnPoints[i] != null)
                {
                    Gizmos.DrawWireSphere(customSpawnPoints[i].position, 3.0f);
                }
            }
        }
    }
}
