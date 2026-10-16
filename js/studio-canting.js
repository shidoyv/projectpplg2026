/**
 * Lelana Jateng: Studio Canting & Photo Booth Baju Batik
 * Pure Vanilla JavaScript (HTML5 Canvas, Camera Stream & Laravel API Sync)
 * Colors: Mori Ivory, Sogan Dark, Indigo, Terracotta, Bronze, Jelaga (NO YELLOW)
 */

(() => {
  'use strict';

  /* =====================================================================
     1. CONSTANTS & CULTURAL DATASETS
     ===================================================================== */
  const API_ENDPOINT = 'http://127.0.0.1:8000/api/batik';
  const LOCAL_STORAGE_KEY = 'lelana_karya_batik_cache';

  const MOTIFS = {
    parang: {
      id: 'parang',
      name: 'Parang Rusak & Barong',
      origin: 'Yogyakarta & Surakarta',
      philosophy: 'Motif batik tertua peninggalan Mataram Islam yang melambangkan ombak samudra tak pernah lelah menghantam karang, menyiratkan keteguhan budi, kepemimpinan, dan semangat pantang menyerah.',
      tag: 'Batik Keraton Klasik',
    },
    kawung: {
      id: 'kawung',
      name: 'Kawung Papat',
      origin: 'Jawa Tengah (Mataram Kuno)',
      philosophy: 'Motif geometris empat bulatan lonjong terinspirasi buah aren (kolang-kaling). Melambangkan kesucian hati, keadilan, empat penjuru mata angin, dan pengendalian diri yang luhur.',
      tag: 'Batik Geometris Sakral',
    },
    buketan: {
      id: 'buketan',
      name: 'Buketan Pekalongan',
      origin: 'Pesisir Pekalongan',
      philosophy: 'Motif pesisiran khas Pekalongan hasil akulturasi seni Eropa dan Tionghoa peranakan. Menampilkan rangkaian bunga anggun dan sulur dedaunan lambang keindahan serta keceriaan hidup.',
      tag: 'Batik Pesisiran Akulturasi',
    },
    polos: {
      id: 'polos',
      name: 'Mori Putih Bersih',
      origin: 'Tradisi Batik Tulis',
      philosophy: 'Kain putih bersih yang memberi kebebasan penuh bagi Anda untuk menorehkan motif canting kreasi sendiri dari awal.',
      tag: 'Kreasi Bebas',
    }
  };

  const GARMENTS = {
    kemeja: {
      id: 'kemeja',
      name: 'Kemeja Batik Pria',
      desc: 'Kemeja potongan modern dengan kerah kemeja tegak, saku dada, dan deretan kancing tradisional.',
      tag: 'Busana Kemeja'
    },
    kebaya: {
      id: 'kebaya',
      name: 'Kebaya Kartini Jawa',
      desc: 'Busana wanita klasik berkerah V anggun dengan lekukan pinggang ramping dan peniti susun keraton.',
      tag: 'Busana Kebaya'
    },
    beskap: {
      id: 'beskap',
      name: 'Beskap Ageng Keraton',
      desc: 'Busana resmi keraton Surakarta & Yogyakarta berkerah Shanghai dengan kancingan asimetris khas bangsawan.',
      tag: 'Busana Beskap'
    }
  };

  // Natural Dyes (STRICTLY NO YELLOW)
  const DYES = {
    sogan: { id: 'sogan', name: 'Sogan Cokelat Keraton', hex: '#4E311D' },
    indigo: { id: 'indigo', name: 'Indigo Nila', hex: '#233A59' },
    pesisir: { id: 'pesisir', name: 'Pesisiran Merah Mengkudu', hex: '#9C2C28' },
    wedelan: { id: 'wedelan', name: 'Wedelan Krem Alami', hex: '#E5D8BE' },
    pupus: { id: 'pupus', name: 'Hijau Pupus Lumut', hex: '#4A5D4E' },
    jelaga: { id: 'jelaga', name: 'Hitam Tinta Jelaga', hex: '#231B15' }
  };

  // Tourist Destination Scenic Backgrounds
  const BACKGROUNDS = {
    mori: {
      id: 'mori',
      name: 'Studio Mori Alami',
      desc: 'Kain Tenun Mori Polos Atelier',
      location: 'Atelier Lelana Jateng',
      src: null
    },
    borobudur: {
      id: 'borobudur',
      name: 'Candi Borobudur',
      desc: 'Mahakarya Buddha Terbesar di Dunia',
      location: 'Magelang, Jawa Tengah',
      src: 'assets/bg-borobudur.jpg'
    },
    prambanan: {
      id: 'prambanan',
      name: 'Candi Prambanan',
      desc: 'Kemegahan Kompleks Candi Siwa',
      location: 'Klaten, Jawa Tengah',
      src: 'assets/bg-prambanan.jpg'
    },
    dieng: {
      id: 'dieng',
      name: 'Dataran Tinggi Dieng',
      desc: 'Negeri Para Dewa & Telaga Warna',
      location: 'Wonosobo, Jawa Tengah',
      src: 'assets/bg-dieng.jpg'
    },
    karimunjawa: {
      id: 'karimunjawa',
      name: 'Karimunjawa',
      desc: 'Surga Bahari Tropis Laut Jawa',
      location: 'Jepara, Jawa Tengah',
      src: 'assets/bg-karimunjawa.jpg'
    },
    grojogan: {
      id: 'grojogan',
      name: 'Grojogan Sewu',
      desc: 'Air Terjun Sejuk Lereng Gunung Lawu',
      location: 'Karanganyar, Jawa Tengah',
      src: 'assets/bg-grojogan.jpg'
    },
    keraton: {
      id: 'keraton',
      name: 'Keraton Surakarta',
      desc: 'Istana Warisan Kasunanan Hadiningrat',
      location: 'Surakarta, Jawa Tengah',
      src: 'assets/bg-keraton.jpg'
    },
    lawangsewu: {
      id: 'lawangsewu',
      name: 'Lawang Sewu',
      desc: 'Ikon Bersejarah Seribu Pintu',
      location: 'Semarang, Jawa Tengah',
      src: 'assets/bg-lawangsewu.jpg'
    }
  };

  /* =====================================================================
     2. APPLICATION STATE
     ===================================================================== */
  const state = {
    mode: 'doodle', // 'doodle' (coret baju) or 'photobooth' (coba baju)
    activeMotif: 'parang',
    activeGarment: 'kemeja',
    activeBg: 'mori', // 'mori', 'borobudur', 'prambanan', 'dieng', 'karimunjawa', 'grojogan', 'keraton', 'lawangsewu'
    showBodyLimbs: true, // Hands & feet / complete body figure
    activeLimbPose: 'santai', // 'santai' (natural hands at sides)
    showMannequinStand: false, // Turned off by default when body limbs are shown
    showHeadpiece: true,
    showBlangkon: true,
    activeTool: 'canting', // 'canting' or 'cap'
    activeColor: DYES.sogan.hex,
    activeColorName: DYES.sogan.name,
    usedColors: new Set([DYES.sogan.name]),
    strokeWidth: 4, // 2 (halus), 4 (sedang), 8 (tebal)
    activeStamp: 'kawung', // 'kawung', 'garuda', 'cecek', 'melati'

    // Drawing state
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    undoStack: [],
    redoStack: [],
    maxHistory: 20,

    // Photo booth state
    cameraActive: false,
    cameraFacing: 'user', // 'user' or 'environment'
    webcamStream: null,
    userFaceImg: null, // HTMLImageElement or ImageBitmap
    faceScale: 1.0,
    faceOffsetX: 0,
    faceOffsetY: 0,
    isDraggingFace: false,
    dragStartX: 0,
    dragStartY: 0,
    photoCaptured: false,
    countdownTimer: null,
    isCountingDown: false,

    // Gallery state
    galleryArtworks: []
  };

  // DOM Elements cache
  let canvas, ctx, baseCanvas, baseCtx;
  let videoEl, selfieInput;
  const els = {};

  /* =====================================================================
     3. INITIALIZATION
     ===================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  function init() {
    cacheDom();
    setupCanvases();
    preloadBackgroundImages();
    bindEvents();
    renderBaseBajuLayer();
    saveHistoryState();
    loadExhibitionGallery();
  }

  function cacheDom() {
    canvas = document.getElementById('scPaintCanvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    baseCanvas = document.getElementById('scStencilCanvas');
    baseCtx = baseCanvas.getContext('2d', { willReadFrequently: true });

    els.canvasWrapper = document.getElementById('scMoriWrapper');
    els.btnCanting = document.getElementById('scBtnCanting');
    els.btnCap = document.getElementById('scBtnCap');
    els.stampSelector = document.getElementById('scStampSelector');
    els.colorReadout = document.getElementById('scActiveColorReadout');

    // Philosophy & labels
    els.motifDesc = document.getElementById('scMotifPhilosophyText');
    els.motifName = document.getElementById('scMotifNameText');
    els.motifBadge = document.getElementById('scMotifBadge');

    // Action buttons
    els.btnUndo = document.getElementById('scBtnUndo');
    els.btnRedo = document.getElementById('scBtnRedo');
    els.btnClear = document.getElementById('scBtnClear');
    els.btnResetMotif = document.getElementById('scBtnResetMotif');
    els.btnPreview = document.getElementById('scBtnPreview');
    els.btnSave = document.getElementById('scBtnSave');
    els.btnQuickDownload = document.getElementById('scBtnQuickDownload');

    // Photo Booth DOM elements
    videoEl = document.getElementById('scWebcamVideo');
    selfieInput = document.getElementById('scInputSelfie');
    els.btnStartCamera = document.getElementById('scBtnStartCamera');
    els.btnSwitchCamera = document.getElementById('scBtnSwitchCamera');
    els.btnUploadSelfie = document.getElementById('scBtnUploadSelfie');
    els.btnSnapPhoto = document.getElementById('scBtnSnapPhoto');
    els.faceZoomSlider = document.getElementById('scFaceZoomSlider');
    els.btnToggleBlangkon = document.getElementById('scBtnToggleBlangkon');
    els.btnResetFacePos = document.getElementById('scBtnResetFacePos');
    els.photoBoothPanel = document.getElementById('scPhotoBoothControls');
    els.flashOverlay = document.getElementById('scCameraFlash');
    els.countdownOverlay = document.getElementById('scCountdownOverlay');
    els.countdownNumber = document.getElementById('scCountdownNumber');

    // Atelier Mannequin, Limbs, Headpiece & Background Controls
    els.btnToggleLimbs = document.getElementById('scBtnToggleLimbs');
    els.poseSelectorPanel = document.getElementById('scPoseSelectorPanel');
    els.btnToggleMannequin = document.getElementById('scBtnToggleMannequin');
    els.btnToggleHeadpiece = document.getElementById('scBtnToggleHeadpiece');
    els.headpieceLabel = document.getElementById('scHeadpieceLabel');
    els.blangkonBtnText = document.getElementById('scBlangkonBtnText');
    els.activeBgLabel = document.getElementById('scActiveBgLabel');

    // Mode Switcher Tabs
    els.tabModeDoodle = document.getElementById('scTabModeDoodle');
    els.tabModePhoto = document.getElementById('scTabModePhoto');

    // Save Modal
    els.saveModal = document.getElementById('scSaveModal');
    els.saveForm = document.getElementById('scSaveForm');
    els.inputNamaKain = document.getElementById('scInputNamaKain');
    els.inputFilosofi = document.getElementById('scInputFilosofi');
    els.inputPembuat = document.getElementById('scInputPembuat');
    els.inputPalet = document.getElementById('scInputPalet');
    els.inputMotif = document.getElementById('scInputMotif');
    els.previewThumb = document.getElementById('scSaveThumbPreview');
    els.btnCancelSave = document.getElementById('scBtnCancelSave');
    els.btnSubmitSave = document.getElementById('scBtnSubmitSave');
    els.saveSpinner = document.getElementById('scSaveSpinner');

    // Gallery
    els.galleryGrid = document.getElementById('scGalleryGrid');
    els.galleryEmpty = document.getElementById('scGalleryEmptyState');
    els.btnRefreshGallery = document.getElementById('scBtnRefreshGallery');
    els.btnClearAllGallery = document.getElementById('scBtnClearAllGallery');

    // Detail Modal
    els.previewModal = document.getElementById('scDetailModal');
    els.detailImg = document.getElementById('scDetailImg');
    els.detailTitle = document.getElementById('scDetailTitle');
    els.detailAuthor = document.getElementById('scDetailAuthor');
    els.detailPhilosophy = document.getElementById('scDetailPhilosophy');
    els.detailPalette = document.getElementById('scDetailPalette');
    els.detailDate = document.getElementById('scDetailDate');
    els.btnDownloadArtwork = document.getElementById('scBtnDownloadArtwork');
    els.btnDeleteArtwork = document.getElementById('scBtnDeleteArtwork');
    els.btnCloseDetail = document.getElementById('scBtnCloseDetail');

    // Mobile nav
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');
    if (mobileNavToggle && mobileNavDropdown) {
      mobileNavToggle.addEventListener('click', () => {
        mobileNavDropdown.classList.toggle('hidden');
      });
    }
  }

  function setupCanvases() {
    const width = 1200;
    const height = 900;

    canvas.width = width;
    canvas.height = height;
    baseCanvas.width = width;
    baseCanvas.height = height;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  /* =====================================================================
     4. PROCEDURAL BAJU SILHOUETTES, MOTIFS & STICK LIMBS
     ===================================================================== */

  /**
   * Main render function for base canvas:
   * 1. Destination Scenic Background or Mori fabric
   * 2. Lower body (Kain Jarik Batik Sogan / Celana & Selop Tradisional)
   * 3. Baju silhouette filled with motif (Parang, Kawung, Buketan)
   * 4. Arms & Hands (Ngapurancang / Tegak Santai / Salam Hangat)
   * 5. Face frame (Live Camera / Uploaded Photo / Atelier Portrait Guide)
   * 6. Traditional Headpiece (Blangkon Keraton or Sanggul Jawa)
   */
  function renderBaseBajuLayer() {
    const w = baseCanvas.width;
    const h = baseCanvas.height;
    baseCtx.clearRect(0, 0, w, h);

    // 1. Draw Destination Scenic Background or Mori fabric
    drawCanvasBackground(baseCtx, w, h);

    // 2. Draw Lower Body: Kain Jarik / Celana & Selop Tradisional (when Tangan & Kaki active)
    if (state.showBodyLimbs) {
      drawArtisanLowerBody(baseCtx, state.activeGarment);
    } else if (state.showMannequinStand) {
      // Fallback: draw wooden mannequin stand if body limbs are toggled off
      drawMannequinStand(baseCtx, state.activeGarment);
    }

    // 3. Draw Baju Silhouette with Pre-existing Motif
    drawGarmentWithMotif(baseCtx, state.activeGarment, state.activeMotif);

    // 4. Draw Arms & Hands (when Tangan & Kaki active)
    if (state.showBodyLimbs) {
      drawArtisanHands(baseCtx, state.activeGarment, state.activeLimbPose);
    }

    // 5. Draw Face in Cutout (Live Camera or Uploaded Photo or Atelier Portrait Guide)
    drawFaceInFrame(baseCtx);

    // 6. Draw Traditional Javanese Headpiece (Blangkon or Sanggul)
    if (state.showHeadpiece) {
      drawHeadpiece(baseCtx, state.activeGarment);
    }

    // Update UI text descriptions, headpiece label & active background readout
    const m = MOTIFS[state.activeMotif] || MOTIFS.polos;
    const g = GARMENTS[state.activeGarment] || GARMENTS.kemeja;
    const bg = BACKGROUNDS[state.activeBg] || BACKGROUNDS.mori;

    if (els.motifName) els.motifName.textContent = `${g.name} &bull; ${m.name}`;
    if (els.motifDesc) els.motifDesc.textContent = `${g.desc} Dipadukan filosofi ${m.name}: ${m.philosophy}. Berlatar di ${bg.name} (${bg.location}).`;
    if (els.motifBadge) els.motifBadge.textContent = `${g.tag} &bull; ${m.tag} &bull; ${bg.name}`;
    if (els.inputMotif) els.inputMotif.value = `${g.name} (${m.name}) di ${bg.name}`;
    if (els.activeBgLabel) els.activeBgLabel.textContent = bg.name;

    syncHeadpieceLabels();
  }

  /* Cache for preloaded background image objects */
  const bgImagesCache = {};

  function preloadBackgroundImages() {
    Object.keys(BACKGROUNDS).forEach(key => {
      const bg = BACKGROUNDS[key];
      if (bg.src) {
        const img = new Image();
        img.onload = () => {
          bgImagesCache[key] = img;
          if (state.activeBg === key) {
            renderBaseBajuLayer();
          }
        };
        img.src = bg.src;
      }
    });
  }

  /**
   * Dispatcher for canvas background (Destination photo or woven Mori cloth)
   */
  function drawCanvasBackground(c, w, h) {
    const bgKey = state.activeBg || 'mori';
    const bgData = BACKGROUNDS[bgKey] || BACKGROUNDS.mori;
    const cachedImg = bgImagesCache[bgKey];

    if (bgKey === 'mori' || !cachedImg || !cachedImg.complete || cachedImg.naturalWidth === 0) {
      drawMoriBackground(c, w, h);
      return;
    }

    drawDestinationBackground(c, cachedImg, bgData, w, h);
  }

  /**
   * Render Scenic Destination Background with atmospheric lighting wash and location watermark
   */
  function drawDestinationBackground(c, img, bgData, w, h) {
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const scale = Math.max(w / imgW, h / imgH);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (imgW - sw) / 2;
    const sy = (imgH - sh) / 2;

    c.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

    // Warm scenic ambient lighting wash
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(20, 14, 10, 0.28)');
    grad.addColorStop(0.5, 'rgba(20, 14, 10, 0.10)');
    grad.addColorStop(1, 'rgba(20, 14, 10, 0.50)');
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);

    // Soft corner vignette
    const vig = c.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(15, 10, 7, 0.40)');
    c.fillStyle = vig;
    c.fillRect(0, 0, w, h);

    // Elegant location stamp in bottom corner
    c.save();
    c.font = '600 13px Cinzel, "Playfair Display", Georgia, serif';
    c.fillStyle = 'rgba(250, 247, 242, 0.95)';
    c.shadowColor = 'rgba(0, 0, 0, 0.85)';
    c.shadowBlur = 8;
    c.fillText(bgData.name.toUpperCase(), 35, h - 38);
    c.font = 'italic 400 11px "Plus Jakarta Sans", sans-serif';
    c.fillStyle = 'rgba(229, 216, 190, 0.90)';
    c.fillText(bgData.location, 35, h - 20);
    c.restore();
  }

  /**
   * Mori Fabric Background with subtle organic thread texture
   */
  function drawMoriBackground(c, w, h) {
    c.fillStyle = '#FAF7F2';
    c.fillRect(0, 0, w, h);

    // Subtle weave pattern
    c.fillStyle = 'rgba(78, 49, 29, 0.035)';
    for (let x = 0; x < w; x += 12) {
      c.fillRect(x, 0, 1, h);
    }
    for (let y = 0; y < h; y += 12) {
      c.fillRect(0, y, w, 1);
    }
  }

  /**
   * ARTISANAL WOODEN MANNEQUIN STAND
   * High-end tailor's bust display crafted in polished Javanese teak wood (Kayu Jati Cokelat)
   * with turned support column, brass adjustment key, and cabriole tripod base.
   */
  function drawMannequinStand(c, garment) {
    c.save();

    // Floor cast shadow under the stand
    c.fillStyle = 'rgba(35, 27, 21, 0.16)';
    c.beginPath();
    c.ellipse(600, 848, 140, 18, 0, 0, Math.PI * 2);
    c.fill();

    const columnTopY = (garment === 'kebaya') ? 610 : 575;
    const pedestalY = 780;

    // 1. Turned Wooden Column (Pilar Penyangga Kayu Jati)
    const colGrad = c.createLinearGradient(590, 0, 610, 0);
    colGrad.addColorStop(0, '#2D1B11');
    colGrad.addColorStop(0.35, '#543622');
    colGrad.addColorStop(0.7, '#3A2415');
    colGrad.addColorStop(1, '#20130B');

    c.fillStyle = colGrad;
    c.fillRect(592, columnTopY, 16, pedestalY - columnTopY);

    // Turned wood decorative rings on the column
    [columnTopY + 30, 675, 735].forEach(ringY => {
      c.fillStyle = '#6B452C';
      c.fillRect(588, ringY, 24, 7);
      c.fillStyle = '#24150D';
      c.fillRect(588, ringY + 5, 24, 2);
    });

    // Antique Brass Height Adjustment Screw / Wingnut
    c.save();
    c.translate(614, 678);
    c.fillStyle = '#8C6D46';
    c.strokeStyle = '#5A4225';
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(0, 0, 4, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // Wingnut handles
    c.beginPath();
    c.ellipse(5, 0, 4, 2.2, 0.2, 0, Math.PI * 2);
    c.ellipse(-5, 0, 4, 2.2, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();

    // 2. Artisanal Tripod Cabriole Legs (Kaki Kayu Ukir Klasik)
    // Left Cabriole Leg
    c.lineWidth = 10;
    c.lineCap = 'round';
    c.strokeStyle = '#3A2415';
    c.beginPath();
    c.moveTo(595, pedestalY);
    c.bezierCurveTo(570, 795, 520, 825, 490, 846);
    c.stroke();

    // Left Brass Claw Slipper
    c.fillStyle = '#8C6D46';
    c.beginPath();
    c.ellipse(488, 847, 7, 4, -0.2, 0, Math.PI * 2);
    c.fill();

    // Right Cabriole Leg
    c.beginPath();
    c.moveTo(605, pedestalY);
    c.bezierCurveTo(630, 795, 680, 825, 710, 846);
    c.stroke();

    // Right Brass Claw Slipper
    c.fillStyle = '#8C6D46';
    c.beginPath();
    c.ellipse(712, 847, 7, 4, 0.2, 0, Math.PI * 2);
    c.fill();

    // Center Front Leg
    c.beginPath();
    c.moveTo(600, pedestalY);
    c.lineTo(600, 848);
    c.stroke();

    c.fillStyle = '#8C6D46';
    c.beginPath();
    c.ellipse(600, 849, 7, 4, 0, 0, Math.PI * 2);
    c.fill();

    // Turned Central Base Urn / Plinth Boss
    c.fillStyle = '#4E311D';
    c.beginPath();
    c.ellipse(600, pedestalY, 22, 10, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#24150D';
    c.lineWidth = 1.5;
    c.stroke();

    c.restore();
  }

  /**
   * ARTISANAL LOWER BODY & TRADITIONAL FOOTWEAR (KAKI & BUSANA BAWAH)
   * Kebaya: Kain Jarik Batik Sogan with central Wiron pleats, slender ankles & Selop Beludru Emas
   * Beskap: Bebet Jarik Keraton with Celana Panji & Selop Pria
   * Kemeja: Tailored formal trousers with pressed crease & polished dress shoes
   */
  function drawArtisanLowerBody(c, garment) {
    c.save();

    // 1. Floor cast shadows under shoes / selop (ambient spread + crisp contact occlusion)
    c.fillStyle = 'rgba(20, 14, 10, 0.22)';
    c.beginPath();
    c.ellipse(550, 838, 52, 13, -0.05, 0, Math.PI * 2);
    c.ellipse(650, 838, 52, 13, 0.05, 0, Math.PI * 2);
    c.fill();

    // Direct contact shadow beneath soles
    c.fillStyle = 'rgba(15, 10, 7, 0.42)';
    c.beginPath();
    c.ellipse(550, 834, 38, 7, -0.05, 0, Math.PI * 2);
    c.ellipse(650, 834, 38, 7, 0.05, 0, Math.PI * 2);
    c.fill();

    if (garment === 'kebaya') {
      // KAIN JARIK BATIK SOGAN (Batik wrap skirt down to ankles)
      const topY = 560; // Well above kebaya hem (610-630) so no seam gap
      const ankleY = 790;

      c.save();
      c.beginPath();
      c.moveTo(505, topY);
      c.lineTo(475, 625); // Slight hip curve
      c.bezierCurveTo(490, 690, 525, 750, 535, ankleY);
      c.quadraticCurveTo(600, 796, 665, ankleY);
      c.bezierCurveTo(675, 750, 710, 690, 725, 625);
      c.lineTo(695, topY);
      c.closePath();

      // Fabric Base (Mori ivory-sogan)
      c.fillStyle = '#EFE5D5';
      c.shadowColor = 'rgba(47, 28, 16, 0.2)';
      c.shadowBlur = 15;
      c.shadowOffsetY = 8;
      c.fill();
      c.shadowColor = 'transparent';

      // Clip inside Jarik for batik texture
      c.save();
      c.clip();

      // Diagonal Parang / Sogan folds pattern
      c.save();
      c.translate(600, 680);
      c.rotate(-Math.PI / 4);
      c.strokeStyle = 'rgba(78, 49, 29, 0.35)';
      c.lineWidth = 1.8;
      for (let x = -300; x <= 300; x += 28) {
        c.beginPath();
        c.moveTo(x, -300);
        c.lineTo(x, 300);
        c.stroke();

        // Small mlinjon / parang curves
        for (let y = -300; y <= 300; y += 28) {
          c.fillStyle = 'rgba(78, 49, 29, 0.18)';
          c.beginPath();
          c.arc(x + 14, y + 14, 3, 0, Math.PI * 2);
          c.fill();
        }
      }
      c.restore();

      // Front Center Wiron (Traditional vertical folded pleats)
      c.fillStyle = 'rgba(58, 36, 21, 0.12)';
      c.fillRect(592, topY, 26, ankleY - topY);

      c.strokeStyle = '#8C6D46';
      c.lineWidth = 2.2;
      [594, 604, 614].forEach(wx => {
        c.beginPath();
        c.moveTo(wx, topY);
        c.lineTo(wx, ankleY);
        c.stroke();
      });

      c.restore(); // Exit clip

      // Jarik Outline
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 3.5;
      c.stroke();

      // Ankles (Slender golden honey skin)
      c.fillStyle = '#E2BA96';
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 2.2;

      // Left ankle
      c.beginPath();
      c.roundRect(545, ankleY - 5, 20, 24, [0, 0, 4, 4]);
      c.fill();
      c.stroke();

      // Right ankle
      c.beginPath();
      c.roundRect(635, ankleY - 5, 20, 24, [0, 0, 4, 4]);
      c.fill();
      c.stroke();

      // Selop Tradisional Kebaya (Black velvet with gold flower)
      drawTradSelop(c, 545, 822, -1); // Left selop
      drawTradSelop(c, 655, 822, 1);  // Right selop

      c.restore();

    } else if (garment === 'beskap') {
      // BESKAP: BEBET JARIK & CELANA PANJI
      const topY = 560;
      const jarikHemY = 725;
      const ankleY = 808;

      // 1. Bebet Jarik (Half-length formal wrap)
      c.save();
      c.beginPath();
      c.moveTo(480, topY);
      c.lineTo(495, jarikHemY);
      c.lineTo(705, jarikHemY);
      c.lineTo(720, topY);
      c.closePath();

      c.fillStyle = '#E8DEC9';
      c.fill();

      // Jarik motif inside bebet
      c.save();
      c.clip();
      c.translate(600, 640);
      c.rotate(-Math.PI / 4);
      c.strokeStyle = 'rgba(78, 49, 29, 0.4)';
      c.lineWidth = 2;
      for (let x = -250; x <= 250; x += 26) {
        c.beginPath();
        c.moveTo(x, -250);
        c.lineTo(x, 250);
        c.stroke();
      }
      c.restore();

      // Central wiron fold
      c.strokeStyle = '#8C6D46';
      c.lineWidth = 2.2;
      c.beginPath();
      c.moveTo(600, topY);
      c.lineTo(600, jarikHemY);
      c.stroke();

      c.strokeStyle = '#2F1C10';
      c.lineWidth = 3.5;
      c.stroke();
      c.restore();

      // 2. Celana Panji Hitam (Formal dark pants emerging below jarik)
      c.fillStyle = '#1C1510';
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 3;

      // Left pant leg
      c.beginPath();
      c.moveTo(520, jarikHemY - 2);
      c.lineTo(530, ankleY);
      c.lineTo(570, ankleY);
      c.lineTo(560, jarikHemY - 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Right pant leg
      c.beginPath();
      c.moveTo(640, jarikHemY - 2);
      c.lineTo(630, ankleY);
      c.lineTo(670, ankleY);
      c.lineTo(680, jarikHemY - 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Selop Beskap Pria (Velvet with gold crest)
      drawTradSelopPria(c, 545, 822, -1);
      drawTradSelopPria(c, 655, 822, 1);

    } else {
      // KEMEJA: CELANA PANJANG FORMAL ARANG & SEPATU PANTOFEL
      const topY = 560;
      const ankleY = 808;

      c.save();
      c.fillStyle = '#1E1712'; // Deep espresso charcoal
      c.strokeStyle = '#2E2018';
      c.lineWidth = 3.2;

      // Full tailored trousers
      c.beginPath();
      c.moveTo(475, topY);
      c.lineTo(515, ankleY);
      c.lineTo(572, ankleY);
      c.lineTo(600, 650); // Crotch inseam
      c.lineTo(628, ankleY);
      c.lineTo(685, ankleY);
      c.lineTo(725, topY);
      c.closePath();
      c.fill();
      c.stroke();

      // Center pressed crease lines
      c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(543, topY + 40);
      c.lineTo(543, ankleY);
      c.moveTo(657, topY + 40);
      c.lineTo(657, ankleY);
      c.stroke();

      // Polished dress shoes
      drawDressShoes(c, 545, 822, -1);
      drawDressShoes(c, 655, 822, 1);

      c.restore();
    }

    c.restore();
  }

  /**
   * Helper: Traditional Women's Velvet Selop with gold embroidery
   */
  function drawTradSelop(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    // Sole & low kitten heel
    c.fillStyle = '#3A2415';
    c.beginPath();
    c.rect(-15, 6, 12, 6);
    c.fill();

    // Slipper upper (curved pointed toe)
    c.fillStyle = '#16110D';
    c.strokeStyle = '#2A1A10';
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(-16, 5);
    c.lineTo(-16, -4);
    c.quadraticCurveTo(5, -12, 34, 4);
    c.quadraticCurveTo(15, 9, -16, 6);
    c.closePath();
    c.fill();
    c.stroke();

    // Gold embroidered floral crest on vamp
    c.fillStyle = '#C5A572';
    c.beginPath();
    c.arc(8, -1, 3.5, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#8C6D46';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(8, -1, 5, 0, Math.PI * 2);
    c.stroke();

    c.restore();
  }

  /**
   * Helper: Traditional Men's Royal Velvet Selop
   */
  function drawTradSelopPria(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    // Heel
    c.fillStyle = '#2A1A10';
    c.beginPath();
    c.rect(-16, 5, 14, 5);
    c.fill();

    // Upper
    c.fillStyle = '#18120D';
    c.strokeStyle = '#2D1B11';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-18, 5);
    c.lineTo(-18, -3);
    c.quadraticCurveTo(8, -11, 36, 2);
    c.quadraticCurveTo(18, 8, -18, 6);
    c.closePath();
    c.fill();
    c.stroke();

    // Gold Royal Crest Bar
    c.fillStyle = '#8C6D46';
    c.fillRect(6, -2, 10, 3);

    c.restore();
  }

  /**
   * Helper: Polished Dress Leather Shoes
   */
  function drawDressShoes(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    // Stacked Heel
    c.fillStyle = '#1A120D';
    c.fillRect(-18, 5, 15, 6);

    // Shoe Body
    c.fillStyle = '#140E0A';
    c.strokeStyle = '#261810';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-18, 5);
    c.lineTo(-18, -4);
    c.quadraticCurveTo(10, -10, 38, 2);
    c.quadraticCurveTo(20, 8, -18, 6);
    c.closePath();
    c.fill();
    c.stroke();

    // Subtle leather gloss highlight
    c.fillStyle = 'rgba(255, 255, 255, 0.14)';
    c.beginPath();
    c.ellipse(12, -3, 10, 2.5, 0.2, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  /**
   * ARTISANAL ARMS & HANDS (TANGAN BUSANA LENGKAP)
   * Rendered with natural skin tones and arms naturally at sides
   */
  function drawArtisanHands(c, garment) {
    c.save();

    const skinBase = '#E2BA96';
    const outline = '#2D1B11';

    c.lineJoin = 'round';
    c.lineCap = 'round';

    // Cuff anchor coordinates for each garment
    let leftCuff = { x: 370, y: 422 };
    let rightCuff = { x: 830, y: 422 };

    if (garment === 'kebaya') {
      leftCuff = { x: 352, y: 470 };
      rightCuff = { x: 848, y: 470 };
    } else if (garment === 'beskap') {
      leftCuff = { x: 372, y: 427 };
      rightCuff = { x: 828, y: 427 };
    }

    c.save();
    c.fillStyle = skinBase;
    c.strokeStyle = outline;
    c.lineWidth = 2.4;

    // Left arm downwards
    c.beginPath();
    c.moveTo(leftCuff.x - 12, leftCuff.y);
    c.quadraticCurveTo(leftCuff.x - 18, 480, 335, 520); // Wrist outer
    c.lineTo(348, 522); // Wrist inner
    c.quadraticCurveTo(leftCuff.x + 10, 480, leftCuff.x + 12, leftCuff.y);
    c.closePath();
    c.fill();
    c.stroke();

    // Left hand at side
    drawNaturalHandSide(c, 340, 522, -1);

    // If Kebaya, draw Selendang Sampur draped over left arm!
    if (garment === 'kebaya') {
      drawKebayaSelendang(c, 338, 485);
    }

    // Right forearm extending downward
    c.beginPath();
    c.moveTo(rightCuff.x + 12, rightCuff.y);
    c.quadraticCurveTo(rightCuff.x + 18, 480, 865, 520); // Wrist outer
    c.lineTo(852, 522); // Wrist inner
    c.quadraticCurveTo(rightCuff.x - 10, 480, rightCuff.x - 12, rightCuff.y);
    c.closePath();
    c.fill();
    c.stroke();

    // Right hand at side
    drawNaturalHandSide(c, 860, 522, 1);
    c.restore();

    c.restore();
  }

  /**
   * Helper: Natural Hand at Side
   */
  function drawNaturalHandSide(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    c.fillStyle = '#E2BA96';
    c.strokeStyle = '#2D1B11';
    c.lineWidth = 2.2;

    // Palm base
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(12, 4);
    c.lineTo(10, 24);
    c.lineTo(-4, 20);
    c.closePath();
    c.fill();
    c.stroke();

    // Fingers curving down
    c.beginPath();
    c.moveTo(-2, 20);
    c.quadraticCurveTo(-4, 34, -1, 38);
    c.quadraticCurveTo(3, 40, 5, 36);
    c.lineTo(9, 23);
    c.fill();
    c.stroke();

    // Thumb softly in front
    c.beginPath();
    c.moveTo(4, 4);
    c.quadraticCurveTo(14, 10, 12, 18);
    c.stroke();

    c.restore();
  }

  /**
   * Helper: Draped Silk Batik Selendang / Sampur for Kebaya
   */
  function drawKebayaSelendang(c, x, y) {
    c.save();
    c.translate(x, y);

    // Flowing red Mengkudu silk sash
    c.fillStyle = '#9C2C28';
    c.strokeStyle = '#6E1F1C';
    c.lineWidth = 2;

    // Sash drape around forearm
    c.beginPath();
    c.ellipse(0, 0, 16, 7, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Hanging sash tails
    c.beginPath();
    c.moveTo(-10, 3);
    c.bezierCurveTo(-18, 60, -8, 120, -12, 180); // Front tail
    c.lineTo(2, 182);
    c.bezierCurveTo(6, 120, -2, 60, 4, 3);
    c.closePath();
    c.fill();
    c.stroke();

    // Gold fringe tassels at hem
    c.strokeStyle = '#C5A572';
    c.lineWidth = 1.5;
    [-10, -6, -2, 2].forEach(tx => {
      c.beginPath();
      c.moveTo(tx, 180);
      c.lineTo(tx, 192);
      c.stroke();
    });

    c.restore();
  }

  /**
   * Path geometry for each garment style (Kemeja, Kebaya, Beskap)
   */
  function defineGarmentPath(c, garment) {
    c.beginPath();

    if (garment === 'kebaya') {
      // Kebaya Kartini: Elegant V-neck, tapered waist, flared hip (Proportional size)
      c.moveTo(550, 242); // Left collar top
      c.lineTo(440, 268); // Left shoulder
      c.lineTo(330, 460); // Left long sleeve cuff outer
      c.lineTo(375, 480); // Left long sleeve cuff inner
      c.lineTo(460, 410); // Left armpit
      c.lineTo(485, 485); // Tapered left waist
      c.lineTo(450, 610); // Flared left hem
      c.quadraticCurveTo(600, 630, 750, 610); // Curved bottom hem
      c.lineTo(715, 485); // Tapered right waist
      c.lineTo(740, 410); // Right armpit
      c.lineTo(825, 480); // Right long sleeve cuff inner
      c.lineTo(870, 460); // Right long sleeve cuff outer
      c.lineTo(760, 268); // Right shoulder
      c.lineTo(650, 242); // Right collar top
      c.lineTo(600, 330); // Deep V-neck point
      c.closePath();

    } else if (garment === 'beskap') {
      // Beskap Keraton: High mandarin collar, straight formal cut (Proportional size)
      c.moveTo(545, 230); // Left high collar
      c.lineTo(435, 260); // Left shoulder
      c.lineTo(345, 415); // Left sleeve cuff outer
      c.lineTo(400, 440); // Left sleeve cuff inner
      c.lineTo(470, 395); // Left underarm
      c.lineTo(465, 580); // Left straight hem
      c.lineTo(735, 580); // Right straight hem
      c.lineTo(730, 395); // Right underarm
      c.lineTo(800, 440); // Right sleeve cuff inner
      c.lineTo(855, 415); // Right sleeve cuff outer
      c.lineTo(765, 260); // Right shoulder
      c.lineTo(655, 230); // Right high collar
      c.closePath();

    } else {
      // Default: Kemeja Batik Pria (Proportional compact shirt)
      c.moveTo(545, 235); // Left collar point
      c.lineTo(440, 260); // Left shoulder
      c.lineTo(345, 410); // Left sleeve outer
      c.lineTo(395, 435); // Left sleeve cuff
      c.lineTo(470, 395); // Left armpit
      c.lineTo(460, 580); // Left bottom hem
      c.quadraticCurveTo(600, 600, 740, 580); // Curved bottom hem
      c.lineTo(730, 395); // Right armpit
      c.lineTo(805, 435); // Right sleeve cuff
      c.lineTo(855, 410); // Right sleeve outer
      c.lineTo(760, 260); // Right shoulder
      c.lineTo(655, 235); // Right collar point
      c.quadraticCurveTo(600, 262, 545, 235); // Neck scooped collar line
      c.closePath();
    }
  }

  /**
   * Draw the garment filled with fabric base + pre-existing batik motif
   */
  function drawGarmentWithMotif(c, garment, motifId) {
    c.save();

    // 1. Fill base garment fabric color (Warm Mori Silk)
    defineGarmentPath(c, garment);
    c.fillStyle = '#F3ECE0';
    c.shadowColor = 'rgba(47, 28, 16, 0.25)';
    c.shadowBlur = 25;
    c.shadowOffsetY = 12;
    c.fill();
    c.shadowColor = 'transparent';

    // 2. Clip all motif drawing inside the Baju boundary!
    c.save();
    defineGarmentPath(c, garment);
    c.clip();

    // Draw the procedural motif pattern on the garment fabric
    if (motifId === 'parang') {
      drawParangOnGarment(c);
    } else if (motifId === 'kawung') {
      drawKawungOnGarment(c);
    } else if (motifId === 'buketan') {
      drawBuketanOnGarment(c);
    }

    c.restore(); // Exit clipping

    // 3. Draw Garment Seams, Outlines, Collar & Buttons
    drawGarmentTailoringDetails(c, garment);

    c.restore();
  }

  /**
   * Authentic Parang motif mapped across the garment
   */
  function drawParangOnGarment(c) {
    const w = baseCanvas.width;
    const h = baseCanvas.height;
    const step = 58;

    c.save();
    c.translate(w / 2, h / 2);
    c.rotate(-Math.PI / 4); // 45 degree diagonal slant

    c.strokeStyle = 'rgba(78, 49, 29, 0.45)';
    c.fillStyle = 'rgba(78, 49, 29, 0.12)';
    c.lineWidth = 2.2;

    const diag = Math.sqrt(w * w + h * h);
    for (let x = -diag; x < diag; x += step) {
      // Main parang line guide
      c.beginPath();
      c.moveTo(x, -diag);
      c.lineTo(x, diag);
      c.stroke();

      for (let y = -diag; y < diag; y += step * 0.85) {
        // Curved Parang Knife flame
        c.beginPath();
        c.moveTo(x, y);
        c.bezierCurveTo(x + 22, y - 11, x + 27, y + 20, x + 8, y + 33);
        c.bezierCurveTo(x + 2, y + 38, x - 8, y + 28, x, y);
        c.fill();
        c.stroke();

        // Small mlinjon diamond between bands
        c.beginPath();
        c.moveTo(x + step * 0.45, y + 14);
        c.lineTo(x + step * 0.45 + 6, y + 20);
        c.lineTo(x + step * 0.45, y + 26);
        c.lineTo(x + step * 0.45 - 6, y + 20);
        c.closePath();
        c.fill();
        c.stroke();
      }
    }
    c.restore();
  }

  /**
   * Authentic Kawung motif mapped across the garment
   */
  function drawKawungOnGarment(c) {
    const w = baseCanvas.width;
    const h = baseCanvas.height;
    const size = 62;

    c.save();
    c.strokeStyle = 'rgba(78, 49, 29, 0.42)';
    c.fillStyle = 'rgba(78, 49, 29, 0.08)';
    c.lineWidth = 2.0;

    for (let x = 240; x <= w - 240; x += size) {
      for (let y = 180; y <= 650; y += size) {
        c.save();
        c.translate(x, y);

        // Center cross
        c.beginPath();
        c.arc(0, 0, 3.8, 0, Math.PI * 2);
        c.stroke();

        // 4 intersecting petals
        for (let angle = 0; angle < 4; angle++) {
          c.rotate(Math.PI / 2);
          c.beginPath();
          c.ellipse(0, size * 0.32, size * 0.16, size * 0.28, 0, 0, Math.PI * 2);
          c.fill();
          c.stroke();

          // Cecek dots inside petal
          c.beginPath();
          c.arc(0, size * 0.28, 1.8, 0, Math.PI * 2);
          c.arc(0, size * 0.38, 1.8, 0, Math.PI * 2);
          c.fillStyle = 'rgba(78, 49, 29, 0.5)';
          c.fill();
          c.fillStyle = 'rgba(78, 49, 29, 0.08)';
        }
        c.restore();
      }
    }
    c.restore();
  }

  /**
   * Buketan Pekalongan motif mapped across the garment
   */
  function drawBuketanOnGarment(c) {
    const clusters = [
      { x: 540, y: 350, scale: 0.85 },
      { x: 660, y: 380, scale: 0.8 },
      { x: 600, y: 490, scale: 0.95 },
      { x: 420, y: 350, scale: 0.65 },
      { x: 780, y: 350, scale: 0.65 }
    ];

    c.save();
    c.strokeStyle = 'rgba(156, 44, 40, 0.55)'; // Coastal Mengkudu red accent
    c.lineWidth = 2.0;

    clusters.forEach(cl => {
      c.save();
      c.translate(cl.x, cl.y);
      c.scale(cl.scale, cl.scale);

      // Central flower
      c.beginPath();
      c.arc(0, 0, 14, 0, Math.PI * 2);
      c.stroke();

      for (let i = 0; i < 8; i++) {
        c.rotate(Math.PI / 4);
        c.beginPath();
        c.ellipse(0, 28, 12, 18, 0, 0, Math.PI * 2);
        c.stroke();
      }

      // Coastal tendrils
      c.beginPath();
      c.moveTo(0, 36);
      c.bezierCurveTo(40, 70, 70, 45, 95, 75);
      c.moveTo(0, -36);
      c.bezierCurveTo(-40, -70, -70, -50, -100, -80);
      c.stroke();

      c.restore();
    });

    c.restore();
  }

  /**
   * Tailoring details: collar, placket buttons, pocket, and seams
   */
  function drawGarmentTailoringDetails(c, garment) {
    c.save();
    c.strokeStyle = '#2F1C10';
    c.lineWidth = 4;
    c.lineJoin = 'round';
    c.lineCap = 'round';

    // 1. Draw outer garment outline
    defineGarmentPath(c, garment);
    c.stroke();

    if (garment === 'kebaya') {
      // Kebaya front edge & gold kerongsang brooches
      c.beginPath();
      c.moveTo(600, 330);
      c.lineTo(600, 625);
      c.stroke();

      // Brooches / Peniti susun
      [370, 420, 470, 520, 570].forEach(y => {
        c.fillStyle = '#8C6D46';
        c.beginPath();
        c.arc(600, y, 6, 0, Math.PI * 2);
        c.fill();
        c.stroke();
      });

    } else if (garment === 'beskap') {
      // Beskap Keraton asymmetric overlapping flap (Kancingan Serong)
      c.beginPath();
      c.moveTo(565, 230);
      c.lineTo(630, 290);
      c.lineTo(630, 580);
      c.stroke();

      // Brass buttons along the flap
      [285, 335, 385, 435, 485, 535].forEach(y => {
        c.fillStyle = '#8C6D46';
        c.beginPath();
        c.arc(630, y, 6, 0, Math.PI * 2);
        c.fill();
        c.stroke();
      });

    } else {
      // Kemeja Batik Pria
      // Collar Lapels
      c.beginPath();
      c.moveTo(545, 235);
      c.lineTo(580, 290);
      c.lineTo(600, 265);
      c.lineTo(620, 290);
      c.lineTo(655, 235);
      c.stroke();

      // Front Button Placket
      c.beginPath();
      c.moveTo(588, 265);
      c.lineTo(588, 592);
      c.moveTo(612, 265);
      c.lineTo(612, 592);
      c.stroke();

      // 5 traditional coconut-shell buttons
      [315, 370, 425, 480, 535].forEach(y => {
        c.fillStyle = '#4E311D';
        c.beginPath();
        c.arc(600, y, 5, 0, Math.PI * 2);
        c.fill();
        c.stroke();
      });

      // Left breast pocket
      c.beginPath();
      c.moveTo(480, 325);
      c.lineTo(530, 325);
      c.lineTo(530, 375);
      c.quadraticCurveTo(505, 388, 480, 375);
      c.closePath();
      c.stroke();

      // Sleeve cuff seams
      c.beginPath();
      c.moveTo(345, 410);
      c.lineTo(395, 435);
      c.moveTo(805, 435);
      c.lineTo(855, 410);
      c.stroke();
    }

    c.restore();
  }

  /**
   * FACE APERTURE FOR PHOTO BOOTH
   * Sits right on top of the collar: center (600, 160), oval (75 x 92)
   */
  function drawFaceInFrame(c) {
    const faceX = 600;
    const faceY = 160;
    const radiusX = 75;
    const radiusY = 92;

    c.save();

    // Define Head Oval Path
    c.beginPath();
    c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);

    // If Webcam is actively streaming OR user has uploaded a photo
    const hasLiveVideo = (state.cameraActive && videoEl && videoEl.readyState >= 2);
    const hasPhoto = (state.userFaceImg !== null);

    if (hasLiveVideo || hasPhoto) {
      c.save();
      c.clip(); // Clip video/photo strictly inside face oval

      // Fill background behind face
      c.fillStyle = '#000';
      c.fillRect(faceX - radiusX, faceY - radiusY, radiusX * 2, radiusY * 2);

      // Apply User Zoom & Pan adjustments
      c.translate(faceX + state.faceOffsetX, faceY + state.faceOffsetY);
      c.scale(state.faceScale, state.faceScale);

      if (hasLiveVideo && !state.photoCaptured) {
        // Mirror live selfie camera
        c.scale(-1, 1);
        const vw = videoEl.videoWidth || 640;
        const vh = videoEl.videoHeight || 480;
        const targetH = radiusY * 2.5;
        const targetW = (vw / vh) * targetH;
        c.drawImage(videoEl, -targetW / 2, -targetH / 2, targetW, targetH);

      } else if (hasPhoto) {
        // Draw user uploaded / frozen photo
        const img = state.userFaceImg;
        const targetH = radiusY * 2.5;
        const targetW = (img.width / img.height) * targetH;
        c.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      }

      c.restore();

      // Subtle inner shadow around collar neck joint
      c.save();
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);
      c.lineWidth = 4.5;
      c.strokeStyle = 'rgba(47, 28, 16, 0.4)';
      c.stroke();
      c.restore();

    } else {
      // ARTISANAL ATELIER PORTRAIT GUIDE (When camera is off)
      // Graceful fitting mannequin head with refined cultural camera aperture guide
      c.fillStyle = '#F5EFEB';
      c.fill();
      c.strokeStyle = '#2E1C12';
      c.lineWidth = 2.5;
      c.stroke();

      // Subtle jawline contour shading
      c.fillStyle = 'rgba(78, 49, 29, 0.05)';
      c.beginPath();
      c.ellipse(faceX, faceY + 45, radiusX * 0.65, 22, 0, 0, Math.PI);
      c.fill();

      // Minimalist portrait fitting mark (Aperture & Camera Icon)
      c.save();
      c.strokeStyle = 'rgba(140, 109, 70, 0.5)';
      c.lineWidth = 1.4;
      c.setLineDash([4, 4]);
      c.beginPath();
      c.ellipse(faceX, faceY - 5, 48, 56, 0, 0, Math.PI * 2);
      c.stroke();
      c.setLineDash([]);

      // Camera glyph
      c.translate(faceX, faceY - 8);
      c.strokeStyle = '#8C6D46';
      c.lineWidth = 1.8;
      c.beginPath();
      c.roundRect(-15, -9, 30, 20, 3);
      c.stroke();
      c.beginPath();
      c.arc(0, 1, 5, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.rect(-5, -13, 10, 4);
      c.stroke();
      c.restore();

      // Clean editorial prompt typography
      c.save();
      c.font = '600 11px Cinzel, "Playfair Display", Georgia, serif';
      c.fillStyle = '#4E311D';
      c.textAlign = 'center';
      c.fillText('PHOTO BOOTH', faceX, faceY + 28);
      c.font = 'italic 400 9.5px "Plus Jakarta Sans", sans-serif';
      c.fillStyle = '#8C6D46';
      c.fillText('Buka kamera untuk mencoba', faceX, faceY + 42);
      c.restore();
    }

    c.restore();
  }

  /**
   * AUTHENTIC JAVANESE BLANGKON KERATON HAT
   * Sits majestically on top of the head
   */
  function drawBlangkonHat(c) {
    const headX = 600;
    const hatY = 88;

    c.save();
    c.translate(headX, hatY);

    // 1. Hat Shadow
    c.shadowColor = 'rgba(35, 27, 21, 0.45)';
    c.shadowBlur = 10;
    c.shadowOffsetY = 5;

    // 2. Main Blangkon Cap Crown (Sogan batik fabric)
    c.fillStyle = '#4E311D';
    c.beginPath();
    c.ellipse(0, 0, 80, 30, 0, Math.PI, Math.PI * 2);
    c.quadraticCurveTo(70, 14, 0, 16);
    c.quadraticCurveTo(-70, 14, -80, 0);
    c.closePath();
    c.fill();

    // 3. Blangkon Front Overlap Fold (Wiron Blangkon)
    c.strokeStyle = '#8C6D46';
    c.lineWidth = 2.2;
    [-38, -20, -4, 12, 28].forEach(x => {
      c.beginPath();
      c.moveTo(x, -24);
      c.lineTo(x + 10, 14);
      c.stroke();
    });

    // 4. Forehead Band (Kemada)
    c.fillStyle = '#2F1C10';
    c.beginPath();
    c.moveTo(-80, 0);
    c.quadraticCurveTo(0, 18, 80, 0);
    c.quadraticCurveTo(0, 24, -80, 0);
    c.fill();

    // 5. Back Mondholan Bun (Khas Jogja / Solo) on the right side
    c.fillStyle = '#3A2415';
    c.beginPath();
    c.arc(65, 6, 12, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#8C6D46';
    c.stroke();

    c.restore();
  }

  /**
   * TRADITIONAL JAVANESE SANGGUL (KONDE JAWA & MELATI)
   * Elegant hair bun with roncean melati and gold cunduk mentul hairpins for Kebaya Kartini
   */
  function drawSanggulTradisional(c) {
    const headX = 600;
    const headY = 160;

    c.save();
    c.translate(headX, headY);

    // 1. Back Sanggul Bun Volume (Konde Ukel Klasik)
    c.fillStyle = '#18120E';
    c.beginPath();
    c.ellipse(0, -66, 84, 38, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Delicate hair texture lines (Sasak Halus)
    c.strokeStyle = '#2E221B';
    c.lineWidth = 1.4;
    [-60, -42, -24, 0, 24, 42, 60].forEach(ox => {
      c.beginPath();
      c.moveTo(ox, -60);
      c.quadraticCurveTo(ox * 0.6, -92, 0, -96);
      c.stroke();
    });

    // 3. Gold Cunduk Mentul Hairpins (Kembang Goyang Emas)
    drawCundukMentulPin(c, 0, -98, 0);
    drawCundukMentulPin(c, -36, -90, -0.25);
    drawCundukMentulPin(c, 36, -90, 0.25);

    // 4. Roncean Melati (Cascading white jasmine garland along the right contour)
    c.fillStyle = '#FAF7F2';
    c.strokeStyle = '#D5CBBA';
    c.lineWidth = 1;
    const jasmineDots = [
      { x: 54, y: -48, r: 4.5 },
      { x: 62, y: -35, r: 4.2 },
      { x: 68, y: -20, r: 4.0 },
      { x: 72, y: -4, r: 3.8 },
      { x: 74, y: 12, r: 3.5 },
      { x: 72, y: 28, r: 3.2 },
      { x: 68, y: 42, r: 3.0 },
      { x: 62, y: 56, r: 2.8 }
    ];
    jasmineDots.forEach(pt => {
      c.beginPath();
      c.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Tiny golden pollen center
      c.fillStyle = '#8C6D46';
      c.beginPath();
      c.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#FAF7F2';
    });

    c.restore();
  }

  /**
   * Helper: Gold Cunduk Mentul Pin
   */
  function drawCundukMentulPin(c, x, y, rot) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);

    // Golden pin stalk
    c.strokeStyle = '#C5A572';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 14);
    c.lineTo(0, -16);
    c.stroke();

    // Golden petal flower head
    c.fillStyle = '#C5A572';
    c.beginPath();
    c.arc(0, -16, 6, 0, Math.PI * 2);
    c.fill();

    c.strokeStyle = '#8C6D46';
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(0, -16, 8.5, 0, Math.PI * 2);
    c.stroke();

    c.restore();
  }

  /**
   * Headpiece Dispatcher (Blangkon Keraton for Kemeja/Beskap, Sanggul for Kebaya)
   */
  function drawHeadpiece(c, garment) {
    if (garment === 'kebaya') {
      drawSanggulTradisional(c);
    } else {
      drawBlangkonHat(c);
    }
  }

  /**
   * Sync UI labels between Blangkon Keraton and Sanggul Tradisional
   */
  function syncHeadpieceLabels() {
    const isKebaya = (state.activeGarment === 'kebaya');
    if (els.headpieceLabel) {
      els.headpieceLabel.textContent = isKebaya ? 'Sanggul Tradisional' : 'Blangkon Keraton';
    }
    if (els.blangkonBtnText) {
      els.blangkonBtnText.textContent = isKebaya ? 'Sanggul Jawa & Melati' : 'Blangkon Keraton';
    }
  }

  /* =====================================================================
     5. DRAWING & STAMPING ENGINE (CORET-CORET BAJU)
     ===================================================================== */
  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDrawing(e) {
    // If in photobooth mode and dragging near face, handle face repositioning
    if (state.mode === 'photobooth' && (state.cameraActive || state.userFaceImg)) {
      const coords = getCanvasCoords(e);
      const distFromFace = Math.hypot(coords.x - 600, coords.y - 165);
      if (distFromFace < 120) {
        state.isDraggingFace = true;
        state.dragStartX = coords.x - state.faceOffsetX;
        state.dragStartY = coords.y - state.faceOffsetY;
        return;
      }
    }

    const { x, y } = getCanvasCoords(e);

    if (state.activeTool === 'cap') {
      applyCapStamp(x, y);
      saveHistoryState();
      return;
    }

    // Canting Tulis (freehand wax doodling)
    state.isDrawing = true;
    state.lastX = x;
    state.lastY = y;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = state.activeColor;
    ctx.lineWidth = state.strokeWidth;
  }

  function drawMove(e) {
    // If dragging face in photobooth mode
    if (state.isDraggingFace) {
      const coords = getCanvasCoords(e);
      state.faceOffsetX = coords.x - state.dragStartX;
      state.faceOffsetY = coords.y - state.dragStartY;
      renderBaseBajuLayer();
      return;
    }

    if (!state.isDrawing) return;
    const { x, y } = getCanvasCoords(e);

    // Realistic wax stroke interpolation
    ctx.lineTo(x, y);
    ctx.stroke();

    state.lastX = x;
    state.lastY = y;
  }

  function stopDrawing() {
    if (state.isDraggingFace) {
      state.isDraggingFace = false;
      return;
    }

    if (!state.isDrawing) return;
    state.isDrawing = false;
    ctx.closePath();
    saveHistoryState();
  }

  /**
   * Apply Cap Batik Stamp onto the garment
   */
  function applyCapStamp(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = state.activeColor;
    ctx.fillStyle = state.activeColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const stamp = state.activeStamp;

    if (stamp === 'kawung') {
      // 4-petaled Kawung stamp
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.ellipse(0, 22, 10, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

    } else if (stamp === 'garuda') {
      // Sayap Gurda (Wings of Garuda)
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      [-1, 1].forEach(dir => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(dir * 25, -20, dir * 45, -5, dir * 40, 15);
        ctx.bezierCurveTo(dir * 30, 25, dir * 15, 10, 0, 0);
        ctx.stroke();
      });

    } else if (stamp === 'cecek') {
      // Cecek Pitu (Traditional 7-dot cluster)
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(rad) * 16, Math.sin(rad) * 16, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (stamp === 'melati') {
      // Melati Pekalongan (Jasmine flower stamp)
      for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, 18, 7, 12, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* =====================================================================
     6. UNDO, REDO & HISTORY ENGINE
     ===================================================================== */
  function saveHistoryState() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    state.undoStack.push(data);
    if (state.undoStack.length > state.maxHistory) {
      state.undoStack.shift();
    }
    state.redoStack = [];
    updateHistoryButtons();
  }

  function undo() {
    if (state.undoStack.length <= 1) return;
    const currentState = state.undoStack.pop();
    state.redoStack.push(currentState);
    const prevState = state.undoStack[state.undoStack.length - 1];
    ctx.putImageData(prevState, 0, 0);
    updateHistoryButtons();
  }

  function redo() {
    if (state.redoStack.length === 0) return;
    const nextState = state.redoStack.pop();
    state.undoStack.push(nextState);
    ctx.putImageData(nextState, 0, 0);
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    if (els.btnUndo) els.btnUndo.disabled = state.undoStack.length <= 1;
    if (els.btnRedo) els.btnRedo.disabled = state.redoStack.length === 0;
  }

  function clearCanvas() {
    if (confirm('Bersihkan coretan pada baju batik ini?')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveHistoryState();
    }
  }

  function resetMotifStencil() {
    if (confirm('Atur ulang pola dan bersihkan coretan pada baju?')) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderBaseBajuLayer();
      saveHistoryState();
    }
  }

  /* =====================================================================
     7. PHOTO BOOTH SYSTEM (WEBCAM & AUDIO EFFECTS)
     ===================================================================== */

  /**
   * Synthesize real mechanical camera shutter sound using Web Audio API
   */
  function playShutterSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;

      // 1. First click: Mirror slap
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(100, now + 0.05);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // 2. Second click: Shutter curtain close
      setTimeout(() => {
        const t2 = audioCtx.currentTime;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(550, t2);
        osc2.frequency.exponentialRampToValueAtTime(80, t2 + 0.07);
        gain2.gain.setValueAtTime(0.3, t2);
        gain2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.07);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(t2);
        osc2.stop(t2 + 0.07);
      }, 75);
    } catch (e) {
      console.log('AudioContext unavailable or muted');
    }
  }

  /**
   * Start live webcam stream
   */
  async function startWebcam() {
    try {
      if (state.webcamStream) {
        stopWebcam();
      }

      const constraints = {
        video: {
          facingMode: state.cameraFacing,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      state.webcamStream = stream;
      state.cameraActive = true;
      state.photoCaptured = false;

      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.play();
      }

      if (els.btnStartCamera) {
        els.btnStartCamera.innerHTML = `
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Kamera Aktif</span>
        `;
      }

      // Loop rendering webcam to base canvas
      runCameraPreviewLoop();

    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      alert('Tidak dapat mengakses kamera webcam. Anda tetap dapat menggunakan tombol "Unggah Foto Selfie" untuk mencoba baju ini!');
    }
  }

  function stopWebcam() {
    if (state.webcamStream) {
      state.webcamStream.getTracks().forEach(track => track.stop());
      state.webcamStream = null;
    }
    state.cameraActive = false;
    if (els.btnStartCamera) {
      els.btnStartCamera.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        <span>Buka Kamera</span>
      `;
    }
    renderBaseBajuLayer();
  }

  /**
   * Continuous RAF loop while camera is active to show live feed inside collar
   */
  function runCameraPreviewLoop() {
    if (!state.cameraActive || state.photoCaptured) return;
    renderBaseBajuLayer();
    requestAnimationFrame(runCameraPreviewLoop);
  }

  /**
   * Switch between front and rear cameras
   */
  function switchCameraFacing() {
    state.cameraFacing = (state.cameraFacing === 'user') ? 'environment' : 'user';
    if (state.cameraActive) {
      startWebcam();
    }
  }

  /**
   * Upload user selfie / face photo from gallery or file
   */
  function handleSelfieUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new Image();
      img.onload = () => {
        state.userFaceImg = img;
        state.photoCaptured = true;
        stopWebcam();
        renderBaseBajuLayer();
      };
      img.src = loadEvt.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * 3-Second Countdown & Photo Booth Snapshot Trigger
   */
  function triggerPhotoBoothSnapshot() {
    if (state.isCountingDown) return;
    state.isCountingDown = true;

    // Switch to photobooth mode visually
    if (state.mode !== 'photobooth') {
      switchMode('photobooth');
    }

    // Show countdown overlay
    if (els.countdownOverlay) {
      els.countdownOverlay.classList.add('show');
    }

    let count = 3;
    if (els.countdownNumber) els.countdownNumber.textContent = count;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        if (els.countdownNumber) els.countdownNumber.textContent = count;
      } else {
        clearInterval(interval);
        if (els.countdownNumber) els.countdownNumber.textContent = '📸';

        setTimeout(() => {
          // Play shutter sound & trigger flash
          playShutterSound();
          if (els.flashOverlay) {
            els.flashOverlay.classList.remove('flash-now');
            void els.flashOverlay.offsetWidth; // re-flow
            els.flashOverlay.classList.add('flash-now');
          }

          // Freeze current camera frame
          if (state.cameraActive && videoEl) {
            freezeCameraFrame();
          }

          if (els.countdownOverlay) {
            els.countdownOverlay.classList.remove('show');
          }
          state.isCountingDown = false;
        }, 400);
      }
    }, 1000);
  }

  /**
   * Freezes current live video frame into an image so user can wear it permanently
   */
  function freezeCameraFrame() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoEl.videoWidth || 640;
    tempCanvas.height = videoEl.videoHeight || 480;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.scale(-1, 1);
    tCtx.drawImage(videoEl, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);

    const frozenImg = new Image();
    frozenImg.onload = () => {
      state.userFaceImg = frozenImg;
      state.photoCaptured = true;
      stopWebcam();
      renderBaseBajuLayer();
    };
    frozenImg.src = tempCanvas.toDataURL('image/png');
  }

  /* =====================================================================
     8. COMPOSITED ARTWORK EXPORT & BACKEND INTEGRATION
     ===================================================================== */
  function getMergedCanvas() {
    const merged = document.createElement('canvas');
    merged.width = canvas.width;
    merged.height = canvas.height;
    const mCtx = merged.getContext('2d');

    // 1. Draw Base Baju (Fabric + Motifs + Stick Limbs + Face + Blangkon)
    mCtx.drawImage(baseCanvas, 0, 0);

    // 2. Draw Hand-painted Wax Lines / User Doodles
    mCtx.drawImage(canvas, 0, 0);

    return merged;
  }

  function downloadCurrentArtwork() {
    const merged = getMergedCanvas();
    const dataUrl = merged.toDataURL('image/png');
    const bg = BACKGROUNDS[state.activeBg]?.id || 'mori';
    const filename = `batik-${state.activeGarment}-${state.activeMotif}-${bg}-${Date.now()}.png`;
    downloadImage(dataUrl, filename);
  }

  function openSaveModal() {
    const mergedCanvas = getMergedCanvas();
    const dataUrl = mergedCanvas.toDataURL('image/png');

    if (els.previewThumb) {
      els.previewThumb.src = dataUrl;
    }

    if (els.inputPalet) {
      els.inputPalet.value = Array.from(state.usedColors).join(', ');
    }

    const g = GARMENTS[state.activeGarment]?.name || 'Busana Batik';
    const m = MOTIFS[state.activeMotif]?.name || 'Motif Tradisional';
    const bg = BACKGROUNDS[state.activeBg]?.name || 'Studio Mori';
    if (els.inputNamaKain && !els.inputNamaKain.value) {
      els.inputNamaKain.value = `${g} ${m} di ${bg}`;
    }

    if (els.inputFilosofi && !els.inputFilosofi.value) {
      els.inputFilosofi.value = `Kreasi busana ${g} berpadu motif ${m} dengan latar keindahan ${bg}. Menghadirkan sentuhan personal yang memadukan keanggunan warisan budaya Jawa Tengah dengan ekspresi modern.`;
    }

    if (els.saveModal) {
      els.saveModal.classList.add('is-open');
    }
  }

  function closeSaveModal() {
    if (els.saveModal) {
      els.saveModal.classList.remove('is-open');
    }
  }

  async function handleSaveSubmit(e) {
    e.preventDefault();

    const namaKain = els.inputNamaKain.value.trim();
    const filosofi = els.inputFilosofi.value.trim();
    const pembuat = els.inputPembuat.value.trim() || 'Pelancong Budaya';
    const palet = els.inputPalet.value.trim();
    const motif = els.inputMotif.value.trim();

    if (!namaKain || !filosofi) {
      alert('Mohon lengkapi Nama Busana dan Filosofi Karya batik Anda.');
      return;
    }

    const merged = getMergedCanvas();
    const base64Png = merged.toDataURL('image/png');

    if (els.btnSubmitSave) els.btnSubmitSave.disabled = true;
    if (els.saveSpinner) els.saveSpinner.classList.remove('hidden');

    const payload = {
      nama_kain: namaKain,
      filosofi_karya: filosofi,
      palet_warna: palet,
      motif: motif,
      pembuat: pembuat,
      gambar_base64: base64Png,
      is_publik: true
    };

    let savedRecord = null;

    try {
      // Send to Laravel API
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        savedRecord = json.data;
      }
    } catch (err) {
      console.warn('Backend API offline, saving to local gallery cache:', err);
    }

    // Client-side fallback
    if (!savedRecord) {
      savedRecord = {
        id: 'local_' + Date.now(),
        nama_kain: namaKain,
        filosofi_karya: filosofi,
        palet_warna: palet.split(',').map(s => s.trim()),
        motif: motif,
        pembuat: pembuat,
        file_gambar_url: base64Png,
        created_at: new Date().toISOString()
      };
    }

    saveToLocalCache(savedRecord);

    if (els.btnSubmitSave) els.btnSubmitSave.disabled = false;
    if (els.saveSpinner) els.saveSpinner.classList.add('hidden');
    closeSaveModal();

    alert('Karya foto busana batik Anda berhasil disimpan ke Pameran Virtual!');
    loadExhibitionGallery();

    const gallerySection = document.getElementById('pameran-virtual');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function saveToLocalCache(record) {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      existing.unshift(record);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing.slice(0, 30)));
    } catch (e) {
      console.warn('LocalStorage quota:', e);
    }
  }

  function getLocalCache() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function removeFromLocalCache(namaKain, id) {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const filtered = existing.filter(it => {
        if (id && it.id && it.id === id) return false;
        if (namaKain && it.nama_kain === namaKain) return false;
        return true;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  /* =====================================================================
     9. VIRTUAL EXHIBITION GALLERY (Pameran Kain Virtual)
     ===================================================================== */
  async function loadExhibitionGallery() {
    if (!els.galleryGrid) return;
    let items = [];

    try {
      const res = await fetch(API_ENDPOINT, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          items = json.data;
        }
      }
    } catch (e) {
      console.log('Loading exhibition from local cache...');
    }

    const localItems = getLocalCache();
    const mergedMap = new Map();

    localItems.forEach(item => mergedMap.set(item.nama_kain, item));
    items.forEach(item => {
      if (item.file_gambar_url && !item.file_gambar_url.startsWith('http') && !item.file_gambar_url.startsWith('data:')) {
        item.file_gambar_url = 'http://127.0.0.1:8000/' + item.file_gambar_url;
      }
      mergedMap.set(item.nama_kain, item);
    });

    state.galleryArtworks = Array.from(mergedMap.values());
    renderGalleryUI(state.galleryArtworks);
  }

  function renderGalleryUI(artworks) {
    if (!els.galleryGrid) return;
    els.galleryGrid.innerHTML = '';

    if (!artworks || artworks.length === 0) {
      if (els.galleryEmpty) els.galleryEmpty.classList.remove('hidden');
      return;
    }

    if (els.galleryEmpty) els.galleryEmpty.classList.add('hidden');

    artworks.forEach((art, idx) => {
      const card = document.createElement('div');
      card.className = 'sc-gallery-card flex flex-col justify-between relative group';

      const paletArray = Array.isArray(art.palet_warna)
        ? art.palet_warna
        : (art.palet_warna ? art.palet_warna.split(',') : []);

      card.innerHTML = `
        <div>
          <div class="relative overflow-hidden cursor-pointer" data-action="preview" data-idx="${idx}">
            <img src="${art.file_gambar_url}" alt="${art.nama_kain}" class="sc-gallery-img" loading="lazy" />
            <div class="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="px-3.5 py-1.5 text-xs font-semibold bg-[#FAF7F2] text-[#2F1C10] rounded-full shadow-lg">Lihat Busana</span>
            </div>
            <!-- Quick delete button on top-right -->
            <button type="button" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-800 text-white flex items-center justify-center transition-colors shadow-md z-10" data-action="delete" data-idx="${idx}" title="Hapus karya ini">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2F1C10] text-[#E5D8BE] border border-[#8C6D46]/40">
                ${art.motif || 'Batik Klasik'}
              </span>
              <span class="text-[11px] text-[#E5D8BE]/70">
                ${formatDate(art.created_at)}
              </span>
            </div>
            <h4 class="text-base font-serif font-bold text-[#FAF7F2] leading-tight mb-1">
              ${art.nama_kain}
            </h4>
            <p class="text-xs text-[#E5D8BE] font-medium mb-2">
              Karya: ${art.pembuat || 'Pelancong Budaya'}
            </p>
            <p class="text-xs text-[#E5D8BE]/80 line-clamp-2 leading-relaxed mb-3">
              ${art.filosofi_karya}
            </p>
            <div class="flex flex-wrap gap-1 mb-2">
              ${paletArray.slice(0, 3).map(p => `
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#20140c] text-[#E5D8BE]/90 border border-white/10">
                  ${p.trim()}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="px-3.5 pb-3.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5">
          <button type="button" class="text-xs text-[#E5D8BE] hover:text-white font-medium flex items-center gap-1 transition-colors" data-action="preview" data-idx="${idx}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <span>Pratinjau</span>
          </button>
          <div class="flex items-center gap-1.5">
            <button type="button" class="text-xs text-red-300 hover:text-white hover:bg-red-950/70 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-red-700/35" data-action="delete" data-idx="${idx}" title="Hapus karya ini dari galeri">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Hapus</span>
            </button>
            <button type="button" class="text-xs bg-[#4E311D] hover:bg-[#6B4423] text-[#FAF7F2] px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 border border-[#8C6D46]/40" data-action="download" data-idx="${idx}">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Unduh</span>
            </button>
          </div>
        </div>
      `;

      els.galleryGrid.appendChild(card);
    });
  }

  async function deleteArtwork(idx) {
    const item = state.galleryArtworks[idx];
    if (!item) return;

    const confirmMsg = `Hapus karya busana "${item.nama_kain}" dari Pameran Virtual?`;
    if (!confirm(confirmMsg)) return;

    if (item.id) {
      try {
        await fetch(`${API_ENDPOINT}/${item.id}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        });
      } catch (err) {
        console.warn('API delete error:', err);
      }
    }

    removeFromLocalCache(item.nama_kain, item.id);
    closeDetailModal();
    await loadExhibitionGallery();
  }

  async function clearAllGallery() {
    if (!state.galleryArtworks || state.galleryArtworks.length === 0) {
      alert('Pameran galeri saat ini sudah kosong.');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus SEMUA karya busana di Pameran Virtual?')) {
      return;
    }

    for (const item of state.galleryArtworks) {
      if (item.id) {
        try {
          await fetch(`${API_ENDPOINT}/${item.id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
          });
        } catch (e) {
          console.warn('API error deleting item:', e);
        }
      }
    }

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }

    closeDetailModal();
    await loadExhibitionGallery();
  }

  function openDetailModal(idx) {
    const art = state.galleryArtworks[idx];
    if (!art) return;

    if (els.detailImg) els.detailImg.src = art.file_gambar_url;
    if (els.detailTitle) els.detailTitle.textContent = art.nama_kain;
    if (els.detailAuthor) els.detailAuthor.textContent = `Pengrajin: ${art.pembuat || 'Pengrajin Lelana'}`;
    if (els.detailPhilosophy) els.detailPhilosophy.textContent = art.filosofi_karya;
    if (els.detailDate) els.detailDate.textContent = `Dibuat pada: ${formatDate(art.created_at)}`;

    if (els.detailPalette) {
      const arr = Array.isArray(art.palet_warna) ? art.palet_warna : (art.palet_warna ? art.palet_warna.split(',') : []);
      els.detailPalette.innerHTML = arr.map(c => `
        <span class="px-2.5 py-1 text-xs rounded-full bg-[#2F1C10] border border-[#8C6D46]/40 text-[#FAF7F2]">
          ${c.trim()}
        </span>
      `).join('');
    }

    if (els.btnDownloadArtwork) {
      els.btnDownloadArtwork.onclick = () => downloadImage(art.file_gambar_url, art.nama_kain);
    }

    if (els.btnDeleteArtwork) {
      els.btnDeleteArtwork.onclick = () => deleteArtwork(idx);
    }

    if (els.previewModal) {
      els.previewModal.classList.add('is-open');
    }
  }

  function closeDetailModal() {
    if (els.previewModal) {
      els.previewModal.classList.remove('is-open');
    }
  }

  function downloadImage(url, title) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-lelana-jateng.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function formatDate(isoStr) {
    if (!isoStr) return 'Hari ini';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'Hari ini';
    }
  }

  /* =====================================================================
     10. MODE SWITCHER & EVENT BINDINGS
     ===================================================================== */
  function switchMode(newMode) {
    state.mode = newMode;
    if (newMode === 'photobooth') {
      if (els.tabModePhoto) els.tabModePhoto.classList.add('active');
      if (els.tabModeDoodle) els.tabModeDoodle.classList.remove('active');
      if (els.photoBoothPanel) els.photoBoothPanel.classList.remove('hidden');
    } else {
      if (els.tabModeDoodle) els.tabModeDoodle.classList.add('active');
      if (els.tabModePhoto) els.tabModePhoto.classList.remove('active');
      if (els.photoBoothPanel) els.photoBoothPanel.classList.add('hidden');
    }
  }

  function bindEvents() {
    // Canvas pointer events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', drawMove);
    window.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      drawMove(e);
    }, { passive: false });

    window.addEventListener('touchend', stopDrawing);

    // Mode Switcher Tabs
    if (els.tabModeDoodle) {
      els.tabModeDoodle.addEventListener('click', () => switchMode('doodle'));
    }
    if (els.tabModePhoto) {
      els.tabModePhoto.addEventListener('click', () => {
        switchMode('photobooth');
        if (!state.cameraActive && !state.userFaceImg) {
          startWebcam();
        }
      });
    }

    // Garment Selection Buttons (Kemeja, Kebaya, Beskap)
    document.querySelectorAll('[data-garment]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-garment]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeGarment = btn.getAttribute('data-garment');
        syncHeadpieceLabels();
        renderBaseBajuLayer();
      });
    });

    // Motif Selection Buttons (Parang, Kawung, Buketan, Polos)
    document.querySelectorAll('[data-motif]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-motif]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeMotif = btn.getAttribute('data-motif');
        renderBaseBajuLayer();
      });
    });

    // Background Selection Buttons (Mori, Borobudur, Prambanan, Dieng, etc.)
    document.querySelectorAll('[data-bg]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-bg]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeBg = btn.getAttribute('data-bg');

        const bg = BACKGROUNDS[state.activeBg];
        if (bg && bg.src && (!bgImagesCache[state.activeBg] || !bgImagesCache[state.activeBg].complete)) {
          const img = new Image();
          img.onload = () => {
            bgImagesCache[state.activeBg] = img;
            renderBaseBajuLayer();
          };
          img.src = bg.src;
        }

        renderBaseBajuLayer();
      });
    });

    // Tangan & Kaki (Figur Busana Lengkap) Toggle
    if (els.btnToggleLimbs) {
      els.btnToggleLimbs.addEventListener('click', () => {
        state.showBodyLimbs = !state.showBodyLimbs;
        els.btnToggleLimbs.classList.toggle('active', state.showBodyLimbs);
        if (els.poseSelectorPanel) {
          els.poseSelectorPanel.classList.toggle('hidden', !state.showBodyLimbs);
        }
        renderBaseBajuLayer();
      });
    }

    // Pose Buttons (Ngapurancang, Santai, Salam)
    document.querySelectorAll('[data-limb-pose]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-limb-pose]').forEach(b => {
          b.classList.remove('active', 'bg-[#4e311d]', 'text-white', 'font-bold');
          b.classList.add('text-[#e5d8be]', 'hover:bg-white/10');
        });
        btn.classList.add('active', 'bg-[#4e311d]', 'text-white', 'font-bold');
        btn.classList.remove('text-[#e5d8be]', 'hover:bg-white/10');
        state.activeLimbPose = btn.getAttribute('data-limb-pose');
        renderBaseBajuLayer();
      });
    });

    // Atelier Mannequin Stand Toggle
    if (els.btnToggleMannequin) {
      els.btnToggleMannequin.addEventListener('click', () => {
        state.showMannequinStand = !state.showMannequinStand;
        els.btnToggleMannequin.classList.toggle('active', state.showMannequinStand);
        renderBaseBajuLayer();
      });
    }

    // Atelier Traditional Headpiece Toggle
    if (els.btnToggleHeadpiece) {
      els.btnToggleHeadpiece.addEventListener('click', () => {
        state.showHeadpiece = !state.showHeadpiece;
        state.showBlangkon = state.showHeadpiece;
        els.btnToggleHeadpiece.classList.toggle('active', state.showHeadpiece);
        if (els.btnToggleBlangkon) {
          els.btnToggleBlangkon.classList.toggle('active', state.showHeadpiece);
        }
        renderBaseBajuLayer();
      });
    }

    // Tool Toggles: Canting vs Cap
    if (els.btnCanting) {
      els.btnCanting.addEventListener('click', () => {
        state.activeTool = 'canting';
        els.btnCanting.classList.add('active');
        els.btnCap.classList.remove('active');
        els.stampSelector.classList.add('hidden');
        els.canvasWrapper.className = 'sc-mori-canvas-wrapper sc-cursor-canting';
      });
    }

    if (els.btnCap) {
      els.btnCap.addEventListener('click', () => {
        state.activeTool = 'cap';
        els.btnCap.classList.add('active');
        els.btnCanting.classList.remove('active');
        els.stampSelector.classList.remove('hidden');
        els.canvasWrapper.className = 'sc-mori-canvas-wrapper sc-cursor-cap';
      });
    }

    // Color Swatches (strictly non-yellow)
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeColor = btn.getAttribute('data-color');
        state.activeColorName = btn.getAttribute('data-name');
        state.usedColors.add(state.activeColorName);

        if (els.colorReadout) {
          els.colorReadout.textContent = state.activeColorName;
        }
      });
    });

    // Stroke Width Buttons
    document.querySelectorAll('[data-stroke]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-stroke]').forEach(b => b.classList.remove('active', 'bg-[#4E311D]', 'text-white'));
        btn.classList.add('active', 'bg-[#4E311D]', 'text-white');
        state.strokeWidth = parseInt(btn.getAttribute('data-stroke'), 10);
      });
    });

    // Stamp Selection Buttons
    document.querySelectorAll('[data-stamp]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-stamp]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeStamp = btn.getAttribute('data-stamp');
      });
    });

    // Photo Booth Controls
    if (els.btnStartCamera) {
      els.btnStartCamera.addEventListener('click', () => {
        if (state.cameraActive) {
          stopWebcam();
        } else {
          startWebcam();
        }
      });
    }

    if (els.btnSwitchCamera) {
      els.btnSwitchCamera.addEventListener('click', switchCameraFacing);
    }

    if (els.btnUploadSelfie && selfieInput) {
      els.btnUploadSelfie.addEventListener('click', () => selfieInput.click());
      selfieInput.addEventListener('change', handleSelfieUpload);
    }

    if (els.faceZoomSlider) {
      els.faceZoomSlider.addEventListener('input', (e) => {
        state.faceScale = parseFloat(e.target.value);
        renderBaseBajuLayer();
      });
    }

    if (els.btnToggleBlangkon) {
      els.btnToggleBlangkon.addEventListener('click', () => {
        state.showHeadpiece = !state.showHeadpiece;
        state.showBlangkon = state.showHeadpiece;
        els.btnToggleBlangkon.classList.toggle('active', state.showHeadpiece);
        if (els.btnToggleHeadpiece) {
          els.btnToggleHeadpiece.classList.toggle('active', state.showHeadpiece);
        }
        renderBaseBajuLayer();
      });
    }

    if (els.btnResetFacePos) {
      els.btnResetFacePos.addEventListener('click', () => {
        state.faceOffsetX = 0;
        state.faceOffsetY = 0;
        state.faceScale = 1.0;
        if (els.faceZoomSlider) els.faceZoomSlider.value = 1.0;
        renderBaseBajuLayer();
      });
    }

    // Photo Snapshot Trigger Button
    if (els.btnSnapPhoto) {
      els.btnSnapPhoto.addEventListener('click', triggerPhotoBoothSnapshot);
    }

    // Canvas History & Reset
    if (els.btnUndo) els.btnUndo.addEventListener('click', undo);
    if (els.btnRedo) els.btnRedo.addEventListener('click', redo);
    if (els.btnClear) els.btnClear.addEventListener('click', clearCanvas);
    if (els.btnResetMotif) els.btnResetMotif.addEventListener('click', resetMotifStencil);

    // Save & Quick Download
    if (els.btnSave) els.btnSave.addEventListener('click', openSaveModal);
    if (els.btnQuickDownload) els.btnQuickDownload.addEventListener('click', downloadCurrentArtwork);
    if (els.btnCancelSave) els.btnCancelSave.addEventListener('click', closeSaveModal);
    if (els.saveForm) els.saveForm.addEventListener('submit', handleSaveSubmit);

    // Gallery Actions
    if (els.btnRefreshGallery) els.btnRefreshGallery.addEventListener('click', loadExhibitionGallery);
    if (els.btnClearAllGallery) els.btnClearAllGallery.addEventListener('click', clearAllGallery);
    if (els.btnCloseDetail) els.btnCloseDetail.addEventListener('click', closeDetailModal);

    if (els.galleryGrid) {
      els.galleryGrid.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-action]');
        if (!targetBtn) return;
        const action = targetBtn.getAttribute('data-action');
        const idx = parseInt(targetBtn.getAttribute('data-idx'), 10);
        if (isNaN(idx)) return;

        if (action === 'delete') {
          e.stopPropagation();
          deleteArtwork(idx);
        } else if (action === 'preview') {
          openDetailModal(idx);
        } else if (action === 'download') {
          const item = state.galleryArtworks[idx];
          if (item) downloadImage(item.file_gambar_url, item.nama_kain);
        }
      });
    }

    // Modal Backdrop Dismiss
    if (els.saveModal) {
      els.saveModal.addEventListener('click', (e) => {
        if (e.target === els.saveModal) closeSaveModal();
      });
    }
    if (els.previewModal) {
      els.previewModal.addEventListener('click', (e) => {
        if (e.target === els.previewModal) closeDetailModal();
      });
    }

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');
    if (mobileNavToggle && mobileNavDropdown) {
      mobileNavToggle.addEventListener('click', () => {
        const isHidden = mobileNavDropdown.classList.contains('hidden');
        if (isHidden) {
          mobileNavDropdown.classList.remove('hidden');
          mobileNavToggle.setAttribute('aria-expanded', 'true');
        } else {
          mobileNavDropdown.classList.add('hidden');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
      });

      mobileNavDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNavDropdown.classList.add('hidden');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Keyboard Shortcuts (Undo/Redo & Escape to close modals)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key === 'Escape') {
        if (els.saveModal && els.saveModal.classList.contains('is-open')) {
          closeSaveModal();
        }
        if (els.previewModal && els.previewModal.classList.contains('is-open')) {
          closeDetailModal();
        }
      }
    });
  }

})();
