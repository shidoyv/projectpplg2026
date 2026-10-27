using UnityEngine;
using UnityEditor;

public static class DebugGatePositions
{
    [MenuItem("Tools/Debug Print All Positions")]
    public static void PrintPositions()
    {
        Debug.Log("=== DEBUG PRINT POSITIONS ===");
        GameObject candi = GameObject.Find("candi_borobudur");
        if (candi != null)
        {
            Transform[] all = candi.GetComponentsInChildren<Transform>(true);
            foreach (var t in all)
            {
                string n = t.name.ToLower();
                if (n.Contains("pintu") || n.Contains("gerbang") || n.Contains("gate") || n.Contains("gembok") || n.Contains("palang") || n.Contains("joglo"))
                {
                    Debug.Log($"[CANDI CHILD] {t.name} -> Local: {t.localPosition}, World: {t.position}");
                }
            }
        }
        else
        {
            Debug.LogError("candi_borobudur not found!");
        }

        GameObject player = GameObject.Find("Player");
        if (player != null)
        {
            Debug.Log($"[PLAYER] Local: {player.transform.localPosition}, World: {player.transform.position}, Rot: {player.transform.eulerAngles}");
        }
    }
}
