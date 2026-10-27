using UnityEngine;

public class GhostAI : MonoBehaviour
{
    [Header("Target & Kecepatan")]
    public Transform player;
    public float patrolSpeed = 2.2f;
    public float chaseSpeed = 4.6f;
    public float detectionRadius = 24.0f;
    public float attackRadius = 1.8f;
    public Light spiritLight;

    private Vector3[] _patrolPoints;
    private int _currentPatrolIndex = 0;
    private bool _isChasing = false;
    private CharacterController _controller;
    private float _waitTime = 0f;

    private void Start()
    {
        _controller = GetComponent<CharacterController>();

        if (player == null)
        {
            GameObject p = GameObject.FindWithTag("Player");
            if (p == null) p = GameObject.Find("Player");
            if (p != null) player = p.transform;
        }

        // Setup Titik Patroli di sekitar Rumah Joglo & Hutan
        _patrolPoints = new Vector3[]
        {
            new Vector3(-90.0f, 1.2f, 88.0f),   // Joglo Barat Laut (Dukun)
            new Vector3(88.0f, 1.2f, 88.0f),    // Joglo Timur Laut (Lurah)
            new Vector3(90.0f, 1.2f, -88.0f),   // Joglo Tenggara (Utama)
            new Vector3(-90.0f, 1.2f, -88.0f),  // Joglo Barat Daya (Punden)
            new Vector3(85.0f, 1.2f, 18.0f)     // Pendopo Timur
        };

        // Posisikan awal hantu di Joglo terjauh dari pemain
        RandomizeSpawnPosition();

        // Setup Spirit Light merah jika belum ada
        if (spiritLight == null)
        {
            spiritLight = GetComponentInChildren<Light>();
            if (spiritLight == null)
            {
                GameObject lObj = new GameObject("SpiritLight");
                lObj.transform.SetParent(transform, false);
                lObj.transform.localPosition = new Vector3(0f, 1.6f, 0.3f);
                spiritLight = lObj.AddComponent<Light>();
            }
        }

        if (spiritLight != null)
        {
            spiritLight.type = LightType.Point;
            spiritLight.color = new Color(1.0f, 0.15f, 0.15f);
            spiritLight.range = 8.0f;
            spiritLight.intensity = 3.0f;
        }
    }

    public void RandomizeSpawnPosition()
    {
        if (_patrolPoints == null || _patrolPoints.Length == 0) return;

        Vector3 playerPos = player != null ? player.position : new Vector3(0f, 1.2f, -38f);
        int bestIdx = 0;
        float maxDist = 0f;

        for (int i = 0; i < _patrolPoints.Length; i++)
        {
            float d = Vector3.Distance(_patrolPoints[i], playerPos);
            if (d > maxDist)
            {
                maxDist = d;
                bestIdx = i;
            }
        }

        _currentPatrolIndex = bestIdx;
        Vector3 spawnPos = _patrolPoints[bestIdx] + Random.insideUnitSphere * 3f;
        spawnPos.y = 1.2f;

        if (_controller != null) _controller.enabled = false;
        transform.position = spawnPos;
        if (_controller != null) _controller.enabled = true;
    }

    private void Update()
    {
        if (player == null) return;

        float distToPlayer = Vector3.Distance(transform.position, player.position);

        // 1. Cek Jarak Deteksi
        if (distToPlayer <= detectionRadius)
        {
            _isChasing = true;
        }
        else if (distToPlayer > detectionRadius * 1.5f)
        {
            _isChasing = false;
        }

        // 2. Perilaku Pengejaran / Patroli
        if (_isChasing)
        {
            ChasePlayer(distToPlayer);
        }
        else
        {
            PatrolRoutine();
        }

        // 3. Efek denyut lampu merah hantu
        if (spiritLight != null)
        {
            float pulse = Mathf.PingPong(Time.time * 2f, 1.5f) + 1.8f;
            spiritLight.intensity = _isChasing ? pulse * 1.5f : pulse;
        }
    }

    private void ChasePlayer(float distToPlayer)
    {
        Vector3 target = player.position;
        target.y = transform.position.y;

        // Hadapkan hantu ke pemain
        Vector3 dir = (target - transform.position).normalized;
        if (dir.sqrMagnitude > 0.001f)
        {
            Quaternion lookRot = Quaternion.LookRotation(dir);
            transform.rotation = Quaternion.Slerp(transform.rotation, lookRot, Time.deltaTime * 5f);
        }

        // Serang jika sudah sangat dekat
        if (distToPlayer <= attackRadius)
        {
            AttackPlayer();
            return;
        }

        // Bergerak mendekat
        Vector3 moveDelta = dir * (chaseSpeed * Time.deltaTime);
        moveDelta.y = -9.8f * Time.deltaTime; // Gravitasi

        if (_controller != null && _controller.enabled)
            _controller.Move(moveDelta);
        else
            transform.position += moveDelta;
    }

    private void PatrolRoutine()
    {
        if (_patrolPoints == null || _patrolPoints.Length == 0) return;

        Vector3 targetPoint = _patrolPoints[_currentPatrolIndex];
        targetPoint.y = transform.position.y;

        float dist = Vector3.Distance(transform.position, targetPoint);
        if (dist <= 3.0f)
        {
            _waitTime += Time.deltaTime;
            if (_waitTime >= 3.0f)
            {
                _waitTime = 0f;
                _currentPatrolIndex = (_currentPatrolIndex + 1) % _patrolPoints.Length;
            }
            return;
        }

        Vector3 dir = (targetPoint - transform.position).normalized;
        if (dir.sqrMagnitude > 0.001f)
        {
            Quaternion lookRot = Quaternion.LookRotation(dir);
            transform.rotation = Quaternion.Slerp(transform.rotation, lookRot, Time.deltaTime * 3f);
        }

        Vector3 moveDelta = dir * (patrolSpeed * Time.deltaTime);
        moveDelta.y = -9.8f * Time.deltaTime;

        if (_controller != null && _controller.enabled)
            _controller.Move(moveDelta);
        else
            transform.position += moveDelta;
    }

    private void AttackPlayer()
    {
        // Jumpscare dorongan mundur saat tertangkap hantu
        FirstPersonMovement fpm = player.GetComponent<FirstPersonMovement>();
        if (fpm != null)
        {
            fpm.ShowNotification("⚠️ HANTU WAYANG MENYERANGMU! JAUHI DARI JANGKAUANNYA!", 3f);
        }

        // Dorong pemain mundur
        Vector3 pushDir = (player.position - transform.position).normalized;
        CharacterController playerCC = player.GetComponent<CharacterController>();
        if (playerCC != null)
        {
            playerCC.Move(pushDir * 4.0f);
        }

        // Teleport hantu sedikit mundur agar tidak menempel terus-menerus
        if (_controller != null) _controller.enabled = false;
        transform.position -= pushDir * 8.0f;
        if (_controller != null) _controller.enabled = true;
        _isChasing = false;
    }
}
