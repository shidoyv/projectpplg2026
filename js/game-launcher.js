/**
 * Game Launcher Client Helper - Lelana Jateng
 * Menghubungkan klik menu AR/VR di web browser ke Unity Editor / Game Windows
 */

(function () {
  'use strict';

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

  // Tampilkan Modal Bantuan jika server lokal belum aktif
  function showOfflineModal() {
    let modal = document.getElementById('launcher-offline-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'launcher-offline-modal';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.25s ease;
      `;

      modal.innerHTML = `
        <div style="background-color: #17100a; border: 1px solid #c5a572; border-radius: 16px; max-width: 500px; width: 100%; padding: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); color: #faf7f2; font-family: system-ui, sans-serif;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 14px;">
            <div style="font-size: 16px; font-weight: 700; color: #c5a572; display: flex; align-items: center; gap: 8px;">
              <span>🎮</span>
              <span>Buka Game VR / Unity (arvr_perbaikan)</span>
            </div>
            <button id="btn-close-modal" style="background:none; border:none; color:#e5d8be; font-size: 18px; cursor:pointer;">✕</button>
          </div>
          
          <p style="font-size: 13px; color: #e5d8be; line-height: 1.6; margin-bottom: 16px;">
            Sistem telah mencoba membuka Unity proyek <strong>arvr_perbaikan</strong>. Jika Unity belum muncul di layar Anda, pilih salah satu opsi cepat berikut:
          </p>

          <!-- Opsi 1: Klik Langsung Protokol Windows -->
          <div style="margin-bottom: 12px;">
            <a href="unity-arvr://open" id="btn-direct-protocol" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; font-size: 13px; font-weight: 700; background-color: #382215; color: #faf7f2; border: 1px solid #c5a572; border-radius: 8px; text-decoration: none; cursor: pointer;">
              <span>⚡</span> Buka Langsung (Protokol Unity Windows)
            </a>
            <span style="display: block; font-size: 11px; color: #a8947d; margin-top: 4px; text-align: center;">
              *Klik "Open" / "Buka" jika browser menampilkan konfirmasi izin aplikasi.
            </span>
          </div>

          <!-- Opsi 2: File Batch di Folder Proyek -->
          <div style="background-color: #0b0704; border: 1px solid rgba(197, 165, 114, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
            <div style="font-size: 12px; font-weight: 600; color: #c5a572; margin-bottom: 4px;">Atau klik 2x file ini di Windows Explorer:</div>
            <code style="font-family: monospace; font-size: 12px; color: #fef08a; display: block; word-break: break-all;">Buka Game Unity.bat</code>
            <div style="font-size: 11px; color: #8c6d46; margin-top: 4px;">File berada di folder utama proyek website ini.</div>
          </div>

          <!-- Opsi 3: Buka via Unity Hub -->
          <div style="font-size: 12px; color: #a8947d; line-height: 1.5; margin-bottom: 18px;">
            Atau buka proyek secara manual di Unity Hub:<br>
            <strong style="color: #faf7f2;">C:\\Users\\vincent lim\\arvr_perbaikan</strong>
          </div>

          <button id="btn-confirm-close" style="width: 100%; padding: 10px; font-size: 13px; font-weight: 700; background-color: #24160d; color: #e5d8be; border: 1px solid rgba(197, 165, 114, 0.5); border-radius: 8px; cursor: pointer;">
            Tutup
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 250);
      };

      modal.querySelector('#btn-close-modal').onclick = closeModal;
      modal.querySelector('#btn-confirm-close').onclick = closeModal;
      modal.onclick = (e) => { if (e.target === modal) closeModal(); };

      const directBtn = modal.querySelector('#btn-direct-protocol');
      if (directBtn) {
        directBtn.onclick = () => {
          showToast('Membuka Unity Editor: arvr_perbaikan...', 'success', 4000);
          setTimeout(closeModal, 1000);
        };
      }
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
  }

  // Fungsi Utama Peluncur Game
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
        // Protokol sudah ditembakkan ke Windows. Beri waktu sejenak agar browser memproses URL protocol.
        showToast('Perintah terkirim ke Unity di komputer!', 'success', 4000);

        // Jika pengguna belum pernah mengizinkan URL protocol, tampilkan modal bantuan ramah
        setTimeout(() => {
          // Cek jika jendela belum terfokus kembali atau beri petunjuk
          showOfflineModal();
      }, 1500);
    }
  };

  function initLauncher() {
    // HANYA pasang ke tombol peluncur game, JANGAN bajak navbar a[href="arvr.html"]
    const launchButtons = document.querySelectorAll('#btnMainLaunch, .launch-game-link, [data-action="launch-unity"]');
    launchButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        window.launchUnityGame(e);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLauncher);
  } else {
    initLauncher();
  }
})();
