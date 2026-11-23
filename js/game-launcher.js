/**
 * Pusat Unduhan Game - Lelana Jateng
 * Mengatur unduhan aplikasi permainan (Windows .exe & Meta Quest/Android .apk)
 * serta integrasi peluncur lokal Unity untuk pengembang.
 */

(function () {
  'use strict';

  // Konfigurasi Tautan Unduhan Game
  window.GAME_DOWNLOAD_CONFIG = {
    windowsExeUrl: 'https://github.com/shidoyv/projectpplg2026/releases',
    androidApkUrl: 'https://github.com/shidoyv/projectpplg2026/releases',
    version: '1.0.0',
    windowsSize: '185 MB',
    androidSize: '140 MB'
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
      background-color: #120A06;
      color: #FAF7F2;
      border: 1px solid rgba(197, 165, 114, 0.5);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      padding: 10px 18px;
      font-size: 13px;
      font-family: system-ui, -apple-system, sans-serif;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 90vw;
    `;
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function showToast(message, type = 'info', duration = 3500) {
    const toast = createToast();
    let borderColor = 'rgba(197, 165, 114, 0.5)';

    if (type === 'success') {
      borderColor = '#4ade80';
    } else if (type === 'error') {
      borderColor = '#f87171';
    }

    toast.style.borderColor = borderColor;
    toast.textContent = message;
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
  // MODAL PUSAT UNDUHAN GAME (BERSIH & ELEGAN)
  // ==========================================
  window.openDownloadModal = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    let modal = document.getElementById('game-download-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-download-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Unduh Berkas Permainan');
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: rgba(5, 3, 2, 0.85);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;

      modal.innerHTML = `
        <div style="background-color: #110B07; border: 1px solid rgba(197, 165, 114, 0.35); border-radius: 12px; max-width: 540px; width: 100%; padding: 24px sm:padding: 28px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85); color: #FAF7F2; font-family: system-ui, -apple-system, sans-serif; max-height: 90vh; overflow-y: auto;">
          
          <!-- Tajuk Modal -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 1px solid rgba(197, 165, 114, 0.15); padding-bottom: 14px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 700; color: #FAF7F2; margin: 0; letter-spacing: -0.01em;">
                Unduh Berkas Permainan
              </h2>
              <p style="font-size: 12px; color: #E5D8BE; opacity: 0.7; margin: 4px 0 0 0;">
                Misteri Gerbang Candi Borobudur &bull; Versi ${window.GAME_DOWNLOAD_CONFIG.version}
              </p>
            </div>
            <button id="btn-close-download-modal" type="button" aria-label="Tutup jendela" style="background: none; border: none; color: #E5D8BE; font-size: 18px; cursor: pointer; padding: 4px 8px; line-height: 1; opacity: 0.75; transition: opacity 0.15s;">
              &#x2715;
            </button>
          </div>

          <!-- Opsi 1: Edisi Komputer Windows (.exe) -->
          <div style="background-color: #1A110A; border: 1px solid rgba(197, 165, 114, 0.4); border-radius: 10px; padding: 16px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 11px; font-mono; font-weight: 600; color: #C5A572; letter-spacing: 0.05em; text-transform: uppercase;">
                Edisi Komputer (Laptop &amp; PC)
              </span>
              <span style="font-size: 11px; color: #E5D8BE; opacity: 0.6; font-family: monospace;">
                Windows 64-bit &bull; ${window.GAME_DOWNLOAD_CONFIG.windowsSize}
              </span>
            </div>
            
            <p style="font-size: 12.5px; color: #E5D8BE; opacity: 0.85; line-height: 1.5; margin: 0 0 14px 0;">
              Format mandiri (.exe) untuk sistem operasi Windows. Dimainkan langsung menggunakan Keyboard dan Mouse biasa, serta mendukung kacamata PCVR (Oculus Link atau SteamVR).
            </p>

            <a id="link-download-windows" href="${window.GAME_DOWNLOAD_CONFIG.windowsExeUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 11px 16px; font-size: 13px; font-weight: 600; background-color: #382215; color: #FAF7F2; border: 1px solid #C5A572; border-radius: 6px; text-decoration: none; cursor: pointer; transition: background-color 0.15s;">
              Unduh Versi Windows (.exe)
            </a>
          </div>

          <!-- Opsi 2: Kacamata VR Mandiri / Android (.apk) -->
          <div style="background-color: #150D07; border: 1px solid rgba(197, 165, 114, 0.2); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 11px; font-weight: 600; color: #A8947D; letter-spacing: 0.05em; text-transform: uppercase;">
                Edisi Kacamata VR Mandiri
              </span>
              <span style="font-size: 11px; color: #E5D8BE; opacity: 0.6; font-family: monospace;">
                Paket .apk &bull; ${window.GAME_DOWNLOAD_CONFIG.androidSize}
              </span>
            </div>
            
            <p style="font-size: 12.5px; color: #E5D8BE; opacity: 0.75; line-height: 1.5; margin: 0 0 14px 0;">
              Paket instalasi khusus untuk kacamata Meta Quest 2 dan 3 melalui pemasangan mandiri (SideQuest / Sideload) atau perangkat Android pendukung.
            </p>

            <a id="link-download-android" href="${window.GAME_DOWNLOAD_CONFIG.androidApkUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 10px 16px; font-size: 12.5px; font-weight: 500; background-color: #1E130B; color: #E5D8BE; border: 1px solid rgba(197, 165, 114, 0.3); border-radius: 6px; text-decoration: none; cursor: pointer; transition: background-color 0.15s;">
              Unduh Paket APK (.apk)
            </a>
          </div>

          <!-- Petunjuk Pemasangan & Akses Lokal -->
          <div style="border-top: 1px solid rgba(197, 165, 114, 0.12); padding-top: 14px; margin-top: 14px;">
            <p style="font-size: 11.5px; color: #A8947D; line-height: 1.5; margin: 0 0 10px 0;">
              Petunjuk: Setelah mengunduh paket Windows, ekstrak folder arsip lalu buka berkas <code>arvr_perbaikan.exe</code> untuk mulai menjelajah.
            </p>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 11.5px;">
              <button id="btn-modal-open-unity" type="button" style="background: none; border: none; color: #C5A572; text-decoration: underline; padding: 0; cursor: pointer; font-size: 11.5px;">
                Buka proyek di Unity Editor lokal (khusus pengembang)
              </button>
              <button id="btn-close-download-bottom" type="button" style="background: none; border: 1px solid rgba(197, 165, 114, 0.25); color: #E5D8BE; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                Tutup
              </button>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 200);
      };

      modal.querySelector('#btn-close-download-modal').onclick = closeModal;
      modal.querySelector('#btn-close-download-bottom').onclick = closeModal;
      modal.onclick = (e) => { if (e.target === modal) closeModal(); };

      // Escape key listener untuk aksesibilitas keyboard
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
          closeModal();
        }
      });

      // Handler Tombol Windows
      const linkWin = modal.querySelector('#link-download-windows');
      if (linkWin) {
        linkWin.onclick = () => {
          showToast('Membuka tautan unduhan Windows (.exe)...', 'info', 3000);
        };
      }

      // Handler Tombol Android
      const linkApk = modal.querySelector('#link-download-android');
      if (linkApk) {
        linkApk.onclick = () => {
          showToast('Membuka tautan unduhan paket APK (.apk)...', 'info', 3000);
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

    showToast('Sedang beralih ke Unity Engine (arvr_perbaikan)...', 'info', 3000);

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
          showToast('Berhasil terhubung ke Unity! Membuka arvr_perbaikan...', 'success', 4000);
          apiLaunched = true;
          break;
        }
      } catch (err) {
        // Lanjutkan mencoba endpoint berikutnya
      }
    }

    if (!apiLaunched) {
      showToast('Perintah terkirim ke Unity di komputer.', 'info', 3500);
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
