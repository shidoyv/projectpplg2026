using UnityEngine;

public class MoonSkyFollow : MonoBehaviour
{
    // Komponen ini dinonaktifkan agar tidak ada quad raksasa (Horror_Moon) yang menutupi pandangan
    private void Awake()
    {
        gameObject.SetActive(false);
    }
}
