#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System;
using System.Reflection;

[InitializeOnLoad]
public static class AutoFocusGameView
{
    static AutoFocusGameView()
    {
        EditorApplication.playModeStateChanged += OnPlayModeChanged;
    }

    private static void OnPlayModeChanged(PlayModeStateChange state)
    {
        if (state == PlayModeStateChange.EnteredPlayMode)
        {
            EditorApplication.delayCall += SwitchToGameView;
        }
    }

    [MenuItem("Tools/Horror Game/Focus Game Tab #&g")]
    public static void SwitchToGameView()
    {
        Type gameViewType = Type.GetType("UnityEditor.GameView,UnityEditor");
        if (gameViewType != null)
        {
            EditorWindow gameView = EditorWindow.GetWindow(gameViewType);
            if (gameView != null)
            {
                gameView.Show();
                gameView.Focus();
            }
        }
    }
}
#endif
