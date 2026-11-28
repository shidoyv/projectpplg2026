/**
 * Peluncur Game WebGL (HP & Laptop) & Pusat Unduhan Windows (.exe) - Lelana Jateng
 * Menjalankan Unity WebGL langsung di dalam website dengan kontrol layar sentuh untuk HP
 * serta keyboard & mouse untuk Laptop/PC.
 */

(function () {
  'use strict';

  // Konfigurasi WebGL & Tautan Unduhan Game
  window.GAME_DOWNLOAD_CONFIG = {
    windowsExeUrl: 'downloads/Misteri_Candi_Borobudur_Windows.zip',
    webglBasePath: 'game-webgl',
    webglBuildName: 'game-webgl',
    version: '1.1.0',
    windowsSize: '72 MB'
  };

  let unityInstance = null;
  let isLaunching = false;
  let touchControlsEnabled = false;
  let toastEl = null;

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

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
      z-index: 1000001;
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
    if (type === 'success') borderColor = '#4ade80';
    else if (type === 'error') borderColor = '#f87171';

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

  function sendToUnity(method, param) {
    if (!unityInstance) return;
    try {
      unityInstance.SendMessage('WebInputBridge', method, param !== undefined ? String(param) : '');
    } catch (_) {
      // Abaikan jika scene sedang reload
    }
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-unity-loader="${src}"]`);
      if (existing && typeof window.createUnityInstance === 'function') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-unity-loader', src);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Gagal memuat file loader game: ${src}`));
      document.body.appendChild(script);
    });
  }

  async function detectBuildFiles(basePath, buildName) {
    const buildDir = `${basePath}/Build`;
    const loaderUrl = `${buildDir}/${buildName}.loader.js`;

    const checkExists = async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch (_) {
        return false;
      }
    };

    const hasUnityweb = await checkExists(`${buildDir}/${buildName}.wasm.unityweb`);
    if (hasUnityweb) {
      return {
        loaderUrl,
        dataUrl: `${buildDir}/${buildName}.data.unityweb`,
        frameworkUrl: `${buildDir}/${buildName}.framework.js.unityweb`,
        codeUrl: `${buildDir}/${buildName}.wasm.unityweb`
      };
    }

    const hasGz = await checkExists(`${buildDir}/${buildName}.wasm.gz`);
    if (hasGz) {
      return {
        loaderUrl,
        dataUrl: `${buildDir}/${buildName}.data.gz`,
        frameworkUrl: `${buildDir}/${buildName}.framework.js.gz`,
        codeUrl: `${buildDir}/${buildName}.wasm.gz`
      };
    }

    const hasBr = await checkExists(`${buildDir}/${buildName}.wasm.br`);
    if (hasBr) {
      return {
        loaderUrl,
        dataUrl: `${buildDir}/${buildName}.data.br`,
        frameworkUrl: `${buildDir}/${buildName}.framework.js.br`,
        codeUrl: `${buildDir}/${buildName}.wasm.br`
      };
    }

    return {
      loaderUrl,
      dataUrl: `${buildDir}/${buildName}.data`,
      frameworkUrl: `${buildDir}/${buildName}.framework.js`,
      codeUrl: `${buildDir}/${buildName}.wasm`
    };
  }

  // ==========================================
  // PELUNCUR GAME WEBGL (HP & LAPTOP)
  // ==========================================
  window.launchWebGame = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    if (isLaunching) return;

    if (window.location.protocol === 'file:') {
      showToast('Buka website melalui server (node server.js -> http://localhost:3000/arvr.html) agar game WebGL dapat berjalan.', 'error', 6000);
      return;
    }

    const ambientAudio = document.getElementById('ambientAudio');
    if (ambientAudio && !ambientAudio.paused) {
      ambientAudio.pause();
      const label = document.getElementById('ambienceLabel');
      if (label) label.textContent = 'Dengarkan Ambience Malam';
    }

    let overlay = document.getElementById('webgl-game-overlay');
    if (!overlay) {
      overlay = createWebGameOverlay();
      document.body.appendChild(overlay);
      bindTouchControls(overlay);
    }

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    touchControlsEnabled = isTouchDevice();
    updateTouchControlsVisibility(overlay);

    if (unityInstance) {
      sendToUnity('SetMobileMode', touchControlsEnabled ? '1' : '0');
      return;
    }

    isLaunching = true;
    const loadingEl = overlay.querySelector('#webgl-loading-screen');
    const progressBar = overlay.querySelector('#webgl-progress-fill');
    const progressText = overlay.querySelector('#webgl-progress-text');
    const progressPct = overlay.querySelector('#webgl-progress-pct');
    const fieldNote = overlay.querySelector('#webgl-field-note');
    const errorBox = overlay.querySelector('#webgl-error-box');
    const canvas = overlay.querySelector('#unity-webgl-canvas');

    loadingEl.style.display = 'flex';
    errorBox.style.display = 'none';
    progressBar.style.width = '4%';
    if (progressPct) progressPct.textContent = '4%';
    progressText.textContent = 'Menyiapkan mesin 3D...';
    if (fieldNote) {
      fieldNote.textContent = touchControlsEnabled
        ? 'Putar layar ke posisi landscape agar pandangan lebih lega. Gunakan analog kiri untuk berjalan, geser sisi kanan layar untuk menoleh, dan temukan tiga kunci pusaka di rumah joglo.'
        : 'Tiga kunci pusaka (Kuningan, Besi, dan Perunggu) tersembunyi di sekitar pelataran. Klik layar setelah masuk untuk mengunci kamera, lalu tekan F bila senter mulai berkedip.';
    }

    try {
      const cfg = window.GAME_DOWNLOAD_CONFIG;
      const files = await detectBuildFiles(cfg.webglBasePath, cfg.webglBuildName);

      await loadScriptOnce(files.loaderUrl);

      if (typeof window.createUnityInstance !== 'function') {
        throw new Error('Fungsi createUnityInstance tidak ditemukan pada loader WebGL.');
      }

      const unityConfig = {
        dataUrl: files.dataUrl,
        frameworkUrl: files.frameworkUrl,
        codeUrl: files.codeUrl,
        streamingAssetsUrl: `${cfg.webglBasePath}/StreamingAssets`,
        companyName: 'Lelana Jateng',
        productName: 'Misteri Gerbang Candi Borobudur',
        productVersion: cfg.version,
        matchWebGLToCanvasSize: true,
            devicePixelRatio: Math.min(window.devicePixelRatio || 1, isTouchDevice() ? 1.5 : 2)
      };

      unityInstance = await window.createUnityInstance(canvas, unityConfig, (progress) => {
        const pct = Math.max(5, Math.min(100, Math.round(progress * 100)));
        progressBar.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;
        if (pct < 45) {
          progressText.textContent = 'Memuat arsitektur pelataran candi...';
        } else if (pct < 85) {
          progressText.textContent = 'Menata kabut malam dan relief...';
        } else {
          progressText.textContent = 'Menyiapkan pencahayaan dan audio...';
        }
      });

      loadingEl.style.display = 'none';
      sendToUnity('SetMobileMode', touchControlsEnabled ? '1' : '0');

      showToast(
        touchControlsEnabled
              ?'Game siap. Gunakan analog kiri dan geser layar kanan untuk melihat sekitar.'
              : 'Game siap. Klik layar untuk mengunci kamera, tekan ESC untuk melepas kursor.',
        'success',
        4500
      );
    } catch (err) {
      console.error('[WebGL Launcher Error]:', err);
      progressBar.style.width = '0%';
      if (progressPct) progressPct.textContent = '0%';
      progressText.textContent = 'Pemuatan terhenti';
      errorBox.style.display = 'block';
      errorBox.querySelector('#webgl-error-msg').textContent =
        err && err.message ? err.message : 'Gagal memuat game WebGL.';
    } finally {
      isLaunching = false;
    }
  };

  function createWebGameOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'webgl-game-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Pemain Game Misteri Gerbang Candi Borobudur');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100dvh;
      background-color: #080503;
      z-index: 999998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    `;

    overlay.innerHTML = `
      <!-- Top Control Bar -->
      <div id="webgl-topbar" style="position: relative; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; background: rgba(16, 11, 7, 0.92); border-bottom: 1px solid rgba(197, 165, 114, 0.28); flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
          <span style="color: #FAF7F2; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Misteri Gerbang Candi Borobudur
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <button id="btn-toggle-touch-ui" type="button" style="padding: 6px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; background: #26180F; color: #E5D8BE; border: 1px solid rgba(197, 165, 114, 0.4); cursor: pointer;">
            Kontrol HP: OFF
          </button>
          <button id="btn-webgl-fullscreen" type="button" style="padding: 6px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; background: #26180F; color: #E5D8BE; border: 1px solid rgba(197, 165, 114, 0.4); cursor: pointer;">
            Layar Penuh
          </button>
          <button id="btn-webgl-close" type="button" style="padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 6px; background: #5c1919; color: #FAF7F2; border: 1px solid rgba(248, 113, 113, 0.5); cursor: pointer;">
            Keluar
          </button>
        </div>
      </div>

      <!-- Main Game Stage -->
      <div id="webgl-stage" style="position: relative; flex: 1; width: 100%; height: 100%; background: #000; overflow: hidden;">
        <canvas id="unity-webgl-canvas" tabindex="0" style="width: 100%; height: 100%; display: block; background: #050302; outline: none;"></canvas>

        <!-- Loading Screen (Editorial Game Stage) -->
        <div id="webgl-loading-screen" style="position: absolute; inset: 0; z-index: 25; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(20px, 4vw, 48px) clamp(20px, 5vw, 56px) clamp(28px, 5vw, 48px); background: linear-gradient(12deg, rgba(10, 6, 4, 0.96) 0%, rgba(12, 7, 4, 0.84) 48%, rgba(16, 10, 6, 0.42) 100%), url('assets/articles/borobudur-relief.jpg') center 35%/cover no-repeat; overflow-y: auto;">

          <!-- Top Stamp: Lokasi -->
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 13px; color: #E5D8BE;">
              Pelataran Timur, Candi Borobudur
            </span>
            <span style="font-size: 12px; color: rgba(229, 216, 190, 0.72);">
              Lelana Jateng
            </span>
          </div>

          <!-- Bottom Asymmetric Anchor: Judul + Catatan Lapangan di kiri, Progres di kanan -->
          <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; flex-wrap: wrap; margin-top: auto; padding-top: 32px;">
            <div style="max-width: 540px; flex: 1 1 280px;">
              <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: clamp(26px, 4.2vw, 44px); font-weight: 700; color: #FAF7F2; line-height: 1.08; margin: 0 0 14px 0; letter-spacing: -0.01em;">
                Misteri Gerbang <span style="color: #C5A572; font-style: italic; font-weight: 600;">Candi Borobudur</span>
              </h2>
              <div style="border-top: 1px solid rgba(197, 165, 114, 0.35); padding-top: 12px;">
                <p id="webgl-field-note" style="margin: 0; font-size: 13px; color: #E5D8BE; line-height: 1.6;">
                  Tiga kunci pusaka (Kuningan, Besi, dan Perunggu) tersembunyi di sekitar pelataran. Klik layar setelah masuk untuk mengunci kamera, lalu tekan F bila senter mulai berkedip.
                </p>
              </div>

              <!-- Error Box -->
              <div id="webgl-error-box" style="display: none; margin-top: 16px; padding: 14px 16px; border-radius: 6px; background: rgba(45, 12, 12, 0.92); border: 1px solid rgba(248, 113, 113, 0.55); text-align: left;">
                <div style="font-size: 13px; font-weight: 700; color: #fca5a5; margin-bottom: 4px;">Gagal Menjalankan Game WebGL</div>
                <div id="webgl-error-msg" style="font-size: 12px; color: #fecaca; line-height: 1.5;"></div>
                <button id="btn-webgl-retry" type="button" style="margin-top: 10px; padding: 8px 14px; border-radius: 4px; background: #C5A572; color: #100B07; font-size: 12px; font-weight: 700; border: none; cursor: pointer;">
                  Coba Muat Ulang
                </button>
              </div>
            </div>

            <div style="text-align: right; flex: 0 0 auto; min-width: 180px;">
              <div id="webgl-progress-pct" style="font-family: 'Playfair Display', Georgia, serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; color: #FAF7F2; line-height: 1; font-variant-numeric: tabular-nums;">
                0%
              </div>
              <p id="webgl-progress-text" style="margin: 8px 0 0 0; font-size: 12.5px; color: #E5D8BE;">
                Menyiapkan mesin 3D...
              </p>
            </div>
          </div>

          <!-- Razor Progress Hairline di tepi bawah layar -->
          <div style="position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: rgba(250, 247, 242, 0.14);">
            <div id="webgl-progress-fill" style="width: 0%; height: 100%; background: #C5A572; transition: width 0.25s ease-out;"></div>
          </div>
        </div>

        <!-- Mobile Touch Controls Overlay -->
        <div id="mobile-touch-controls" style="position: absolute; inset: 0; z-index: 20; display: none; pointer-events: none;">
          <!-- Right Half Look Drag Zone -->
          <div id="touch-look-zone" style="position: absolute; top: 0; right: 0; width: 55%; height: 100%; pointer-events: auto; touch-action: none;"></div>

          <!-- Left Virtual Joystick Zone -->
          <div id="touch-joystick-zone" style="position: absolute; bottom: 20px; left: 20px; width: 148px; height: 148px; pointer-events: auto; touch-action: none; display: flex; align-items: center; justify-content: center;">
            <div id="touch-joystick-base" style="width: 124px; height: 124px; border-radius: 999px; background: rgba(16, 11, 7, 0.45); border: 2px solid rgba(197, 165, 114, 0.55); position: relative; backdrop-filter: blur(2px);">
              <div id="touch-joystick-knob" style="width: 50px; height: 50px; border-radius: 999px; background: radial-gradient(circle, #E5D8BE 0%, #C5A572 100%); border: 2px solid #FAF7F2; box-shadow: 0 4px 12px rgba(0,0,0,0.6); position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
            </div>
          </div>

          <!-- Right Action Buttons Cluster -->
          <div style="position: absolute; bottom: 22px; right: 18px; display: grid; grid-template-columns: repeat(2, 62px); gap: 10px; pointer-events: auto; touch-action: none;">
            <button id="btn-touch-sprint" type="button" style="width: 62px; height: 62px; border-radius: 999px; background: rgba(26, 17, 10, 0.72); border: 1.5px solid rgba(197, 165, 114, 0.65); color: #FAF7F2; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);">
              LARI
            </button>
            <button id="btn-touch-interact" type="button" style="width: 62px; height: 62px; border-radius: 999px; background: rgba(197, 165, 114, 0.85); border: 1.5px solid #FAF7F2; color: #100B07; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
              BUKA
            </button>
            <button id="btn-touch-flashlight" type="button" style="width: 62px; height: 62px; border-radius: 999px; background: rgba(26, 17, 10, 0.72); border: 1.5px solid rgba(197, 165, 114, 0.65); color: #FAF7F2; font-size: 10.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);">
              SENTER
            </button>
            <button id="btn-touch-jump" type="button" style="width: 62px; height: 62px; border-radius: 999px; background: rgba(26, 17, 10, 0.72); border: 1.5px solid rgba(197, 165, 114, 0.65); color: #FAF7F2; font-size: 10.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px);">
              LOMPAT
            </button>
          </div>
        </div>
      </div>
    `;

    // Tombol Coba Muat Ulang (saat error)
    overlay.querySelector('#btn-webgl-retry').addEventListener('click', () => {
      window.launchWebGame();
    });

    // Tombol Top Bar
    overlay.querySelector('#btn-toggle-touch-ui').addEventListener('click', () => {
      touchControlsEnabled = !touchControlsEnabled;
      updateTouchControlsVisibility(overlay);
      sendToUnity('SetMobileMode', touchControlsEnabled ? '1' : '0');
    });

    overlay.querySelector('#btn-webgl-fullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (overlay.requestFullscreen) overlay.requestFullscreen().catch(() => { });
        else if (overlay.webkitRequestFullscreen) overlay.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
      }
    });

    overlay.querySelector('#btn-webgl-close').addEventListener('click', async () => {
      if (document.pointerLockElement && document.exitPointerLock) {
        document.exitPointerLock();
      }
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      overlay.style.display = 'none';
      document.body.style.overflow = '';

      if (unityInstance) {
        try {
          await unityInstance.Quit();
        } catch (_) { }
        unityInstance = null;
      }
    });

    return overlay;
  }

  function updateTouchControlsVisibility(overlay) {
    const touchUi = overlay.querySelector('#mobile-touch-controls');
    const toggleBtn = overlay.querySelector('#btn-toggle-touch-ui');

    if (touchUi) touchUi.style.display = touchControlsEnabled ? 'block' : 'none';
    if (toggleBtn) {
      toggleBtn.textContent = touchControlsEnabled ? 'Kontrol HP: ON' : 'Kontrol HP: OFF';
      toggleBtn.style.backgroundColor = touchControlsEnabled ? '#C5A572' : '#26180F';
      toggleBtn.style.color = touchControlsEnabled ? '#100B07' : '#E5D8BE';
    }
  }

  function bindTouchControls(overlay) {
    // 1. Virtual Joystick (Multi-touch tracked by identifier)
    const joyZone = overlay.querySelector('#touch-joystick-zone');
    const joyBase = overlay.querySelector('#touch-joystick-base');
    const joyKnob = overlay.querySelector('#touch-joystick-knob');
    let joyTouchId = null;
    const maxRadius = 42;

    function updateJoystick(clientX, clientY) {
      const rect = joyBase.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }
      joyKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      const normX = (dx / maxRadius).toFixed(3);
      const normY = (-dy / maxRadius).toFixed(3);
      sendToUnity('SetMove', `${normX},${normY}`);
    }

    function resetJoystick() {
      joyTouchId = null;
      joyKnob.style.transform = 'translate(-50%, -50%)';
      sendToUnity('SetMove', '0,0');
    }

    joyZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (joyTouchId !== null) return;
      const t = e.changedTouches[0];
      joyTouchId = t.identifier;
      updateJoystick(t.clientX, t.clientY);
    }, { passive: false });

    joyZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joyTouchId) {
          updateJoystick(t.clientX, t.clientY);
          break;
        }
      }
    }, { passive: false });

    joyZone.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          resetJoystick();
          break;
        }
      }
    }, { passive: false });

    joyZone.addEventListener('touchcancel', resetJoystick, { passive: false });

    // 2. Look Camera Drag Zone (Right Half)
    const lookZone = overlay.querySelector('#touch-look-zone');
    let lookTouchId = null;
    let lastLookX = 0;
    let lastLookY = 0;
    const lookSensitivity = 0.28;

    lookZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (lookTouchId !== null) return;
      const t = e.changedTouches[0];
      lookTouchId = t.identifier;
      lastLookX = t.clientX;
      lastLookY = t.clientY;
    }, { passive: false });

    lookZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === lookTouchId) {
          const dx = (t.clientX - lastLookX) * lookSensitivity;
          const dy = -(t.clientY - lastLookY) * lookSensitivity;
          lastLookX = t.clientX;
          lastLookY = t.clientY;
          sendToUnity('AddLook', `${dx.toFixed(3)},${dy.toFixed(3)}`);
          break;
        }
      }
    }, { passive: false });

    const endLook = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === lookTouchId) {
          lookTouchId = null;
          break;
        }
      }
    };
    lookZone.addEventListener('touchend', endLook, { passive: false });
    lookZone.addEventListener('touchcancel', endLook, { passive: false });

    // 3. Action Buttons
    const btnSprint = overlay.querySelector('#btn-touch-sprint');
    const setSprintVisual = (active) => {
      btnSprint.style.backgroundColor = active ? 'rgba(197, 165, 114, 0.9)' : 'rgba(26, 17, 10, 0.72)';
      btnSprint.style.color = active ? '#100B07' : '#FAF7F2';
    };
    btnSprint.addEventListener('touchstart', (e) => {
      e.preventDefault();
      setSprintVisual(true);
      sendToUnity('SetSprint', '1');
    }, { passive: false });
    btnSprint.addEventListener('touchend', (e) => {
      e.preventDefault();
      setSprintVisual(false);
      sendToUnity('SetSprint', '0');
    }, { passive: false });
    btnSprint.addEventListener('touchcancel', () => {
      setSprintVisual(false);
      sendToUnity('SetSprint', '0');
    }, { passive: false });

    const bindTapBtn = (selector, method) => {
      const btn = overlay.querySelector(selector);
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(0.92)';
        sendToUnity(method, '');
      }, { passive: false });
      btn.addEventListener('touchend', () => {
        btn.style.transform = 'scale(1)';
      }, { passive: false });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        sendToUnity(method, '');
      });
    };

    bindTapBtn('#btn-touch-jump', 'TriggerJump');
    bindTapBtn('#btn-touch-flashlight', 'TriggerFlashlight');
    bindTapBtn('#btn-touch-interact', 'TriggerInteract');
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
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; border-bottom: 1px solid rgba(197, 165, 114, 0.2); padding-bottom: 12px;">
            <div>
              <div style="font-size: 18px; font-weight: 700; color: #c5a572;">
                Unduh Aplikasi Game AR / VR
              </div>
              <p style="font-size: 12px; color: #e5d8be; opacity: 0.75; margin: 3px 0 0 0;">
                Misteri Gerbang Candi Borobudur | Versi ${window.GAME_DOWNLOAD_CONFIG.version}
              </p>
            </div>
            <button id="btn-close-download-modal" type="button" aria-label="Tutup jendela" style="background: none; border: none; color: #e5d8be; font-size: 20px; cursor: pointer; padding: 4px 8px; line-height: 1; opacity: 0.8;">✕</button>
          </div>

          <div style="background: linear-gradient(135deg, rgba(56, 34, 21, 0.75), rgba(26, 17, 10, 0.9)); border: 1.5px solid #c5a572; border-radius: 12px; padding: 18px; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.4);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 11px; font-weight: 700; background-color: rgba(197, 165, 114, 0.2); color: #c5a572; border: 1px solid rgba(197, 165, 114, 0.5); padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                Offline &amp; PCVR
              </span>
              <span style="font-size: 11px; color: #e5d8be; opacity: 0.8; font-family: monospace;">Windows 64-bit (${window.GAME_DOWNLOAD_CONFIG.windowsSize})</span>
            </div>

            <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0;">
              Versi Komputer / Laptop Windows (.exe)
            </h3>
            <p style="font-size: 12.5px; color: #e5d8be; opacity: 0.85; line-height: 1.5; margin: 0 0 16px 0;">
              Format aplikasi langsung untuk laptop/PC. Mendukung kontrol <strong>Keyboard &amp; Mouse</strong> serta kacamata <strong>PCVR (Oculus Link / SteamVR)</strong>. Tinggal ekstrak zip dan klik 2x pada <code>arvr_perbaikan.exe</code>.
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
      modal.onclick = (ev) => { if (ev.target === modal) closeModal(); };

      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && modal.style.display !== 'none') {
          closeModal();
        }
      });

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
})();
