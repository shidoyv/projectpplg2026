/**
 * Pusat Unduhan Game - Lelana Jateng
 * Mengatur unduhan aplikasi permainan mandiri (Windows .exe)
 */

(function () {
  'use strict';

  // Konfigurasi Tautan Unduhan Game
  window.GAME_DOWNLOAD_CONFIG = {
    windowsExeUrl: 'downloads/Misteri_Candi_Borobudur_Windows.zip',
    version: '1.0.0',
    windowsSize: '72 MB'
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
  // MODAL PUSAT UNDUHAN GAME WINDOWS (.EXE)
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
        background-color: rgba(5, 3, 2, 0.88);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        padding: 16px;
        opacity: 0;
        transition: opacity 0.25s ease;
      `;

      modal.innerHTML = `
        <div style="background-color: #140d08; border: 1px solid #c5a572; border-radius: 16px; max-width: 560px; width: 100%; padding: 24px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); color: #faf7f2; font-family: system-ui, -apple-system, sans-serif; max-height: 90vh; overflow-y: auto; margin: auto;">
          
          <!-- Header Modal -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1px solid rgba(197, 165, 114, 0.2); padding-bottom: 12px;">
            <div>
              <div style="font-size: 18px; font-weight: 700; color: #c5a572;">
                Unduh Aplikasi Game AR / VR
              </div>
              <p style="font-size: 12px; color: #e5d8be; opacity: 0.75; margin: 3px 0 0 0;">
                Misteri Gerbang Candi Borobudur &bull; Versi ${window.GAME_DOWNLOAD_CONFIG.version}
              </p>
            </div>
            <button id="btn-close-download-modal" type="button" aria-label="Tutup jendela" style="background: none; border: none; color: #e5d8be; font-size: 20px; cursor: pointer; padding: 4px 8px; line-height: 1; opacity: 0.8;">✕</button>
          </div>

          <!-- Opsi: Komputer / Laptop Windows (.exe) -->
          <div style="background: linear-gradient(135deg, rgba(56, 34, 21, 0.75), rgba(26, 17, 10, 0.9)); border: 1.5px solid #c5a572; border-radius: 12px; padding: 18px; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; background-color: rgba(197, 165, 114, 0.2); color: #c5a572; border: 1px solid rgba(197, 165, 114, 0.5); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                Paling Direkomendasikan
              </span>
              <span style="font-size: 11px; color: #e5d8be; opacity: 0.8; font-family: monospace;">Windows 64-bit (${window.GAME_DOWNLOAD_CONFIG.windowsSize})</span>
            </div>
            
            <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0;">
              Versi Komputer / Laptop Windows (.exe)
            </h3>
            <p style="font-size: 12.5px; color: #e5d8be; opacity: 0.85; line-height: 1.5; margin: 0 0 16px 0;">
              Format aplikasi langsung untuk laptop/PC. Mendukung kontrol <strong>Keyboard &amp; Mouse</strong> biasa, serta kacamata <strong>PCVR (Oculus Link / SteamVR)</strong>. Tinggal ekstrak zip dan klik 2x pada <code>arvr_perbaikan.exe</code> untuk bermain.
            </p>

            <a id="link-download-windows" href="${window.GAME_DOWNLOAD_CONFIG.windowsExeUrl}" download="Misteri_Candi_Borobudur_Windows.zip" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 12px; font-size: 13.5px; font-weight: 700; background-color: #432816; color: #faf7f2; border: 1px solid #c5a572; border-radius: 8px; text-decoration: none; cursor: pointer; transition: all 0.2s;">
              Unduh Game untuk Laptop (Windows .exe)
            </a>
          </div>

          <button id="btn-close-download-bottom" type="button" style="width: 100%; padding: 10px; font-size: 12px; font-weight: 700; background-color: #24160d; color: #e5d8be; border: 1px solid rgba(197, 165, 114, 0.35); border-radius: 8px; cursor: pointer;">
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
          showToast('Mengunduh paket game Windows (Misteri Candi Borobudur)...', 'info', 3000);
        };
      }
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
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
