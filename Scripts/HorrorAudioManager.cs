using UnityEngine;

public class HorrorAudioManager : MonoBehaviour
{
    [Header("Audio Clips")]
    public AudioClip ambientClip;
    public AudioClip tensionClip;
    public AudioClip chaseClip;            // Musik pengejaran super menegangkan (165 BPM horror chase)
    public AudioClip alternateChaseClip;   // Pilihan musik kejar alternatif (tribal percussion)
    public AudioClip jumpscareStingerClip; // Suara jeritan / stinger mengejutkan saat dikejar
    public AudioClip heartbeatClip;        // Suara degup jantung panik saat hantu mendekat

    [Header("Target Referensi")]
    public Transform player;
    public Transform ghost;

    [Header("Pengaturan Volume")]
    public float maxAmbientVolume = 0.40f;
    public float maxTensionVolume = 0.65f;
    public float maxChaseVolume = 0.85f;
    public float maxHeartbeatVolume = 0.75f;
    public float proximityDistance = 50.0f;

    private AudioSource _ambientSource;
    private AudioSource _tensionSource;
    private AudioSource _chaseSource;
    private AudioSource _heartbeatSource;
    private AudioSource _stingerSource;

    private HantuWayangAI _ghostAI;

    private void Awake()
    {
        _ambientSource = CreateAudioSource("Audio_Ambient", true);
        _tensionSource = CreateAudioSource("Audio_Tension", true);
        _chaseSource = CreateAudioSource("Audio_Chase", true);
        _heartbeatSource = CreateAudioSource("Audio_Heartbeat", true);
        _stingerSource = CreateAudioSource("Audio_Stinger", false);
    }

    private AudioSource CreateAudioSource(string name, bool loop)
    {
        GameObject child = new GameObject(name);
        child.transform.SetParent(transform);
        AudioSource src = child.AddComponent<AudioSource>();
        src.loop = loop;
        src.playOnAwake = false;
        src.spatialBlend = 0f; // 2D Stereo untuk BGM & efek panik
        return src;
    }

    private void Start()
    {
        if (player == null)
        {
            GameObject p = GameObject.FindWithTag("Player");
            if (p == null) p = GameObject.Find("Player");
            if (p != null) player = p.transform;
        }

        if (ghost == null)
        {
            GameObject g = GameObject.Find("Hantu_Wayang");
            if (g != null) ghost = g.transform;
        }

        if (ghost != null)
        {
            _ghostAI = ghost.GetComponent<HantuWayangAI>();
        }

        // Putar audio ambient
        if (ambientClip != null)
        {
            _ambientSource.clip = ambientClip;
            _ambientSource.volume = maxAmbientVolume;
            _ambientSource.Play();
        }

        // Siapkan audio ketegangan
        if (tensionClip != null)
        {
            _tensionSource.clip = tensionClip;
            _tensionSource.volume = 0f;
            _tensionSource.Play();
        }

        // Siapkan audio pengejaran horor intens
        if (chaseClip != null)
        {
            _chaseSource.clip = chaseClip;
            _chaseSource.volume = 0f;
            _chaseSource.Play();
        }

        // Siapkan degup jantung panik
        if (heartbeatClip != null)
        {
            _heartbeatSource.clip = heartbeatClip;
            _heartbeatSource.volume = 0f;
            _heartbeatSource.Play();
        }
    }

    private void Update()
    {
        if (player == null || ghost == null) return;

        PlayerController pc = player != null ? player.GetComponent<PlayerController>() : null;
        if (pc != null && pc.isWakingUp)
        {
            if (_ambientSource != null)
            {
                _ambientSource.volume = Mathf.MoveTowards(_ambientSource.volume, maxAmbientVolume * 0.15f, Time.deltaTime * 1.5f);
            }
            if (_heartbeatSource != null)
            {
                _heartbeatSource.volume = Mathf.MoveTowards(_heartbeatSource.volume, 0.35f, Time.deltaTime * 2.0f);
                _heartbeatSource.pitch = 0.8f;
            }
            if (_chaseSource != null) _chaseSource.volume = 0f;
            if (_tensionSource != null) _tensionSource.volume = 0f;
            return;
        }

        if (_ghostAI == null)
        {
            _ghostAI = ghost.GetComponent<HantuWayangAI>();
        }

        float dist = Vector3.Distance(player.position, ghost.position);
        bool isChasing = _ghostAI != null && _ghostAI.IsChasing;

        if (isChasing)
        {
            // HANYA SAAT DIKEJAR HANTU: Musik pengejaran memuncak cepat
            if (_chaseSource != null)
            {
                _chaseSource.volume = Mathf.MoveTowards(_chaseSource.volume, maxChaseVolume, Time.deltaTime * 3.5f);
            }

            // Musik ketegangan & ambient diturunkan agar musik kejar terdengar fokus dan menegangkan
            if (_tensionSource != null)
            {
                _tensionSource.volume = Mathf.MoveTowards(_tensionSource.volume, 0f, Time.deltaTime * 2.0f);
            }
            if (_ambientSource != null)
            {
                _ambientSource.volume = Mathf.MoveTowards(_ambientSource.volume, maxAmbientVolume * 0.25f, Time.deltaTime * 2.0f);
            }

            // Degup jantung semakin kencang saat hantu semakin dekat
            if (_heartbeatSource != null)
            {
                float hbFactor = Mathf.Clamp01(1.0f - (dist / 35.0f));
                _heartbeatSource.volume = Mathf.MoveTowards(_heartbeatSource.volume, hbFactor * maxHeartbeatVolume, Time.deltaTime * 3.0f);
                _heartbeatSource.pitch = Mathf.Lerp(1.0f, 1.45f, hbFactor); // Denyut semakin cepat saat hantu mendekat
            }
        }
        else
        {
            // SAAT TIDAK DIKEJAR (Aman / Eksplorasi): Tidak ada suara menegangkan, hanya ambient tenang
            if (_chaseSource != null)
            {
                _chaseSource.volume = Mathf.MoveTowards(_chaseSource.volume, 0f, Time.deltaTime * 2.0f);
            }

            if (_heartbeatSource != null)
            {
                _heartbeatSource.volume = Mathf.MoveTowards(_heartbeatSource.volume, 0f, Time.deltaTime * 2.5f);
            }

            if (_tensionSource != null)
            {
                _tensionSource.volume = Mathf.MoveTowards(_tensionSource.volume, 0f, Time.deltaTime * 2.5f);
            }

            // Musik ambient kembali normal
            if (_ambientSource != null)
            {
                _ambientSource.volume = Mathf.MoveTowards(_ambientSource.volume, maxAmbientVolume, Time.deltaTime * 1.5f);
            }
        }
    }

    public void PlayJumpscareStinger()
    {
        if (_stingerSource != null && jumpscareStingerClip != null)
        {
            _stingerSource.volume = 1.0f;
            _stingerSource.PlayOneShot(jumpscareStingerClip, 1.0f);
        }
    }
}
