/**
 * Game Download & Launcher Center - Lelana Jateng
 * Mengatur unduhan aplikasi game (Windows .exe & Android/Quest .apk)
 * serta integrasi peluncur lokal Unity untuk pengembang.
 */

(function () {
  'use strict';

  // Konfigurasi Tautan Unduhan Game
  // Anda bisa mengganti URL di bawah ini dengan tautan Google Drive, MediaFire, atau GitHub Releases Anda
  window.GAME_DOWNLOAD_CONFIG = {
    windowsExeUrl: 'https://github.com/shidoyv/projectpplg2026/releases',
    androidApkUrl: 'https://github.com/shidoyv/projectpplg2026/releases',
    version: 'v1.0.0 (Build Perbaikan)',
    windowsSize: '~185 MB',
    androidSize: '~140 MB'
  };

  // Buat wadah toast notifikasi
  let toastEl = null;

  function createToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement('div');
    toastEl.id = 'unity-launcher-toast';
    toastEl.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background-color: #1a120c;
      color: #faf7f2;
      border: 1px solid #c5a572;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.75);
      border-radius: 12px;
      padding: 12px 20px;
      font-size: 13px;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 90vw;
    `;
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function showToast(message, type = 'info', duration = 4000) {
    const toast = createToast();
    let icon = '🎮';
    let borderColor = '#c5a572';

    if (type === 'loading') {
      icon = '⏳';
    } else if (type === 'success') {
      icon = '✅';
      borderColor = '#4ade80';
    } else if (type === 'error') {
      icon = '⚠️';
      borderColor = '#f87171';
    }

    toast.style.borderColor = borderColor;
    toast.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${message}</span>`;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';

    if (duration > 0) {
      setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(-100px)';
        toast.style.opacity = '0';
      }, duration);
    }
  }

  // ==========================================
  // MODAL PUSAT UNDUHAN GAME (DOWNLOAD CENTER)
  // ==========================================
  window.openDownloadModal = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    let modal = document.getElementById('game-download-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-download-modal';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: rgba(5, 3, 2, 0.88);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        padding: 16px;
        opacity: 0;
        transition: opacity 0.25s ease;
      `;

      modal.innerHTML = `
        <div style="background-color: #140d08; border: 1px solid #c5a572; border-radius: 18px; max-width: 600px; width: 100%; padding: 26px; box-shadow: 0 25px 60px rgba(0,0,0,0.9); color: #faf7f2; font-family: system-ui, -apple-system, sans-serif; max-height: 90vh; overflow-y: auto;">
          
          <!-- Header Modal -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 18px; border-bottom: 1px solid rgba(197, 165, 114, 0.2); pb-3;">
            <div>
              <div style="font-size: 18px; font-weight: 700; color: #c5a572; display: flex; align-items: center; gap: 8px;">
                <span>📥</span>
                <span>Unduh Aplikasi Game AR / VR</span>
              </div>
              <p style="font-size: 12px; color: #e5d8be; opacity: 0.75; margin-top: 3px;">
                Misteri Gerbang Candi Borobudur &bull; ${window.GAME_DOWNLOAD_CONFIG.version}
              </p>
            </div>
            <button id="btn-close-download-modal" style="background:none; border:none; color:#e5d8be; font-size: 20px; cursor:pointer; padding: 4px 8px; line-height: 1;">✕</button>
          </div>

          <!-- Opsi 1: Rekomendasi Laptop / Windows PC (.exe) -->
          <div style="background: linear-gradient(135deg, rgba(56, 34, 21, 0.75), rgba(26, 17, 10, 0.9)); border: 1.5px solid #c5a572; border-radius: 12px; padding: 16px; margin-bottom: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
              <span style="font-size: 11px; font-weight: 700; background-color: #c5a572; color: #1a110a; padding: 2px 8px; rounded: 4px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                ⭐ Paling Direkomendasikan
              </span>
              <span style="font-size: 11px; color: #e5d8be; opacity: 0.8; font-family: monospace;">Windows 64-bit (${window.GAME_DOWNLOAD_CONFIG.windowsSize})</span>
            </div>
            
            <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 4px; display:flex; align-items:center; gap: 8px;">
              <span>💻</span>
              <span>Versi Komputer / Laptop Windows (.exe)</span>
            </h3>
            <p style="font-size: 12px; color: #e5d8be; opacity: 0.85; line-height: 1.5; margin-bottom: 12px;">
              Format aplikasi langsung untuk laptop/PC. Mendukung kontrol <strong>Keyboard &amp; Mouse</strong> biasa, serta kacamata <strong>PCVR (Oculus Link / SteamVR)</strong>. Tinggal ekstrak dan klik 2x untuk bermain.
            </p>

            <a id="link-download-windows" href="${window.GAME_DOWNLOAD_CONFIG.windowsExeUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 8px; width: 100%; padding: 12px; font-size: 13px; font-weight: 700; background-color: #432816; color: #faf7f2; border: 1px solid #c5a572; border-radius: 8px; text-decoration: none; cursor: pointer; transition: all 0.2s;">
              <span>⬇️</span>
              <span>Unduh Game untuk Laptop (Windows .exe)</span>
            </a>
          </div>

          <!-- Opsi 2: Kacamata VR Mandiri / Android (.apk) -->
          <div style="background-color: #0c0805; border: 1px solid rgba(197, 165, 114, 0.35); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
              <span style="font-size: 11px; font-weight: 600; background-color: #2b1d13; color: #e5d8be; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(197, 165, 114, 0.4);">
                Kacamata VR &amp; Android
              </span>
              <span style="font-size: 11px; color: #e5d8be; opacity: 0.8; font-family: monospace;">Format .apk (${window.GAME_DOWNLOAD_CONFIG.androidSize})</span>
            </div>
            
            <h3 style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 4px; display:flex; align-items:center; gap: 8px;">
              <span>🥽</span>
              <span>Versi Kacamata VR / Android (.apk)</span>
            </h3>
            <p style="font-size: 12px; color: #e5d8be; opacity: 0.8; line-height: 1.5; margin-bottom: 12px;">
              Khusus untuk kacamata <strong>Meta Quest 2 &amp; 3</strong> via <em>Sideload / SideQuest</em> atau smartphone Android bergiroskop.
            </p>

            <a id="link-download-android" href="${window.GAME_DOWNLOAD_CONFIG.androidApkUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 8px; width: 100%; padding: 10px; font-size: 12px; font-weight: 600; background-color: #23160e; color: #e5d8be; border: 1px solid rgba(197, 165, 114, 0.5); border-radius: 8px; text-decoration: none; cursor: pointer; transition: all 0.2s;">
              <span>📦</span>
              <span>Unduh Paket VR (.apk)</span>
            </a>
          </div>

          <!-- Bagian Khusus Pengembang / Testing Lokal -->
          <div style="border-top: 1px dashed rgba(197, 165, 114, 0.25); pt-3; margin-top: 14px; padding-top: 14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 8px;">
              <span style="font-size: 11px; color: #c5a572; font-weight: 600;">🛠️ Khusus Pengembang (Lokal):</span>
            </div>
            <p style="font-size: 11px; color: #a8947d; line-height: 1.4; margin-bottom: 10px;">
              Jika Anda sedang mengedit proyek ini di laptop sendiri, Anda bisa langsung membuka atau beralih ke Unity Editor:
            </p>
            <div style="display:flex; gap: 8px; flex-wrap: wrap;">
              <button id="btn-modal-open-unity" type="button" style="padding: 8px 12px; font-size: 11.5px; font-weight: 600; background-color: #1e130b; color: #e5d8be; border: 1px solid #8c6d46; border-radius: 6px; cursor: pointer;">
                ⚡ Buka Proyek di Unity Editor
              </button>
            </div>
          </div>

          <button id="btn-close-download-bottom" style="width: 100%; margin-top: 18px; padding: 10px; font-size: 12px; font-weight: 700; background-color: #24160d; color: #e5d8be; border: 1px solid rgba(197, 165, 114, 0.35); border-radius: 8px; cursor: pointer;">
            Tutup
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 250);
      };

      modal.querySelector('#btn-close-download-modal').onclick = closeModal;
      modal.querySelector('#btn-close-download-bottom').onclick = closeModal;
      modal.onclick = (e) => { if (e.target === modal) closeModal(); };

      // Handler Tombol Windows
      const linkWin = modal.querySelector('#link-download-windows');
      if (linkWin) {
        linkWin.onclick = () => {
          showToast('Membuka tautan unduhan game Windows (.exe)...', 'success', 4000);
        };
      }

      // Handler Tombol Android
      const linkApk = modal.querySelector('#link-download-android');
      if (linkApk) {
        linkApk.onclick = () => {
          showToast('Membuka tautan unduhan paket VR (.apk)...', 'success', 4000);
        };
      }

      // Handler Buka Unity Lokal
      const btnUnity = modal.querySelector('#btn-modal-open-unity');
      if (btnUnity) {
        btnUnity.onclick = (e) => {
          closeModal();
          window.launchUnityGame(e);
        };
      }
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
  };

  // ==========================================
  // FITUR PELUNCUR UNITY LOKAL (MODE PENGEMBANG)
  // ==========================================
  window.launchUnityGame = async function (e) {
    if (e && e.preventDefault) e.preventDefault();

    showToast('Sedang beralih ke Unity Engine (arvr_perbaikan)...', 'loading', 0);

    // 1. Eksekusi Deep-link Protocol Langsung (Bekerja tanpa perlu node server.js!)
    try {
      const link = document.createElement('a');
      link.href = 'unity-arvr://open';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 1000);
    } catch (protoErr) {
      console.warn('Gagal memicu protokol langsung:', protoErr);
    }

    // 2. Hubungi endpoint lokal port 3000 jika node server.js aktif
    const endpoints = [
      'http://localhost:3000/api/launch-game',
      'http://127.0.0.1:3000/api/launch-game',
      '/api/launch-game'
    ];

    let apiLaunched = false;

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        if (response.ok && data.success) {
          showToast('Berhasil terhubung ke Unity! Membuka arvr_perbaikan...', 'success', 5000);
          apiLaunched = true;
          break;
        }
      } catch (err) {
        // Lanjutkan mencoba endpoint berikutnya
      }
    }

    if (!apiLaunched) {
      showToast('Perintah terkirim ke Unity di komputer!', 'success', 4000);
    }
  };

  function initLauncher() {
    const downloadButtons = document.querySelectorAll('#btnMainLaunch, .launch-game-link, [data-action="download-game"]');
    downloadButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        window.openDownloadModal(e);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLauncher);
  } else {
    initLauncher();
  }
})();
