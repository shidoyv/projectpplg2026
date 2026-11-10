$projectPath = "C:\Users\vincent lim\arvr_perbaikan"
$unityExe = "C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe"

$ws = New-Object -ComObject WScript.Shell

# 1. Cek apakah Unity sudah terbuka, fokuskan jika sudah ada
if ($ws.AppActivate("arvr_perbaikan") -or $ws.AppActivate("Unity 6000") -or $ws.AppActivate("Unity - arvr_perbaikan")) {
    Write-Host "Berhasil beralih ke jendela Unity yang sedang berjalan."
    exit 0
}

# 2. Jika belum terbuka, bersihkan stale lockfile jika ada
$lockFile = Join-Path $projectPath "Temp\UnityLockfile"
if (Test-Path $lockFile) {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}

# 3. Jalankan Unity Editor dengan proyek arvr_perbaikan
Start-Process $unityExe -ArgumentList "-projectPath `"$projectPath`""
Write-Host "Unity Editor berhasil dijalankan untuk proyek arvr_perbaikan."

