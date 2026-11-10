Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

Dim activated
activated = False

' 1. Cek apakah jendela proyek Unity atau Unity Editor sudah terbuka
' Jika sudah ada, langsung beralih / pindah ke jendela Unity
If WshShell.AppActivate("arvr_perbaikan") Then
    activated = True
ElseIf WshShell.AppActivate("Unity 6000") Then
    activated = True
ElseIf WshShell.AppActivate("Unity - arvr_perbaikan") Then
    activated = True
End If

' 2. Jika belum terbuka, bersihkan stale lockfile jika ada dan jalankan Unity Editor
If Not activated Then
    Dim lockFile
    lockFile = "C:\Users\vincent lim\arvr_perbaikan\Temp\UnityLockfile"
    If fso.FileExists(lockFile) Then
        On Error Resume Next
        fso.DeleteFile lockFile, True
        On Error Goto 0
    End If

    Dim unityExe, projectPath, cmd
    unityExe = "C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe"
    projectPath = "C:\Users\vincent lim\arvr_perbaikan"
    cmd = """" & unityExe & """ -projectPath """ & projectPath & """"
    WshShell.Run cmd, 1, False
End If
