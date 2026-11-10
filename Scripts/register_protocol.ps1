# Register custom URI protocol unity-arvr in HKCU
$protocolName = "unity-arvr"
$vbsPath = "C:\Users\vincent lim\OneDrive\Documents\projectpplg2026-main\js\launch_unity.vbs"
$unityExe = "C:\Program Files\Unity\Hub\Editor\6000.6.6f1\Editor\Unity.exe"

$baseKey = "HKCU:\Software\Classes\$protocolName"
New-Item -Path $baseKey -Force | Out-Null
Set-ItemProperty -Path $baseKey -Name "(default)" -Value "URL:Unity ARVR Game Launcher"
Set-ItemProperty -Path $baseKey -Name "URL Protocol" -Value ""

$iconKey = "$baseKey\DefaultIcon"
New-Item -Path $iconKey -Force | Out-Null
Set-ItemProperty -Path $iconKey -Name "(default)" -Value "`"$unityExe`",0"

$cmdKey = "$baseKey\shell\open\command"
New-Item -Path $cmdKey -Force | Out-Null
Set-ItemProperty -Path $cmdKey -Name "(default)" -Value "wscript.exe `"$vbsPath`" `"%1`""

Write-Output "Protocol $protocolName successfully registered in HKCU"

