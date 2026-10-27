/**
 * Lelana Jateng: Studio Canting & Photo Booth Baju Batik
 * Pure Vanilla JavaScript (HTML5 Canvas, Camera Stream & Supabase BaaS Cloud Sync)
 * Colors: Mori Ivory, Sogan Dark, Indigo, Terracotta, Bronze, Jelaga (NO YELLOW)
 */

(() => {
  'use strict';

  /* =====================================================================
     1. CONSTANTS & CULTURAL DATASETS
     ===================================================================== */
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

  // Tourist Destination & Atelier Scenic Backgrounds
  const BACKGROUNDS = {
    joglo: {
      id: 'joglo',
      name: 'Pendopo Atelier Joglo',
      desc: 'Atelier Klasik Kayu Jati & Gebyok Keraton',
      location: 'Yogyakarta, Jawa Tengah',
      src: 'assets/bg-joglo.jpg'
    },
    mori: {
      id: 'mori',
      name: 'Studio Mori Alami',
      desc: 'Kain Tenun Mori Polos Atelier',
      location: 'Atelier Lelana Jateng',
      src: 'assets/bg-mori.jpg'
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
    activeBg: 'joglo', // 'joglo', 'mori', 'borobudur', 'prambanan', 'dieng', 'karimunjawa', 'grojogan', 'keraton', 'lawangsewu'
    showBodyLimbs: true, // Hands & feet / complete body figure
    activeLimbPose: 'ngapurancang', // 'ngapurancang' (clasped royal hands in dignified court posture)
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
    updateSupabaseBadge();
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

    // Supabase Configuration & Status DOM
    els.btnSupabaseConfig = document.getElementById('scBtnSupabaseConfig');
    els.supabaseStatusDot = document.getElementById('scSupabaseStatusDot');
    els.supabaseStatusText = document.getElementById('scSupabaseStatusText');
    els.supabaseModal = document.getElementById('scSupabaseModal');
    els.btnCloseSupabaseModal = document.getElementById('scBtnCloseSupabaseModal');
    els.supabaseConfigForm = document.getElementById('scSupabaseConfigForm');
    els.inputSupabaseUrl = document.getElementById('scInputSupabaseUrl');
    els.inputSupabaseKey = document.getElementById('scInputSupabaseKey');
    els.btnToggleKeyVisibility = document.getElementById('scBtnToggleKeyVisibility');
    els.btnResetSupabase = document.getElementById('scBtnResetSupabase');
    els.supabaseTestResult = document.getElementById('scSupabaseTestResult');
    els.supabaseSaveSpinner = document.getElementById('scSupabaseSaveSpinner');
    els.supabaseBannerDot = document.getElementById('scSupabaseBannerDot');
    els.supabaseBannerTitle = document.getElementById('scSupabaseBannerTitle');
    els.supabaseBannerDesc = document.getElementById('scSupabaseBannerDesc');
    els.btnOpenSqlSchema = document.getElementById('scBtnOpenSqlSchema');
    els.supabaseSqlModal = document.getElementById('scSupabaseSqlModal');
    els.btnCloseSqlModal = document.getElementById('scBtnCloseSqlModal');
    els.sqlSchemaCode = document.getElementById('scSqlSchemaCode');
    els.btnCopySql = document.getElementById('scBtnCopySql');
    els.copySqlSuccess = document.getElementById('scCopySqlSuccess');

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

    // 2b. Draw Anatomical Neck & Upper Clavicle (so garment collar wraps around it cleanly)
    drawAnatomicalNeck(baseCtx, state.activeGarment);

    // 3. Draw Baju Silhouette with Pre-existing Motif
    drawGarmentWithMotif(baseCtx, state.activeGarment, state.activeMotif);

    // 4. Draw Arms & Hands with natural anatomical posture (when Tangan & Kaki active)
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
    const bg = BACKGROUNDS[state.activeBg] || BACKGROUNDS.joglo;

    if (els.motifName) els.motifName.textContent = `${g.name} • ${m.name}`;
    if (els.motifDesc) els.motifDesc.textContent = `${g.desc} Dipadukan filosofi ${m.name}: ${m.philosophy}. Berlatar di ${bg.name} (${bg.location}).`;
    if (els.motifBadge) els.motifBadge.textContent = `${g.tag} • ${m.tag} • ${bg.name}`;
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
    const bgKey = state.activeBg || 'joglo';
    const bgData = BACKGROUNDS[bgKey] || BACKGROUNDS.joglo;
    const cachedImg = bgImagesCache[bgKey];

    if (!cachedImg || !cachedImg.complete || cachedImg.naturalWidth === 0) {
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

    // Bespoke Museum Atelier Seal Stamp in bottom corner
    c.save();
    const stampX = 40;
    const stampY = h - 68;
    const stampW = 280;
    const stampH = 46;

    // Plaque backdrop with subtle blur
    c.fillStyle = 'rgba(18, 12, 8, 0.65)';
    c.beginPath();
    c.roundRect(stampX, stampY, stampW, stampH, 8);
    c.fill();
    c.strokeStyle = 'rgba(197, 165, 114, 0.45)';
    c.lineWidth = 1;
    c.stroke();

    // Small Gold Cultural Diamond Mark
    c.fillStyle = '#C5A572';
    c.beginPath();
    c.moveTo(stampX + 16, stampY + 16);
    c.lineTo(stampX + 22, stampY + 23);
    c.lineTo(stampX + 16, stampY + 30);
    c.lineTo(stampX + 10, stampY + 23);
    c.closePath();
    c.fill();

    // Typography
    c.font = '600 12px "Newsreader", Georgia, serif';
    c.fillStyle = '#FAF7F2';
    c.fillText(bgData.name.toUpperCase(), stampX + 32, stampY + 20);

    c.font = 'italic 400 10.5px "Plus Jakarta Sans", sans-serif';
    c.fillStyle = '#E5D8BE';
    c.fillText(bgData.location, stampX + 32, stampY + 36);

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
   * ANATOMICAL ATELIER NECK & THROAT
   * Seamlessly connects the chin (Y=240-248) to the garment collar base (Y=275).
   * Features realistic skin gradient, throat shadow, subtle clavicles, and suprasternal notch.
   */
  function drawAnatomicalNeck(c, garment) {
    c.save();

    const skinTone = '#E4BD9A';
    const neckTopY = 220;
    const neckBottomY = 278;

    // 1. Neck Base Shape
    c.beginPath();
    c.moveTo(566, neckTopY);
    c.bezierCurveTo(564, 242, 558, 260, 554, neckBottomY);
    c.lineTo(646, neckBottomY);
    c.bezierCurveTo(642, 260, 636, 242, 634, neckTopY);
    c.closePath();

    // Natural skin gradient (cylindrical volume lighting)
    const neckGrad = c.createLinearGradient(554, 0, 646, 0);
    neckGrad.addColorStop(0, '#D4A680');
    neckGrad.addColorStop(0.25, skinTone);
    neckGrad.addColorStop(0.5, '#EAD1B6');
    neckGrad.addColorStop(0.75, skinTone);
    neckGrad.addColorStop(1, '#D4A680');
    c.fillStyle = neckGrad;
    c.fill();

    // 2. Throat Shadow under the Chin
    const throatShadow = c.createLinearGradient(600, neckTopY, 600, neckTopY + 36);
    throatShadow.addColorStop(0, 'rgba(68, 42, 23, 0.28)');
    throatShadow.addColorStop(0.55, 'rgba(68, 42, 23, 0.12)');
    throatShadow.addColorStop(1, 'transparent');
    c.fillStyle = throatShadow;
    c.beginPath();
    c.ellipse(600, neckTopY + 14, 38, 18, 0, 0, Math.PI * 2);
    c.fill();

    // 3. Delicate Sternocleidomastoid & Suprasternal Notch Contours
    c.strokeStyle = 'rgba(105, 68, 40, 0.16)';
    c.lineWidth = 1.6;
    c.lineCap = 'round';

    // Left neck tendon
    c.beginPath();
    c.moveTo(574, 235);
    c.quadraticCurveTo(584, 255, 595, 272);
    c.stroke();

    // Right neck tendon
    c.beginPath();
    c.moveTo(626, 235);
    c.quadraticCurveTo(616, 255, 605, 272);
    c.stroke();

    // Suprasternal notch (pit of the neck)
    c.strokeStyle = 'rgba(105, 68, 40, 0.22)';
    c.lineWidth = 1.4;
    c.beginPath();
    c.arc(600, 268, 5, 0.2 * Math.PI, 0.8 * Math.PI);
    c.stroke();

    // Clavicle bone hints (collar bones)
    c.strokeStyle = 'rgba(105, 68, 40, 0.14)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(593, 272);
    c.quadraticCurveTo(565, 275, 530, 278);
    c.moveTo(607, 272);
    c.quadraticCurveTo(635, 275, 670, 278);
    c.stroke();

    // Subtle outer neck boundary contour
    c.strokeStyle = 'rgba(68, 42, 23, 0.35)';
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(566, neckTopY);
    c.bezierCurveTo(564, 242, 558, 260, 554, neckBottomY);
    c.moveTo(634, neckTopY);
    c.bezierCurveTo(642, 260, 636, 242, 646, neckBottomY);
    c.stroke();

    c.restore();
  }

  /**
   * ARTISANAL LOWER BODY & TRADITIONAL FOOTWEAR (KAKI & BUSANA BAWAH)
   * Kebaya: Kain Jarik Batik Sogan with central Wiron pleats, slender ankles & Selop Beludru Emas
   * Beskap: Bebet Jarik Keraton with Celana Panji & Selop Pria
   * Kemeja: Bespoke tailored formal trousers with pressed crease & polished Oxford dress shoes
   */
  function drawArtisanLowerBody(c, garment) {
    c.save();

    // 1. Floor cast shadows under shoes / selop (ambient spread + crisp contact occlusion)
    c.fillStyle = 'rgba(20, 14, 10, 0.20)';
    c.beginPath();
    c.ellipse(545, 836, 48, 12, -0.05, 0, Math.PI * 2);
    c.ellipse(655, 836, 48, 12, 0.05, 0, Math.PI * 2);
    c.fill();

    // Direct contact shadow beneath soles
    c.fillStyle = 'rgba(15, 10, 7, 0.45)';
    c.beginPath();
    c.ellipse(545, 832, 34, 6, -0.05, 0, Math.PI * 2);
    c.ellipse(655, 832, 34, 6, 0.05, 0, Math.PI * 2);
    c.fill();

    if (garment === 'kebaya') {
      // KAIN JARIK BATIK SOGAN (Batik wrap skirt down to ankles)
      const topY = 560; // Well above kebaya hem (610-630) so no seam gap
      const ankleY = 792;

      c.save();
      c.beginPath();
      c.moveTo(502, topY);
      c.bezierCurveTo(480, 620, 492, 690, 532, ankleY);
      c.quadraticCurveTo(600, 798, 668, ankleY);
      c.bezierCurveTo(708, 690, 720, 620, 698, topY);
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
      c.fillRect(590, topY, 28, ankleY - topY);

      c.strokeStyle = '#8C6D46';
      c.lineWidth = 2.2;
      [592, 602, 612].forEach(wx => {
        c.beginPath();
        c.moveTo(wx, topY);
        c.lineTo(wx, ankleY);
        c.stroke();
      });

      // Gold Seret edge border
      c.strokeStyle = '#D4AF37';
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(618, topY);
      c.lineTo(618, ankleY);
      c.stroke();

      c.restore(); // Exit clip

      // Jarik Outline
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 3.2;
      c.stroke();

      // Ankles (Slender golden honey skin)
      c.fillStyle = '#E2BA96';
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 2.0;

      // Left ankle
      c.beginPath();
      c.roundRect(545, ankleY - 4, 18, 26, [0, 0, 4, 4]);
      c.fill();
      c.stroke();

      // Right ankle
      c.beginPath();
      c.roundRect(637, ankleY - 4, 18, 26, [0, 0, 4, 4]);
      c.fill();
      c.stroke();

      // Selop Tradisional Kebaya (Black velvet with gold flower)
      drawTradSelop(c, 545, 822, -1);
      drawTradSelop(c, 655, 822, 1);

      c.restore();

    } else if (garment === 'beskap') {
      // BESKAP: BEBET JARIK & CELANA PANJI
      const topY = 560;
      const jarikHemY = 720;
      const ankleY = 808;

      // 1. Bebet Jarik (Half-length formal wrap)
      c.save();
      c.beginPath();
      c.moveTo(482, topY);
      c.lineTo(495, jarikHemY);
      c.lineTo(705, jarikHemY);
      c.lineTo(718, topY);
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
      c.lineWidth = 3.2;
      c.stroke();
      c.restore();

      // 2. Celana Panji Hitam (Formal dark pants emerging below jarik)
      c.fillStyle = '#1C1510';
      c.strokeStyle = '#2F1C10';
      c.lineWidth = 2.8;

      // Left pant leg
      c.beginPath();
      c.moveTo(522, jarikHemY - 2);
      c.lineTo(530, ankleY);
      c.lineTo(570, ankleY);
      c.lineTo(562, jarikHemY - 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Right pant leg
      c.beginPath();
      c.moveTo(638, jarikHemY - 2);
      c.lineTo(630, ankleY);
      c.lineTo(670, ankleY);
      c.lineTo(678, jarikHemY - 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Selop Beskap Pria (Velvet with gold crest)
      drawTradSelopPria(c, 545, 822, -1);
      drawTradSelopPria(c, 655, 822, 1);

    } else {
      // KEMEJA: BESPOKE TAILORED TROUSERS & POLISHED OXFORD DRESS SHOES
      const topY = 560;
      const crotchY = 626; // Anatomically proportional rise
      const kneeY = 716;
      const ankleY = 810;

      c.save();
      c.strokeStyle = '#241710';
      c.lineWidth = 2.4;

      // Left Pant Leg with 3D cylindrical wool drape
      const leftPantGrad = c.createLinearGradient(484, 0, 600, 0);
      leftPantGrad.addColorStop(0, '#130D09');
      leftPantGrad.addColorStop(0.48, '#261C16'); // Center leg thigh highlight
      leftPantGrad.addColorStop(0.55, '#201611');
      leftPantGrad.addColorStop(1, '#110C08');

      c.fillStyle = leftPantGrad;
      c.beginPath();
      c.moveTo(484, topY);
      c.bezierCurveTo(488, 615, 510, kneeY, 520, ankleY); // Outer hip-to-ankle
      c.lineTo(570, ankleY); // Trouser hem cuff
      c.bezierCurveTo(564, kneeY, 574, 660, 600, crotchY); // Inseam to crotch
      c.lineTo(600, topY);
      c.closePath();
      c.fill();
      c.stroke();

      // Right Pant Leg with 3D cylindrical wool drape
      const rightPantGrad = c.createLinearGradient(600, 0, 716, 0);
      rightPantGrad.addColorStop(0, '#110C08');
      rightPantGrad.addColorStop(0.45, '#201611');
      rightPantGrad.addColorStop(0.52, '#261C16'); // Center leg thigh highlight
      rightPantGrad.addColorStop(1, '#130D09');

      c.fillStyle = rightPantGrad;
      c.beginPath();
      c.moveTo(716, topY);
      c.bezierCurveTo(712, 615, 690, kneeY, 680, ankleY); // Outer hip-to-ankle
      c.lineTo(630, ankleY); // Trouser hem cuff
      c.bezierCurveTo(636, kneeY, 626, 660, 600, crotchY); // Inseam to crotch
      c.lineTo(600, topY);
      c.closePath();
      c.fill();
      c.stroke();

      // Soft ambient drop shadow cast by shirt hem onto upper trousers
      const hemShadow = c.createLinearGradient(0, topY, 0, topY + 45);
      hemShadow.addColorStop(0, 'rgba(10, 7, 5, 0.60)');
      hemShadow.addColorStop(0.65, 'rgba(10, 7, 5, 0.20)');
      hemShadow.addColorStop(1, 'transparent');
      c.fillStyle = hemShadow;
      c.fillRect(484, topY, 232, 45);

      // Fly placket stitching
      c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(600, topY + 12);
      c.lineTo(600, crotchY - 8);
      c.quadraticCurveTo(606, crotchY - 2, 600, crotchY);
      c.stroke();

      // Sharp Pressed Center Crease Lines
      c.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      c.lineWidth = 1.5;
      c.beginPath();
      // Left crease
      c.moveTo(545, topY + 45);
      c.lineTo(545, ankleY - 2);
      // Right crease
      c.moveTo(655, topY + 45);
      c.lineTo(655, ankleY - 2);
      c.stroke();

      // Trouser hem break fold lines
      c.strokeStyle = '#120D0A';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(520, ankleY);
      c.quadraticCurveTo(545, ankleY - 3, 570, ankleY);
      c.moveTo(630, ankleY);
      c.quadraticCurveTo(655, ankleY - 3, 680, ankleY);
      c.stroke();

      // Polished Oxford dress shoes
      drawDressShoes(c, 545, 820, -1);
      drawDressShoes(c, 655, 820, 1);

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
   * Helper: Polished Bespoke Oxford Leather Dress Shoes
   */
  function drawDressShoes(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    // Stacked Wooden Heel
    c.fillStyle = '#1A120D';
    c.beginPath();
    c.roundRect(-20, 5, 16, 7, [0, 0, 3, 3]);
    c.fill();

    // Goodyear Welt Leather Outsole Edge
    c.fillStyle = '#2C1E16';
    c.beginPath();
    c.moveTo(-20, 5);
    c.lineTo(38, 4);
    c.lineTo(36, 8);
    c.lineTo(-20, 8);
    c.closePath();
    c.fill();

    // Calfskin Leather Shoe Body
    const shoeGrad = c.createLinearGradient(-20, -10, 38, 4);
    shoeGrad.addColorStop(0, '#100B08');
    shoeGrad.addColorStop(0.5, '#1C130E');
    shoeGrad.addColorStop(1, '#0C0806');
    c.fillStyle = shoeGrad;
    c.strokeStyle = '#261810';
    c.lineWidth = 1.8;

    c.beginPath();
    c.moveTo(-20, 5);
    c.lineTo(-20, -5);
    c.quadraticCurveTo(-10, -10, 6, -11); // Instep arch
    c.quadraticCurveTo(24, -9, 39, 2); // Almond toe curve
    c.quadraticCurveTo(28, 6, -20, 5);
    c.closePath();
    c.fill();
    c.stroke();

    // Burnished Oxford Cap-Toe Seam
    c.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(18, -10);
    c.quadraticCurveTo(22, -2, 23, 4);
    c.stroke();

    // Laces & Eyelets Facings
    c.strokeStyle = '#3E2A1E';
    c.lineWidth = 1.5;
    [-4, 0, 4, 8].forEach(lx => {
      c.beginPath();
      c.moveTo(lx, -9);
      c.lineTo(lx + 2, -6);
      c.stroke();
    });

    // Sleek Leather Gloss Reflection
    c.fillStyle = 'rgba(255, 255, 255, 0.16)';
    c.beginPath();
    c.ellipse(10, -6, 12, 2.8, 0.15, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  /**
   * ARTISANAL ARMS & HANDS (TANGAN BUSANA LENGKAP)
   * Rendered with natural skin tones and anatomically graceful postures:
   * - 'ngapurancang': Classical Javanese court posture (hands clasped politely in front of waist)
   * - 'santai': Natural relaxed arms hanging alongside the body with slender fingers
   * - 'salam': Warm traditional greeting posture
   */
  function drawArtisanHands(c, garment, pose) {
    c.save();

    const currentPose = pose || state.activeLimbPose || 'ngapurancang';
    const skinBase = '#E4BD9A';
    const skinShadow = '#CE9C72';
    const outline = '#2D1B11';

    c.lineJoin = 'round';
    c.lineCap = 'round';

    // Cuff anchor coordinates corresponding precisely with defineGarmentPath
    let leftCuff = { outer: { x: 398, y: 418 }, inner: { x: 454, y: 430 }, mid: { x: 426, y: 424 } };
    let rightCuff = { outer: { x: 802, y: 418 }, inner: { x: 746, y: 430 }, mid: { x: 774, y: 424 } };

    if (garment === 'kebaya') {
      leftCuff = { outer: { x: 390, y: 485 }, inner: { x: 430, y: 495 }, mid: { x: 410, y: 490 } };
      rightCuff = { outer: { x: 810, y: 485 }, inner: { x: 770, y: 495 }, mid: { x: 790, y: 490 } };
    } else if (garment === 'beskap') {
      leftCuff = { outer: { x: 400, y: 420 }, inner: { x: 456, y: 432 }, mid: { x: 428, y: 426 } };
      rightCuff = { outer: { x: 800, y: 420 }, inner: { x: 744, y: 432 }, mid: { x: 772, y: 426 } };
    }

    if (currentPose === 'ngapurancang') {
      // SIKAP NGAPURANCANG (Sikap Santun & Berwibawa Adat Keraton)
      // Both forearms angle inward gracefully from cuffs toward navel/waist center (600, 524)
      const wristLeft = { x: 566, y: 520 };
      const wristRight = { x: 634, y: 520 };

      // 1. Left Forearm
      c.save();
      c.fillStyle = skinBase;
      c.strokeStyle = outline;
      c.lineWidth = 2.0;

      c.beginPath();
      c.moveTo(leftCuff.outer.x, leftCuff.outer.y);
      c.bezierCurveTo(leftCuff.outer.x + 30, 475, wristLeft.x - 30, 508, wristLeft.x - 10, wristLeft.y);
      c.lineTo(wristLeft.x + 8, wristLeft.y + 12);
      c.bezierCurveTo(wristLeft.x - 15, 498, leftCuff.inner.x + 15, 460, leftCuff.inner.x, leftCuff.inner.y);
      c.closePath();
      c.fill();
      c.stroke();

      // Left forearm muscle gradient shading
      const leftArmGrad = c.createLinearGradient(leftCuff.outer.x, 420, wristLeft.x, 520);
      leftArmGrad.addColorStop(0, 'rgba(196, 142, 98, 0.25)');
      leftArmGrad.addColorStop(1, 'transparent');
      c.fillStyle = leftArmGrad;
      c.fill();

      // 2. Right Forearm
      c.beginPath();
      c.moveTo(rightCuff.outer.x, rightCuff.outer.y);
      c.bezierCurveTo(rightCuff.outer.x - 30, 475, wristRight.x + 30, 508, wristRight.x + 10, wristRight.y);
      c.lineTo(wristRight.x - 8, wristRight.y + 12);
      c.bezierCurveTo(wristRight.x + 15, 498, rightCuff.inner.x - 15, 460, rightCuff.inner.x, rightCuff.inner.y);
      c.closePath();
      c.fillStyle = skinBase;
      c.fill();
      c.stroke();

      const rightArmGrad = c.createLinearGradient(rightCuff.outer.x, 420, wristRight.x, 520);
      rightArmGrad.addColorStop(0, 'rgba(196, 142, 98, 0.25)');
      rightArmGrad.addColorStop(1, 'transparent');
      c.fillStyle = rightArmGrad;
      c.fill();

      // 3. Hands Clasped Politely in Center (Ngapurancang)
      drawNgapurancangHands(c, 600, 525);

      // If Kebaya, draw graceful Selendang Sampur draped over left arm
      if (garment === 'kebaya') {
        drawKebayaSelendang(c, leftCuff.mid.x, leftCuff.mid.y + 10);
      }

      c.restore();

    } else if (currentPose === 'salam') {
      // SIKAP SALAM HANGAT / SEMBAH PANGABEKTEN
      c.save();
      c.fillStyle = skinBase;
      c.strokeStyle = outline;
      c.lineWidth = 2.0;

      // Forearms angled upward in polite greeting at chest
      const handCenter = { x: 600, y: 460 };

      // Left arm to greeting center
      c.beginPath();
      c.moveTo(leftCuff.outer.x, leftCuff.outer.y);
      c.bezierCurveTo(leftCuff.outer.x + 20, 450, handCenter.x - 45, 480, handCenter.x - 14, handCenter.y + 20);
      c.lineTo(handCenter.x - 4, handCenter.y + 30);
      c.bezierCurveTo(handCenter.x - 30, 495, leftCuff.inner.x + 10, 455, leftCuff.inner.x, leftCuff.inner.y);
      c.closePath();
      c.fill();
      c.stroke();

      // Right arm to greeting center
      c.beginPath();
      c.moveTo(rightCuff.outer.x, rightCuff.outer.y);
      c.bezierCurveTo(rightCuff.outer.x - 20, 450, handCenter.x + 45, 480, handCenter.x + 14, handCenter.y + 20);
      c.lineTo(handCenter.x + 4, handCenter.y + 30);
      c.bezierCurveTo(handCenter.x + 30, 495, rightCuff.inner.x - 10, 455, rightCuff.inner.x, rightCuff.inner.y);
      c.closePath();
      c.fill();
      c.stroke();

      // Clasped palms in greeting (Anjali Mudra / Sembah)
      c.beginPath();
      c.moveTo(600, handCenter.y - 25);
      c.quadraticCurveTo(608, handCenter.y, 606, handCenter.y + 22);
      c.lineTo(594, handCenter.y + 22);
      c.quadraticCurveTo(592, handCenter.y, 600, handCenter.y - 25);
      c.closePath();
      c.fill();
      c.stroke();

      // Finger separation hints
      c.strokeStyle = skinShadow;
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(600, handCenter.y - 22);
      c.lineTo(600, handCenter.y + 18);
      c.stroke();

      if (garment === 'kebaya') {
        drawKebayaSelendang(c, leftCuff.mid.x, leftCuff.mid.y + 10);
      }
      c.restore();

    } else {
      // SIKAP SANTAI BERWIBAWA (Arms naturally at sides with slender, relaxed fingers)
      c.save();
      c.fillStyle = skinBase;
      c.strokeStyle = outline;
      c.lineWidth = 2.0;

      // Left Arm naturally at side
      const leftWrist = { x: 412, y: 518 };
      c.beginPath();
      c.moveTo(leftCuff.outer.x, leftCuff.outer.y);
      c.bezierCurveTo(leftCuff.outer.x - 4, 460, leftWrist.x - 8, 490, leftWrist.x - 8, leftWrist.y);
      c.lineTo(leftWrist.x + 12, leftWrist.y + 2);
      c.bezierCurveTo(leftWrist.x + 12, 490, leftCuff.inner.x + 2, 460, leftCuff.inner.x, leftCuff.inner.y);
      c.closePath();
      c.fill();
      c.stroke();

      // Left Hand at side
      drawNaturalHandSide(c, leftWrist.x, leftWrist.y, -1);

      if (garment === 'kebaya') {
        drawKebayaSelendang(c, leftCuff.mid.x, leftCuff.mid.y + 10);
      }

      // Right Arm naturally at side
      const rightWrist = { x: 788, y: 518 };
      c.beginPath();
      c.moveTo(rightCuff.outer.x, rightCuff.outer.y);
      c.bezierCurveTo(rightCuff.outer.x + 4, 460, rightWrist.x + 8, 490, rightWrist.x + 8, rightWrist.y);
      c.lineTo(rightWrist.x - 12, rightWrist.y + 2);
      c.bezierCurveTo(rightWrist.x - 12, 490, rightCuff.inner.x - 2, 460, rightCuff.inner.x, rightCuff.inner.y);
      c.closePath();
      c.fill();
      c.stroke();

      // Right Hand at side
      drawNaturalHandSide(c, rightWrist.x, rightWrist.y, 1);

      c.restore();
    }

    c.restore();
  }

  /**
   * Helper: Clasped aristocratic hands in Ngapurancang court posture
   */
  function drawNgapurancangHands(c, cx, cy) {
    c.save();
    c.translate(cx, cy);

    const skinDark = '#B5815A';
    const strokeCol = 'rgba(45, 27, 17, 0.85)';

    c.strokeStyle = strokeCol;
    c.lineWidth = 1.6;
    c.lineCap = 'round';
    c.lineJoin = 'round';

    // 1. Left hand back & palm resting beneath with volumetric skin shading
    const leftHandGrad = c.createLinearGradient(-35, -12, 35, 18);
    leftHandGrad.addColorStop(0, '#E6C19E');
    leftHandGrad.addColorStop(0.5, '#D5A47A');
    leftHandGrad.addColorStop(1, '#BE8358');
    c.fillStyle = leftHandGrad;

    c.beginPath();
    c.moveTo(-36, -8);
    c.bezierCurveTo(-20, -14, 15, -14, 32, -8);
    c.bezierCurveTo(38, 4, 32, 16, 24, 18);
    c.bezierCurveTo(0, 22, -24, 20, -32, 12);
    c.closePath();
    c.fill();
    c.stroke();

    // Crease shadow cast by overlapping right hand
    c.fillStyle = 'rgba(55, 32, 18, 0.25)';
    c.beginPath();
    c.ellipse(5, 5, 24, 7, -0.15, 0, Math.PI * 2);
    c.fill();

    // 2. Right hand folded gracefully over the left hand
    const rightHandGrad = c.createLinearGradient(-20, -15, 35, 18);
    rightHandGrad.addColorStop(0, '#EAD1B6');
    rightHandGrad.addColorStop(0.4, '#DCAC84');
    rightHandGrad.addColorStop(1, '#C2885D');
    c.fillStyle = rightHandGrad;

    c.beginPath();
    c.moveTo(-18, -12);
    c.bezierCurveTo(-4, -15, 20, -12, 34, -4);
    c.bezierCurveTo(36, 6, 26, 16, 14, 18);
    c.bezierCurveTo(0, 19, -15, 14, -20, 2);
    c.closePath();
    c.fill();
    c.stroke();

    // 3. Right thumb resting gracefully on top
    c.beginPath();
    c.moveTo(-14, -8);
    c.quadraticCurveTo(0, -16, 16, -10);
    c.quadraticCurveTo(20, -6, 14, -3);
    c.stroke();

    // 4. Subtle individual finger knuckles & separation lines
    c.strokeStyle = skinDark;
    c.lineWidth = 1.1;
    [-2, 7, 16].forEach(fx => {
      c.beginPath();
      c.moveTo(fx, -6);
      c.quadraticCurveTo(fx + 2, 4, fx + 1, 14);
      c.stroke();
    });

    // 5. Royal Gold Signet Ring (Cincin Pamor Keraton) on finger
    c.fillStyle = '#D4AF37';
    c.strokeStyle = '#5A3D18';
    c.lineWidth = 1.0;
    c.beginPath();
    c.ellipse(14, 2, 4.2, 2.6, 0.25, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    c.fillStyle = '#FFF8EB';
    c.beginPath();
    c.arc(13.6, 1.2, 0.9, 0, Math.PI * 2);
    c.fill();

    // Soft fingernail highlights
    c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    c.lineWidth = 0.9;
    c.beginPath();
    c.arc(22, 11, 2.4, 0, Math.PI);
    c.arc(14, 13, 2.4, 0, Math.PI);
    c.stroke();

    // Ambient drop shadow beneath clasped hands onto the garment
    c.fillStyle = 'rgba(40, 24, 14, 0.25)';
    c.beginPath();
    c.ellipse(0, 24, 34, 7, 0, 0, Math.PI * 2);
    c.fill();

    c.restore();
  }

  /**
   * Helper: Natural Hand at Side (slender, relaxed fingers and thumb)
   */
  function drawNaturalHandSide(c, x, y, dir) {
    c.save();
    c.translate(x, y);
    c.scale(dir, 1);

    const strokeCol = 'rgba(45, 27, 17, 0.75)';

    // Volumetric skin tone
    const handGrad = c.createLinearGradient(-10, 0, 15, 45);
    handGrad.addColorStop(0, '#E8C7A8');
    handGrad.addColorStop(0.5, '#D7A77E');
    handGrad.addColorStop(1, '#BE8458');
    c.fillStyle = handGrad;
    c.strokeStyle = strokeCol;
    c.lineWidth = 1.5;
    c.lineCap = 'round';
    c.lineJoin = 'round';

    // 1. Palm Base
    c.beginPath();
    c.moveTo(-8, 0);
    c.bezierCurveTo(-10, 8, -8, 18, -4, 24);
    c.lineTo(10, 22);
    c.bezierCurveTo(12, 14, 12, 6, 8, 0);
    c.closePath();
    c.fill();
    c.stroke();

    // 2. Relaxed Slender Fingers Curving Inward
    // Index finger
    c.beginPath();
    c.moveTo(8, 20);
    c.bezierCurveTo(11, 28, 9, 38, 7, 44);
    c.quadraticCurveTo(4, 46, 3, 42);
    c.bezierCurveTo(4, 35, 4, 26, 4, 21);
    c.fill();
    c.stroke();

    // Middle finger (longest)
    c.beginPath();
    c.moveTo(4, 22);
    c.bezierCurveTo(4, 32, 3, 42, 1, 48);
    c.quadraticCurveTo(-2, 49, -3, 45);
    c.bezierCurveTo(-2, 38, -1, 28, 0, 22);
    c.fill();
    c.stroke();

    // Ring finger
    c.beginPath();
    c.moveTo(0, 22);
    c.bezierCurveTo(-1, 30, -2, 40, -4, 45);
    c.quadraticCurveTo(-7, 46, -7, 42);
    c.bezierCurveTo(-6, 35, -5, 27, -4, 22);
    c.fill();
    c.stroke();

    // Pinky finger
    c.beginPath();
    c.moveTo(-4, 22);
    c.bezierCurveTo(-5, 28, -7, 34, -8, 38);
    c.quadraticCurveTo(-11, 39, -11, 35);
    c.bezierCurveTo(-10, 28, -8, 22, -6, 20);
    c.fill();
    c.stroke();

    // 3. Thumb resting gracefully in front
    c.beginPath();
    c.moveTo(6, 4);
    c.bezierCurveTo(14, 10, 16, 18, 13, 26);
    c.quadraticCurveTo(10, 28, 8, 24);
    c.bezierCurveTo(9, 18, 7, 12, 4, 8);
    c.fill();
    c.stroke();

    // Delicate fingernail hints
    c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    c.lineWidth = 0.9;
    c.beginPath();
    c.arc(5, 42, 2, 0, Math.PI);
    c.arc(0, 45, 2, 0, Math.PI);
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
    c.bezierCurveTo(-18, 60, -8, 120, -12, 180);
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
   * PATH GEOMETRY FOR EACH GARMENT STYLE (KEMEJA, KEBAYA, BESKAP)
   * Designed with natural anatomical shoulder slope, natural resting sleeve drape,
   * gentle waist suppression, and realistic curved hemline.
   */
  function defineGarmentPath(c, garment) {
    c.beginPath();

    if (garment === 'kebaya') {
      // KEBAYA KARTINI: Feminine shoulder slope, tailored waist, flared peplum hem
      c.moveTo(550, 242); // Left collar top
      c.bezierCurveTo(510, 248, 470, 258, 445, 270); // Natural left shoulder slope
      c.bezierCurveTo(425, 335, 405, 415, 390, 485); // Left slim sleeve outer
      c.lineTo(430, 495); // Left wrist cuff
      c.bezierCurveTo(442, 440, 462, 415, 480, 400); // Left inner sleeve into armpit
      c.bezierCurveTo(488, 435, 494, 460, 498, 475); // Tailored left waist curve
      c.bezierCurveTo(486, 520, 465, 570, 455, 615); // Flared hip peplum
      c.quadraticCurveTo(600, 632, 745, 615); // Curved lower hem
      c.bezierCurveTo(735, 570, 714, 520, 702, 475); // Right tailored waist
      c.bezierCurveTo(706, 460, 712, 435, 720, 400); // Right inner sleeve from armpit
      c.bezierCurveTo(738, 415, 758, 440, 770, 495); // Right wrist cuff inner
      c.lineTo(810, 485); // Right wrist cuff outer
      c.bezierCurveTo(795, 415, 775, 335, 755, 270); // Right slim sleeve outer
      c.bezierCurveTo(730, 258, 690, 248, 650, 242); // Right shoulder slope
      c.bezierCurveTo(630, 275, 612, 310, 600, 335); // V-neck center point
      c.bezierCurveTo(588, 310, 570, 275, 550, 242);
      c.closePath();

    } else if (garment === 'beskap') {
      // BESKAP KERATON: High mandarin collar stand, regal formal shoulders, tailored fit
      c.moveTo(552, 226); // Left mandarin collar
      c.lineTo(552, 242);
      c.bezierCurveTo(510, 248, 468, 256, 430, 262); // Left formal shoulder
      c.bezierCurveTo(418, 310, 408, 365, 400, 420); // Left sleeve outer
      c.lineTo(456, 432); // Left sleeve cuff
      c.bezierCurveTo(464, 410, 472, 395, 482, 385); // Left underarm into armpit
      c.bezierCurveTo(482, 440, 478, 510, 475, 578); // Left straight formal torso
      c.lineTo(725, 578); // Right straight formal torso
      c.bezierCurveTo(722, 510, 718, 440, 718, 385); // Right torso to armpit
      c.bezierCurveTo(728, 395, 736, 410, 744, 432); // Right inner sleeve cuff
      c.lineTo(800, 420); // Right outer sleeve cuff
      c.bezierCurveTo(792, 365, 782, 310, 770, 262); // Right formal sleeve outer
      c.bezierCurveTo(732, 256, 690, 248, 648, 242); // Right shoulder slope
      c.lineTo(648, 226); // Right mandarin collar
      c.quadraticCurveTo(600, 230, 552, 226); // Collar top curve
      c.closePath();

    } else {
      // DEFAULT: KEMEJA BATIK PRIA (Haute Couture Tailored Shirt)
      // Natural anatomical shoulder slope, natural resting sleeve drape, tailored waist suppression, curved shirttail
      c.moveTo(545, 238); // Left collar point
      c.bezierCurveTo(505, 246, 465, 256, 430, 268); // Natural left shoulder slope
      c.bezierCurveTo(418, 315, 408, 368, 398, 418); // Left outer sleeve (natural resting hang)
      c.lineTo(454, 430); // Left sleeve cuff
      c.bezierCurveTo(464, 410, 472, 395, 482, 385); // Left underarm into armpit scye
      c.bezierCurveTo(488, 425, 492, 455, 492, 475); // Tailored left waist suppression
      c.bezierCurveTo(490, 515, 484, 550, 480, 578); // Left hip hem
      c.bezierCurveTo(525, 588, 570, 596, 600, 596); // Curved center shirttail dip
      c.bezierCurveTo(630, 596, 675, 588, 720, 578); // Right hip hem
      c.bezierCurveTo(716, 550, 710, 515, 708, 475); // Tailored right waist suppression
      c.bezierCurveTo(708, 455, 712, 425, 718, 385); // Right torso into armpit scye
      c.bezierCurveTo(728, 395, 736, 410, 746, 430); // Right inner sleeve cuff
      c.lineTo(802, 418); // Right outer sleeve cuff
      c.bezierCurveTo(792, 368, 782, 315, 770, 268); // Right outer sleeve
      c.bezierCurveTo(735, 256, 695, 246, 655, 238); // Right shoulder slope
      c.bezierCurveTo(640, 252, 620, 264, 600, 264); // Neckline scooped notch
      c.bezierCurveTo(580, 264, 560, 252, 545, 238);
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
    c.fillStyle = '#F4ECE0';
    c.shadowColor = 'rgba(35, 20, 10, 0.35)';
    c.shadowBlur = 30;
    c.shadowOffsetY = 15;
    c.fill();
    c.shadowColor = 'transparent';

    // 2. Clip all motif drawing and 3D volume lighting inside the Baju boundary!
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

    // 2b. Haute Couture Volumetric 3D cylindrical lighting across torso & sleeves
    // Gives the garment luxurious natural cloth depth instead of flat cardboard
    const torsoShading = c.createLinearGradient(380, 0, 820, 0);
    torsoShading.addColorStop(0, 'rgba(40, 24, 14, 0.22)'); // Left arm outer flank shadow
    torsoShading.addColorStop(0.18, 'rgba(40, 24, 14, 0.05)');
    torsoShading.addColorStop(0.32, 'rgba(50, 30, 18, 0.16)'); // Left underarm crease shadow
    torsoShading.addColorStop(0.40, 'rgba(255, 255, 255, 0.08)');
    torsoShading.addColorStop(0.50, 'rgba(255, 255, 255, 0.20)'); // Central chest highlight
    torsoShading.addColorStop(0.60, 'rgba(255, 255, 255, 0.08)');
    torsoShading.addColorStop(0.68, 'rgba(50, 30, 18, 0.16)'); // Right underarm crease shadow
    torsoShading.addColorStop(0.82, 'rgba(40, 24, 14, 0.05)');
    torsoShading.addColorStop(1, 'rgba(40, 24, 14, 0.22)'); // Right arm outer flank shadow
    c.fillStyle = torsoShading;
    c.fill();

    // Top-to-bottom natural lighting drape (soft shadow towards lower waist hem)
    const verticalDrape = c.createLinearGradient(0, 230, 0, 610);
    verticalDrape.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    verticalDrape.addColorStop(0.35, 'transparent');
    verticalDrape.addColorStop(0.85, 'rgba(45, 27, 16, 0.08)');
    verticalDrape.addColorStop(1, 'rgba(35, 20, 12, 0.24)');
    c.fillStyle = verticalDrape;
    c.fill();

    // Soft drop shadow cast by sleeves onto the torso flanks
    c.fillStyle = 'rgba(25, 14, 8, 0.18)';
    c.beginPath();
    c.ellipse(475, 410, 16, 45, 0.15, 0, Math.PI * 2);
    c.ellipse(725, 410, 16, 45, -0.15, 0, Math.PI * 2);
    c.fill();

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
   * MASTER TAILORING DETAILS
   * Seams, armhole scye seams (kerung lengan), 3D collar stand, double-needle topstitch,
   * carved 4-hole coconut buttons with thread, bespoke breast pocket, and fabric drape folds.
   */
  function drawGarmentTailoringDetails(c, garment) {
    c.save();
    c.lineJoin = 'round';
    c.lineCap = 'round';

    // 1. Refined outer garment seam stroke
    c.strokeStyle = '#2C1A10';
    c.lineWidth = 2.6;
    defineGarmentPath(c, garment);
    c.stroke();

    if (garment === 'kebaya') {
      // KEBAYA KARTINI: Embroidered front border, Kutubaru lapels, and 3-tier gold brooches
      c.strokeStyle = '#8C6D46';
      c.lineWidth = 2.0;

      // Bebie / Kartini front lapel borders
      c.beginPath();
      c.moveTo(550, 242);
      c.lineTo(594, 335);
      c.lineTo(594, 628);
      c.moveTo(650, 242);
      c.lineTo(606, 335);
      c.lineTo(606, 628);
      c.stroke();

      // Armhole seams (kerung lengan)
      c.strokeStyle = 'rgba(44, 26, 16, 0.35)';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(445, 270);
      c.quadraticCurveTo(465, 340, 480, 400);
      c.moveTo(755, 270);
      c.quadraticCurveTo(735, 340, 720, 400);
      c.stroke();

      // Triple Ornate Gold Kerongsang Susun Brooches
      [360, 420, 480].forEach((by, idx) => {
        c.save();
        c.translate(600, by);

        // Brooch filigree gold flower plate
        c.fillStyle = '#C5A572';
        c.beginPath();
        c.ellipse(0, 0, 11, 8, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#8C6D46';
        c.lineWidth = 1.4;
        c.stroke();

        // Faceted center ruby/topaz cabochon gem
        c.fillStyle = idx === 1 ? '#9C2C28' : '#785522';
        c.beginPath();
        c.arc(0, 0, 4, 0, Math.PI * 2);
        c.fill();

        // Dangling pearl / gold pendant on bottom brooch
        if (idx === 2) {
          c.strokeStyle = '#C5A572';
          c.beginPath();
          c.moveTo(0, 8);
          c.lineTo(0, 16);
          c.stroke();
          c.fillStyle = '#FAF7F2';
          c.beginPath();
          c.arc(0, 18, 2.8, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      });

    } else if (garment === 'beskap') {
      // BESKAP KERATON: High mandarin collar stand, asymmetric Kancingan Serong, brass buttons & chain
      // High Mandarin Collar Stand
      c.fillStyle = '#EFE7DA';
      c.beginPath();
      c.moveTo(552, 226);
      c.lineTo(552, 244);
      c.quadraticCurveTo(600, 250, 648, 244);
      c.lineTo(648, 226);
      c.quadraticCurveTo(600, 230, 552, 226);
      c.closePath();
      c.fill();
      c.strokeStyle = '#2C1A10';
      c.lineWidth = 2.4;
      c.stroke();

      // Asymmetric overlapping flap (Kancingan Serong)
      c.strokeStyle = '#2C1A10';
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(568, 244);
      c.bezierCurveTo(585, 275, 625, 290, 630, 310);
      c.lineTo(630, 578);
      c.stroke();

      // Royal Gold Pocket Chain (Rantai Kalung Jam Kantong Keraton)
      c.strokeStyle = '#C5A572';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(630, 395);
      c.bezierCurveTo(600, 435, 550, 430, 535, 410);
      c.stroke();

      // Royal Brass Buttons along the flap
      [275, 325, 375, 425, 475, 525].forEach(by => {
        c.fillStyle = '#C5A572';
        c.beginPath();
        c.arc(630, by, 5.5, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#8C6D46';
        c.lineWidth = 1.4;
        c.stroke();

        // Button shine highlight
        c.fillStyle = '#FFF8E7';
        c.beginPath();
        c.arc(628, by - 1.5, 1.6, 0, Math.PI * 2);
        c.fill();
      });

      // Armhole seams (kerung lengan)
      c.strokeStyle = 'rgba(44, 26, 16, 0.4)';
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(430, 262);
      c.quadraticCurveTo(456, 325, 482, 385);
      c.moveTo(770, 262);
      c.quadraticCurveTo(744, 325, 718, 385);
      c.stroke();

    } else {
      // KEMEJA BATIK PRIA: 3D Collar stand, folded lapels, placket with topstitch, 5 carved buttons, bespoke pocket
      c.save();

      // 1. Armhole Scye Seams (Kerung Lengan) - separates sleeve cylinder from torso
      c.strokeStyle = 'rgba(44, 26, 16, 0.45)';
      c.lineWidth = 2.0;
      c.beginPath();
      // Left armhole
      c.moveTo(430, 268);
      c.bezierCurveTo(454, 315, 470, 355, 482, 385);
      // Right armhole
      c.moveTo(770, 268);
      c.bezierCurveTo(746, 315, 730, 355, 718, 385);
      c.stroke();

      // Double-needle topstitch along armhole seams
      c.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(432, 268);
      c.bezierCurveTo(456, 315, 472, 355, 484, 385);
      c.moveTo(768, 268);
      c.bezierCurveTo(744, 315, 728, 355, 716, 385);
      c.stroke();

      // 2. Collar Stand & Crisp Pointed Folded Lapels
      // Soft lapel drop shadow onto chest fabric
      c.fillStyle = 'rgba(44, 26, 16, 0.22)';
      c.beginPath();
      c.moveTo(545, 238);
      c.lineTo(578, 296);
      c.lineTo(600, 270);
      c.lineTo(622, 296);
      c.lineTo(655, 238);
      c.closePath();
      c.fill();

      // Left Lapel
      c.fillStyle = '#F8F3EA';
      c.strokeStyle = '#2C1A10';
      c.lineWidth = 2.2;
      c.beginPath();
      c.moveTo(545, 238);
      c.lineTo(576, 292); // Crisp collar point
      c.lineTo(600, 268); // V-notch center
      c.lineTo(572, 248);
      c.closePath();
      c.fill();
      c.stroke();

      // Right Lapel
      c.beginPath();
      c.moveTo(655, 238);
      c.lineTo(624, 292); // Crisp collar point
      c.lineTo(600, 268); // V-notch center
      c.lineTo(628, 248);
      c.closePath();
      c.fill();
      c.stroke();

      // Collar Roll Topstitch
      c.strokeStyle = 'rgba(44, 26, 16, 0.35)';
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(547, 242);
      c.lineTo(574, 288);
      c.moveTo(653, 242);
      c.lineTo(626, 288);
      c.stroke();

      // 3. Front Button Placket with Double-Needle Topstitch
      c.fillStyle = 'rgba(44, 26, 16, 0.04)';
      c.fillRect(589, 268, 22, 326);

      c.strokeStyle = '#2C1A10';
      c.lineWidth = 2.0;
      c.beginPath();
      c.moveTo(589, 268);
      c.lineTo(589, 594);
      c.moveTo(611, 268);
      c.lineTo(611, 594);
      c.stroke();

      // Fine topstitching inside placket edges
      c.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(592, 268);
      c.lineTo(592, 594);
      c.moveTo(608, 268);
      c.lineTo(608, 594);
      c.stroke();

      // 4. Five Bespoke Carved Coconut-Shell Buttons with 4 Thread Holes
      [315, 370, 425, 480, 535].forEach(by => {
        // Outer wood rim bevel
        c.fillStyle = '#361F10';
        c.beginPath();
        c.arc(600, by, 5.5, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#22140A';
        c.lineWidth = 1.2;
        c.stroke();

        // Inner button face
        c.fillStyle = '#4E311D';
        c.beginPath();
        c.arc(600, by, 4.2, 0, Math.PI * 2);
        c.fill();

        // 4 Thread Holes
        c.fillStyle = '#1D1108';
        [-1.5, 1.5].forEach(dx => {
          [-1.5, 1.5].forEach(dy => {
            c.beginPath();
            c.arc(600 + dx, by + dy, 0.7, 0, Math.PI * 2);
            c.fill();
          });
        });

        // Crossed thread stitch (Cream)
        c.strokeStyle = '#F8F3EB';
        c.lineWidth = 0.9;
        c.beginPath();
        c.moveTo(598.5, by - 1.5);
        c.lineTo(601.5, by + 1.5);
        c.moveTo(601.5, by - 1.5);
        c.lineTo(598.5, by + 1.5);
        c.stroke();
      });

      // 5. Bespoke Peaked Left Breast Pocket with Dimensional Shadow
      c.save();
      // Drop shadow cast by pocket patch onto chest
      c.fillStyle = 'rgba(40, 24, 14, 0.16)';
      c.beginPath();
      c.moveTo(502, 327);
      c.lineTo(543, 327);
      c.lineTo(543, 373);
      c.lineTo(521, 384);
      c.lineTo(502, 373);
      c.closePath();
      c.fill();

      // Pocket fabric patch
      c.fillStyle = 'rgba(244, 236, 224, 0.25)';
      c.beginPath();
      c.moveTo(500, 325);
      c.lineTo(540, 325);
      c.lineTo(540, 370);
      c.lineTo(520, 380); // Classical tailor's pointed hem
      c.lineTo(500, 370);
      c.closePath();
      c.fill();
      c.strokeStyle = 'rgba(44, 26, 16, 0.65)';
      c.lineWidth = 1.6;
      c.stroke();

      // Pocket Top Bar Welt
      c.fillStyle = 'rgba(65, 40, 24, 0.18)';
      c.fillRect(500, 325, 40, 7);
      c.strokeStyle = 'rgba(44, 26, 16, 0.75)';
      c.strokeRect(500, 325, 40, 7);

      // Fine inner topstitch
      c.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      c.lineWidth = 0.9;
      c.beginPath();
      c.moveTo(502, 335);
      c.lineTo(538, 335);
      c.lineTo(538, 368);
      c.lineTo(520, 377);
      c.lineTo(502, 368);
      c.closePath();
      c.stroke();
      c.restore();

      // 6. Sleeve Cuff Bands & Tailored Horn Buttons
      c.strokeStyle = '#2C1A10';
      c.lineWidth = 2.0;
      c.beginPath();
      c.moveTo(398, 418);
      c.lineTo(454, 430);
      c.moveTo(802, 418);
      c.lineTo(746, 430);
      c.stroke();

      // Double topstitch on cuffs
      c.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(400, 414);
      c.lineTo(452, 426);
      c.moveTo(800, 414);
      c.lineTo(748, 426);
      c.stroke();

      // Tailored Cuff Buttons
      [{ x: 426, y: 423 }, { x: 774, y: 423 }].forEach(cb => {
        c.fillStyle = '#361F10';
        c.beginPath();
        c.arc(cb.x, cb.y, 3.2, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#D4AF37';
        c.lineWidth = 0.8;
        c.stroke();
      });

      // 7. Subtle Fabric Drape Creases (Underarm & Waist Folds)
      c.strokeStyle = 'rgba(44, 26, 16, 0.15)';
      c.lineWidth = 1.4;
      c.beginPath();
      // Left armpit fold
      c.moveTo(482, 390);
      c.quadraticCurveTo(495, 410, 490, 430);
      // Right armpit fold
      c.moveTo(718, 390);
      c.quadraticCurveTo(705, 410, 710, 430);
      // Waist side tension folds
      c.moveTo(482, 470);
      c.quadraticCurveTo(500, 480, 520, 475);
      c.moveTo(718, 470);
      c.quadraticCurveTo(700, 480, 680, 475);
      c.stroke();

      c.restore();
    }

    c.restore();
  }

  /**
   * CERMIN POTRET ADAT (ROYAL ANTIQUE JAVANESE VANITY MIRROR)
   * Replaces flat cutout with an authentic royal bronze-framed heirloom looking-glass (Cermin Pusaka).
   * Center (600, 162), Oval (66 x 82) perfectly crowning collar & neckline.
   * When camera is off: Warm smoked convex bronze glass, diagonal specular reflection, and gold serif typography.
   * When camera/photo is active: Smoothly clipped live video or photo with feathered antique brass framing.
   */
  function drawFaceInFrame(c) {
    const faceX = 600;
    const faceY = 162;
    const radiusX = 66;
    const radiusY = 82;

    c.save();

    // If Webcam is actively streaming OR user has uploaded a photo
    const hasLiveVideo = (state.cameraActive && videoEl && videoEl.readyState >= 2);
    const hasPhoto = (state.userFaceImg !== null);

    if (hasLiveVideo || hasPhoto) {
      // 1. ACTIVE SELFIE / USER PHOTO PORTRAIT
      c.save();
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX - 2, radiusY - 2, 0, 0, Math.PI * 2);
      c.clip(); // Clip video/photo strictly inside mirror glass

      // Fill background behind face
      c.fillStyle = '#0D0704';
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

      // Soft feathered inner vignette around portrait edges
      c.save();
      const innerVig = c.createRadialGradient(faceX, faceY, radiusX * 0.7, faceX, faceY, radiusY);
      innerVig.addColorStop(0, 'transparent');
      innerVig.addColorStop(0.85, 'rgba(30, 18, 10, 0.35)');
      innerVig.addColorStop(1, 'rgba(20, 12, 6, 0.75)');
      c.fillStyle = innerVig;
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();

    } else {
      // 2. IDLE STATE: CERMIN POTRET PUSAKA (Antique Javanese Convex Mirror)
      // Convex Smoked Bronze Glass Surface
      const mirrorGlass = c.createRadialGradient(faceX - 18, faceY - 25, 8, faceX, faceY, radiusY);
      mirrorGlass.addColorStop(0, '#362418');
      mirrorGlass.addColorStop(0.45, '#24160E');
      mirrorGlass.addColorStop(0.8, '#160D08');
      mirrorGlass.addColorStop(1, '#0C0704');

      c.fillStyle = mirrorGlass;
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);
      c.fill();

      // Diagonal Specular Reflection Sheen (Curved glass reflection)
      c.save();
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX - 2, radiusY - 2, 0, 0, Math.PI * 2);
      c.clip();

      const sheenGrad = c.createLinearGradient(faceX - radiusX, faceY - radiusY, faceX + radiusX, faceY + radiusY);
      sheenGrad.addColorStop(0, 'rgba(255, 245, 225, 0.18)');
      sheenGrad.addColorStop(0.28, 'rgba(255, 245, 225, 0.05)');
      sheenGrad.addColorStop(0.48, 'transparent');
      sheenGrad.addColorStop(0.72, 'rgba(212, 175, 55, 0.08)');
      sheenGrad.addColorStop(1, 'transparent');
      c.fillStyle = sheenGrad;
      c.fillRect(faceX - radiusX, faceY - radiusY, radiusX * 2, radiusY * 2);

      // Subtle Concave Glass Vignette
      const concaveVig = c.createRadialGradient(faceX, faceY, 20, faceX, faceY, radiusY);
      concaveVig.addColorStop(0, 'transparent');
      concaveVig.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      c.fillStyle = concaveVig;
      c.fillRect(faceX - radiusX, faceY - radiusY, radiusX * 2, radiusY * 2);
      c.restore();

      // Inner Concentric Brass Filigree Ring
      c.save();
      c.strokeStyle = 'rgba(197, 165, 114, 0.45)';
      c.lineWidth = 1.0;
      c.setLineDash([4, 4]);
      c.beginPath();
      c.ellipse(faceX, faceY, radiusX - 8, radiusY - 8, 0, 0, Math.PI * 2);
      c.stroke();
      c.setLineDash([]);

      // Antique Brass Camera / Royal Looking-Glass Emblem
      c.translate(faceX, faceY - 12);

      // Camera body
      c.fillStyle = 'rgba(212, 175, 55, 0.12)';
      c.strokeStyle = '#D4AF37';
      c.lineWidth = 1.6;
      c.beginPath();
      c.roundRect(-16, -10, 32, 21, 4);
      c.fill();
      c.stroke();

      // Camera top pentaprism housing
      c.beginPath();
      c.moveTo(-6, -10);
      c.lineTo(-4, -14);
      c.lineTo(4, -14);
      c.lineTo(6, -10);
      c.closePath();
      c.fillStyle = '#C5A572';
      c.fill();
      c.stroke();

      // Camera lens ring & gold diamond center
      c.strokeStyle = '#EAD8B8';
      c.lineWidth = 1.4;
      c.beginPath();
      c.arc(0, 1, 6, 0, Math.PI * 2);
      c.stroke();

      c.fillStyle = '#D4AF37';
      c.beginPath();
      c.arc(0, 1, 2.5, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Classical Serif Gold Typography
      c.save();
      c.textAlign = 'center';
      c.font = '700 10.5px Cinzel, "Newsreader", "Playfair Display", Georgia, serif';
      c.fillStyle = '#EAD8B8';
      c.shadowColor = 'rgba(0, 0, 0, 0.8)';
      c.shadowBlur = 4;
      c.shadowOffsetY = 1;
      c.fillText('CERMIN ADAT JAWA', faceX, faceY + 24);

      c.font = 'italic 400 9px "Plus Jakarta Sans", sans-serif';
      c.fillStyle = '#C5A572';
      c.shadowColor = 'transparent';
      c.fillText('Buka Kamera • Coba Busana', faceX, faceY + 40);
      c.restore();
    }

    // 3. MASTER BEVELED HEIRLOOM BRASS FRAME (Shared in both Idle & Active states)
    // Deep Outer Relief Shadow
    c.save();
    c.shadowColor = 'rgba(15, 9, 5, 0.65)';
    c.shadowBlur = 14;
    c.shadowOffsetY = 5;
    c.strokeStyle = '#3D2616';
    c.lineWidth = 3.6;
    c.beginPath();
    c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);
    c.stroke();
    c.restore();

    // Main Antique Brass Rim
    c.strokeStyle = '#C5A572';
    c.lineWidth = 2.4;
    c.beginPath();
    c.ellipse(faceX, faceY, radiusX, radiusY, 0, 0, Math.PI * 2);
    c.stroke();

    // Fine Gold Hairline Highlight
    c.strokeStyle = '#D4AF37';
    c.lineWidth = 1.0;
    c.beginPath();
    c.ellipse(faceX, faceY, radiusX - 2, radiusY - 2, 0, 0, Math.PI * 2);
    c.stroke();

    // 4 Cardinal Golden Pamor Diamond Studs (Pamor Permata Emas)
    const studs = [
      { x: faceX, y: faceY - radiusY },
      { x: faceX, y: faceY + radiusY },
      { x: faceX - radiusX, y: faceY },
      { x: faceX + radiusX, y: faceY }
    ];
    studs.forEach(st => {
      c.fillStyle = '#D4AF37';
      c.strokeStyle = '#2D1B11';
      c.lineWidth = 1.0;
      c.beginPath();
      c.arc(st.x, st.y, 2.8, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    });

    c.restore();
  }

  /**
   * AUTHENTIC JAVANESE BLANGKON KERATON
   * Sculpted Solonese/Yogya royal blangkon that sits naturally on the head crown,
   * with arched Kemada band, layered diagonal Wiron pleats, rear Mondholan bun, and soft drop shadow.
   */
  function drawBlangkonHat(c) {
    const headX = 600;
    const hatY = 96;

    c.save();
    c.translate(headX, hatY);

    // 1. Soft Hat Drop Shadow onto Forehead
    c.fillStyle = 'rgba(35, 20, 12, 0.38)';
    c.beginPath();
    c.ellipse(0, 36, 62, 12, 0, 0, Math.PI * 2);
    c.fill();

    // 2. Mondholan (Rear Javanese Hair Bun) on the back right
    c.save();
    const mondholanGrad = c.createRadialGradient(58, 20, 3, 58, 20, 16);
    mondholanGrad.addColorStop(0, '#5A3822');
    mondholanGrad.addColorStop(0.7, '#3A2012');
    mondholanGrad.addColorStop(1, '#221208');
    c.fillStyle = mondholanGrad;
    c.beginPath();
    c.ellipse(58, 20, 14, 18, 0.15, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#221208';
    c.lineWidth = 1.6;
    c.stroke();
    // Mondholan fabric crease line
    c.strokeStyle = '#8C6D46';
    c.lineWidth = 1.2;
    c.beginPath();
    c.arc(58, 20, 9, -0.4 * Math.PI, 0.6 * Math.PI);
    c.stroke();
    c.restore();

    // 3. Main Blangkon Crown Dome (Batik Sogan Fabric Cap)
    c.save();
    const crownGrad = c.createLinearGradient(0, -22, 0, 30);
    crownGrad.addColorStop(0, '#422818');
    crownGrad.addColorStop(0.5, '#56341F');
    crownGrad.addColorStop(1, '#3A2214');
    c.fillStyle = crownGrad;

    c.beginPath();
    c.moveTo(-68, 26);
    c.bezierCurveTo(-72, 4, -58, -18, -35, -24);
    c.bezierCurveTo(-15, -28, 15, -28, 38, -22);
    c.bezierCurveTo(62, -16, 74, 4, 68, 26);
    c.quadraticCurveTo(0, 38, -68, 26);
    c.closePath();
    c.fill();
    c.strokeStyle = '#24140B';
    c.lineWidth = 2.2;
    c.stroke();

    // 4. Layered Diagonal Wiron Blangkon Pleats (Batik Sogan Folds)
    c.save();
    c.clip(); // Clip inside the crown dome

    const pleats = [
      { x1: -50, y1: -20, x2: -15, y2: 36 },
      { x1: -32, y1: -26, x2: 4, y2: 36 },
      { x1: -14, y1: -28, x2: 24, y2: 36 },
      { x1: 6, y1: -26, x2: 44, y2: 36 },
      { x1: 26, y1: -22, x2: 60, y2: 34 }
    ];

    pleats.forEach(pt => {
      // Pleat fold shadow
      c.strokeStyle = 'rgba(26, 14, 8, 0.65)';
      c.lineWidth = 3.2;
      c.beginPath();
      c.moveTo(pt.x1, pt.y1);
      c.lineTo(pt.x2, pt.y2);
      c.stroke();

      // Pleat fold golden-sogan highlight edge
      c.strokeStyle = '#A88456';
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(pt.x1 + 1.5, pt.y1);
      c.lineTo(pt.x2 + 1.5, pt.y2);
      c.stroke();
    });
    c.restore();

    // 5. Kemada (Forehead Arched Band)
    const kemadaGrad = c.createLinearGradient(0, 18, 0, 34);
    kemadaGrad.addColorStop(0, '#2F1A0E');
    kemadaGrad.addColorStop(1, '#1A0D07');
    c.fillStyle = kemadaGrad;

    c.beginPath();
    c.moveTo(-68, 24);
    c.quadraticCurveTo(0, 36, 68, 24);
    c.quadraticCurveTo(55, 32, 0, 34);
    c.quadraticCurveTo(-55, 32, -68, 24);
    c.closePath();
    c.fill();

    // Kemada Gold Edge Stitch
    c.strokeStyle = '#D4AF37';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(-66, 25);
    c.quadraticCurveTo(0, 35, 66, 25);
    c.stroke();

    c.restore();
    c.restore();
  }

  /**
   * TRADITIONAL JAVANESE SANGGUL (KONDE JAWA & MELATI)
   * Elegant hair bun with roncean melati and gold cunduk mentul hairpins for Kebaya Kartini
   */
  function drawSanggulTradisional(c) {
    const headX = 600;
    const headY = 162;

    c.save();
    c.translate(headX, headY);

    // 1. Back Sanggul Bun Volume (Konde Ukel Klasik)
    const sanggulGrad = c.createRadialGradient(0, -68, 20, 0, -68, 75);
    sanggulGrad.addColorStop(0, '#2A201A');
    sanggulGrad.addColorStop(0.7, '#16100C');
    sanggulGrad.addColorStop(1, '#0C0806');
    c.fillStyle = sanggulGrad;

    c.beginPath();
    c.ellipse(0, -66, 80, 36, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#0C0806';
    c.lineWidth = 2.0;
    c.stroke();

    // 2. Delicate hair texture lines (Sasak Halus)
    c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    c.lineWidth = 1.2;
    [-54, -36, -18, 0, 18, 36, 54].forEach(ox => {
      c.beginPath();
      c.moveTo(ox, -58);
      c.quadraticCurveTo(ox * 0.6, -92, 0, -96);
      c.stroke();
    });

    // 3. Gold Cunduk Mentul Hairpins (Kembang Goyang Emas)
    drawCundukMentulPin(c, 0, -96, 0);
    drawCundukMentulPin(c, -34, -88, -0.25);
    drawCundukMentulPin(c, 34, -88, 0.25);

    // 4. Roncean Melati (Cascading white jasmine garland along the right contour)
    c.fillStyle = '#FAF7F2';
    c.strokeStyle = '#D5CBBA';
    c.lineWidth = 1.0;
    const jasmineDots = [
      { x: 52, y: -48, r: 4.5 },
      { x: 60, y: -35, r: 4.2 },
      { x: 66, y: -20, r: 4.0 },
      { x: 70, y: -4, r: 3.8 },
      { x: 72, y: 12, r: 3.5 },
      { x: 70, y: 28, r: 3.2 },
      { x: 66, y: 42, r: 3.0 },
      { x: 60, y: 56, r: 2.8 }
    ];
    jasmineDots.forEach(pt => {
      c.beginPath();
      c.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Tiny golden pollen center
      c.fillStyle = '#C5A572';
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
    c.lineWidth = 1.8;
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

    // 1. Simpan ke Supabase jika terkonfigurasi
    if (window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      try {
        const res = await window.LelanaSupabase.saveArtwork(payload);
        if (res && res.success && res.data) {
          savedRecord = res.data;
        } else if (res && res.error) {
          console.warn('Supabase save warning:', res.error);
        }
      } catch (err) {
        console.warn('Gagal menyimpan ke Supabase Cloud (beralih ke cache lokal):', err);
      }
    }

    // 2. Client-side fallback / local cache
    if (!savedRecord) {
      savedRecord = {
        id: 'local_' + Date.now(),
        nama_kain: namaKain,
        filosofi_karya: filosofi,
        palet_warna: palet.split(',').map(s => s.trim()).filter(Boolean),
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
    await loadExhibitionGallery();

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
     9. VIRTUAL EXHIBITION GALLERY (Pameran Kain Virtual - Supabase BaaS)
     ===================================================================== */
  async function loadExhibitionGallery() {
    if (!els.galleryGrid) return;
    let items = [];

    // Ambil data karya dari database Supabase
    if (window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      try {
        const res = await window.LelanaSupabase.getArtworks({ limit: 40 });
        if (res && res.success && Array.isArray(res.data)) {
          items = res.data;
        }
      } catch (e) {
        console.log('Loading exhibition from local cache fallback...');
      }
    }

    const localItems = getLocalCache();
    const mergedMap = new Map();

    // Gabungkan item lokal dengan item Supabase (utamakan Supabase)
    localItems.forEach(item => mergedMap.set(item.nama_kain || item.id, item));
    items.forEach(item => {
      mergedMap.set(item.nama_kain || item.id, item);
    });

    state.galleryArtworks = Array.from(mergedMap.values());
    renderGalleryUI(state.galleryArtworks);
    updateSupabaseBadge();
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
        : (art.palet_warna ? String(art.palet_warna).split(',') : []);

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
                  ${String(p).trim()}
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

    // Hapus dari Supabase jika terdaftar di cloud
    if (item.id && !String(item.id).startsWith('local_') && window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      try {
        await window.LelanaSupabase.deleteArtwork(item.id, item.file_gambar_url);
      } catch (err) {
        console.warn('Gagal menghapus dari Supabase:', err);
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

    if (window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      try {
        await window.LelanaSupabase.clearAll();
      } catch (e) {
        console.warn('Gagal mengosongkan Supabase:', e);
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

  /* =====================================================================
     9.5. SUPABASE SETTINGS & MODAL CONTROLS
     ===================================================================== */
  const SUPABASE_SCHEMA_SQL = `-- =====================================================================
-- Lelana Jateng: Skema Database & Storage Supabase untuk Studio Canting
-- Jalankan di SQL Editor Supabase: https://supabase.com
-- =====================================================================

-- 1. Tabel karya_batik
CREATE TABLE IF NOT EXISTS public.karya_batik (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID DEFAULT NULL,
    nama_kain TEXT NOT NULL,
    filosofi_karya TEXT NOT NULL,
    file_gambar_url TEXT NOT NULL,
    palet_warna JSONB DEFAULT '[]'::jsonb,
    motif TEXT DEFAULT 'Kreasi Bebas',
    pembuat TEXT DEFAULT 'Pengrajin Lelana',
    is_publik BOOLEAN DEFAULT TRUE NOT NULL
);

-- Indeks
CREATE INDEX IF NOT EXISTS idx_karya_batik_created_at ON public.karya_batik (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_karya_batik_motif ON public.karya_batik (motif);
CREATE INDEX IF NOT EXISTS idx_karya_batik_is_publik ON public.karya_batik (is_publik);

-- 2. Hak Akses Row Level Security (RLS)
ALTER TABLE public.karya_batik ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Publik dapat melihat karya batik" ON public.karya_batik;
CREATE POLICY "Publik dapat melihat karya batik" ON public.karya_batik FOR SELECT USING (is_publik = TRUE);

DROP POLICY IF EXISTS "Pengunjung dapat menyimpan karya batik baru" ON public.karya_batik;
CREATE POLICY "Pengunjung dapat menyimpan karya batik baru" ON public.karya_batik FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Pengunjung dapat menghapus karya batik" ON public.karya_batik;
CREATE POLICY "Pengunjung dapat menghapus karya batik" ON public.karya_batik FOR DELETE USING (TRUE);

-- 3. Bucket Storage 'karya-batik'
INSERT INTO storage.buckets (id, name, public) VALUES ('karya-batik', 'karya-batik', TRUE) ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "Public Read Karya Batik Storage" ON storage.objects;
CREATE POLICY "Public Read Karya Batik Storage" ON storage.objects FOR SELECT USING (bucket_id = 'karya-batik');

DROP POLICY IF EXISTS "Public Upload Karya Batik Storage" ON storage.objects;
CREATE POLICY "Public Upload Karya Batik Storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'karya-batik');

DROP POLICY IF EXISTS "Public Delete Karya Batik Storage" ON storage.objects;
CREATE POLICY "Public Delete Karya Batik Storage" ON storage.objects FOR DELETE USING (bucket_id = 'karya-batik');`;

  function updateSupabaseBadge() {
    if (!els.supabaseStatusDot || !els.supabaseStatusText) return;
    if (window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      els.supabaseStatusDot.className = 'w-2 h-2 rounded-full bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E]';
      els.supabaseStatusText.textContent = 'Supabase Terhubung';
    } else {
      els.supabaseStatusDot.className = 'w-2 h-2 rounded-full bg-amber-400';
      els.supabaseStatusText.textContent = 'Supabase (Mode Lokal)';
    }
  }

  function openSupabaseModal() {
    if (!els.supabaseModal) return;
    const cfg = window.LelanaSupabase ? window.LelanaSupabase.getConfig() : { url: '', anonKey: '' };
    if (els.inputSupabaseUrl) els.inputSupabaseUrl.value = cfg.url;
    if (els.inputSupabaseKey) els.inputSupabaseKey.value = cfg.anonKey;

    if (els.supabaseTestResult) {
      els.supabaseTestResult.className = 'hidden';
      els.supabaseTestResult.textContent = '';
    }

    if (window.LelanaSupabase && window.LelanaSupabase.isConfigured()) {
      if (els.supabaseBannerDot) els.supabaseBannerDot.className = 'w-2.5 h-2.5 rounded-full bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] mt-1 shrink-0';
      if (els.supabaseBannerTitle) els.supabaseBannerTitle.textContent = 'Terhubung ke Supabase Cloud';
      if (els.supabaseBannerDesc) {
        els.supabaseBannerDesc.textContent = `Proyek aktif: ${cfg.url}. Gambar dan data busana tersimpan di PostgreSQL & Storage Supabase.`;
      }
    } else {
      if (els.supabaseBannerDot) els.supabaseBannerDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0';
      if (els.supabaseBannerTitle) els.supabaseBannerTitle.textContent = 'Mode Cadangan Lokal Aktif';
      if (els.supabaseBannerDesc) {
        els.supabaseBannerDesc.textContent = 'Supabase belum terhubung. Masukkan Project URL & Anon Key di bawah ini untuk menghubungkan database cloud.';
      }
    }

    els.supabaseModal.classList.add('is-open');
  }

  function closeSupabaseModal() {
    if (els.supabaseModal) {
      els.supabaseModal.classList.remove('is-open');
    }
  }

  async function handleSaveSupabaseConfig(e) {
    if (e) e.preventDefault();
    const url = els.inputSupabaseUrl ? els.inputSupabaseUrl.value.trim() : '';
    const key = els.inputSupabaseKey ? els.inputSupabaseKey.value.trim() : '';

    if (!url || !key) {
      showSupabaseFeedback('Mohon isi Project URL dan Anon Key Supabase Anda.', false);
      return;
    }

    if (els.supabaseSaveSpinner) els.supabaseSaveSpinner.classList.remove('hidden');

    const testRes = await window.LelanaSupabase.testConnection(url, key);

    if (els.supabaseSaveSpinner) els.supabaseSaveSpinner.classList.add('hidden');

    if (testRes.success) {
      window.LelanaSupabase.setConfig(url, key);
      showSupabaseFeedback('✅ ' + testRes.message, true);
      updateSupabaseBadge();
      setTimeout(() => {
        closeSupabaseModal();
        loadExhibitionGallery();
      }, 1200);
    } else {
      showSupabaseFeedback('⚠️ ' + testRes.message, false);
    }
  }

  function handleResetSupabaseConfig() {
    if (confirm('Kembalikan konfigurasi Supabase ke mode awal (Local Cache)?')) {
      if (window.LelanaSupabase) {
        window.LelanaSupabase.setConfig('', '');
      }
      if (els.inputSupabaseUrl) els.inputSupabaseUrl.value = '';
      if (els.inputSupabaseKey) els.inputSupabaseKey.value = '';
      showSupabaseFeedback('Pengaturan Supabase dikosongkan. Beralih ke penyimpanan lokal.', true);
      updateSupabaseBadge();
      loadExhibitionGallery();
    }
  }

  function showSupabaseFeedback(msg, isSuccess) {
    if (!els.supabaseTestResult) return;
    els.supabaseTestResult.className = `p-3 rounded-lg text-xs leading-relaxed border ${
      isSuccess
        ? 'bg-[#12281E] border-[#3ECF8E]/60 text-[#3ECF8E]'
        : 'bg-[#2D1612] border-red-700/60 text-red-200'
    }`;
    els.supabaseTestResult.textContent = msg;
    els.supabaseTestResult.classList.remove('hidden');
  }

  function openSqlModal() {
    if (els.sqlSchemaCode) {
      els.sqlSchemaCode.textContent = SUPABASE_SCHEMA_SQL;
    }
    if (els.copySqlSuccess) els.copySqlSuccess.classList.add('hidden');
    if (els.supabaseSqlModal) els.supabaseSqlModal.classList.add('is-open');
  }

  function closeSqlModal() {
    if (els.supabaseSqlModal) els.supabaseSqlModal.classList.remove('is-open');
  }

  async function handleCopySql() {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      if (els.copySqlSuccess) els.copySqlSuccess.classList.remove('hidden');
      setTimeout(() => {
        if (els.copySqlSuccess) els.copySqlSuccess.classList.add('hidden');
      }, 3000);
    } catch (err) {
      alert('Gagal menyalin otomatis, silakan salin teks SQL secara manual.');
    }
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
        document.querySelectorAll('[data-stroke]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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

    // Supabase Configuration & Modal Events
    if (els.btnSupabaseConfig) els.btnSupabaseConfig.addEventListener('click', openSupabaseModal);
    if (els.btnCloseSupabaseModal) els.btnCloseSupabaseModal.addEventListener('click', closeSupabaseModal);
    if (els.supabaseConfigForm) els.supabaseConfigForm.addEventListener('submit', handleSaveSupabaseConfig);
    if (els.btnResetSupabase) els.btnResetSupabase.addEventListener('click', handleResetSupabaseConfig);
    if (els.btnOpenSqlSchema) els.btnOpenSqlSchema.addEventListener('click', openSqlModal);
    if (els.btnCloseSqlModal) els.btnCloseSqlModal.addEventListener('click', closeSqlModal);
    if (els.btnCopySql) els.btnCopySql.addEventListener('click', handleCopySql);
    if (els.btnToggleKeyVisibility && els.inputSupabaseKey) {
      els.btnToggleKeyVisibility.addEventListener('click', () => {
        const isPassword = els.inputSupabaseKey.getAttribute('type') === 'password';
        els.inputSupabaseKey.setAttribute('type', isPassword ? 'text' : 'password');
      });
    }

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
    if (els.supabaseModal) {
      els.supabaseModal.addEventListener('click', (e) => {
        if (e.target === els.supabaseModal) closeSupabaseModal();
      });
    }
    if (els.supabaseSqlModal) {
      els.supabaseSqlModal.addEventListener('click', (e) => {
        if (e.target === els.supabaseSqlModal) closeSqlModal();
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
        if (els.supabaseModal && els.supabaseModal.classList.contains('is-open')) {
          closeSupabaseModal();
        }
        if (els.supabaseSqlModal && els.supabaseSqlModal.classList.contains('is-open')) {
          closeSqlModal();
        }
      }
    });
  }

})();
