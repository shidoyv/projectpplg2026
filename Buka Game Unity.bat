@echo off
chcp 65001 >nul
echo ===================================================
echo   Lelana Jateng - Peluncur Game AR/VR Candi Borobudur
echo   Membuka proyek: C:\Users\vincent lim\arvr_perbaikan
echo ===================================================
echo.
wscript //nologo "%~dp0js\launch_unity.vbs"
echo Selesai! Unity Editor sedang dibuka / difokuskan.
timeout /t 3 >nul

