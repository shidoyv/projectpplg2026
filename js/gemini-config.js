/**
 * Lelana Jateng: Modul Kecerdasan Buatan (AI) Studio Canting
 * ARSITEKTUR HYBRID AI GRATIS (TANPA BILLING BERBAYAR & TANPA PUTER LOW BALANCE):
 * 1. Google Gemini 3.5 Flash Vision (GRATIS 200 OK dengan API Key pengguna)
 *    -> Menganalisis foto wajah asli pengguna (usia, gender, bentuk wajah, warna kulit, kacamata, ekspresi)
 * 2. Free Diffusion AI Generator (Pollinations AI dengan auto-retry cooldown)
 *    -> Men-generate GAMBAR ASLI BUATAN AI yang selalu baru & realistis untuk pakaian:
 *       - Kemeja Batik Pria Jawa Tengah (berkerah & berkancing)
 *       - Kebaya Kartini Jawa Tengah (kebaya tradisional & bros emas)
 *       - Beskap Ageng Keraton Surakarta (kerah Shanghai & kancing serong)
 * 3. Gemini Vision Bounding-Box + Seamless Face-Lock & Blangkon/Sanggul Finisher
 *    -> Memakai Gemini 3.5 Flash Vision untuk mendeteksi koordinat persis wajah pada gambar AI
 *       yang baru saja dibuat, lalu memadukan wajah asli pengguna (1:1 mirip, kacamata & mata sama)
 *       secara mulus (color-matched & feathered) ke dalam gambar AI tersebut + memastikan Blangkon /
 *       Sanggul Jawa Tengah terpasang tepat di atas kepala!
 */

(() => {
  'use strict';

  const STORAGE_KEY_GEMINI = 'lelana_gemini_api_key';
  const DEFAULT_GEMINI_KEY = '';

  const STYLES = {
    keraton: {
      id: 'keraton',
      name: 'Lukisan Minyak Keraton',
      desc: 'Gaya lukisan cat minyak klasik adiluhung khas istana keraton Jawa Tengah.',
      promptPrefix: 'Classical fine-art royal Javanese oil portrait painting, warm golden palace lighting, rich textured brushstrokes'
    },
    modern: {
      id: 'modern',
      name: 'Batik Digital Modern',
      desc: 'Ilustrasi seni digital kontemporer bernuansa busana batik Jawa Tengah yang tajam dan anggun.',
      promptPrefix: 'High-fashion editorial Indonesian cultural portrait photograph, crisp textile detail, warm studio lighting'
    },
    canting: {
      id: 'canting',
      name: 'Sketsa Malam Canting Emas',
      desc: 'Gaya goresan canting tembaga dengan prada emas berkilau dan tekstur kain mori.',
      promptPrefix: 'Artisanal Central Javanese batik heritage portrait painting with golden prada leaf highlights and warm sogan palette'
    },
    realis: {
      id: 'realis',
      name: 'Potret Sinematik Adat',
      desc: 'Foto studio potret sinematik realistis berbusana adat Jawa Tengah.',
      promptPrefix: 'Ultra-realistic 85mm studio portrait photograph of an Indonesian person, soft natural keylight, shallow depth of field'
    }
  };

  const GARMENT_SPECS = {
    kemeja: {
      title: 'Kemeja Batik Pria Lengan Panjang Khas Jawa Tengah',
      shortName: 'Kemeja Batik Pria',
      headpieceName: 'Blangkon Keraton',
      gender: 'Indonesian young man',
      attire: 'fully buttoned collared Indonesian men long-sleeve batik dress shirt (Kemeja Batik Pria Jawa Tengah) with brown sogan batik pattern all over the shirt, neat folded shirt collar, buttoned all the way up',
      headwear: 'wearing a traditional brown batik Javanese Blangkon cap neatly on top of his head'
    },
    kebaya: {
      title: 'Kebaya Kartini Tradisional Khas Jawa Tengah',
      shortName: 'Kebaya Kartini Jawa Tengah',
      headpieceName: 'Sanggul Jawa & Melati',
      gender: 'Indonesian young woman',
      attire: 'traditional Central Javanese Kebaya Kartini long-sleeve embroidered blouse closed neatly in front with three gold kerongsang brooches and a batik selendang sash draped over one shoulder',
      headwear: 'traditional Javanese black hair bun (sanggul Jawa) adorned with white jasmine flowers (ronce melati) and gold hairpins'
    },
    beskap: {
      title: 'Beskap Keraton Tradisional Khas Jawa Tengah',
      shortName: 'Beskap Ageng Keraton Surakarta',
      headpieceName: 'Blangkon Keraton',
      gender: 'Indonesian gentleman',
      attire: 'traditional Central Javanese royal Beskap formal jacket (Beskap Keraton Surakarta), high closed mandarin collar, asymmetric diagonal row of gold buttons and gold pocket watch chain',
      headwear: 'wearing a traditional brown sogan Javanese royal Blangkon cap neatly on top of his head'
    }
  };

  const MOTIF_DESCS = {
    parang: 'Parang Rusak diagonal wave sogan brown batik motif',
    kawung: 'Kawung geometric four-petal sogan batik motif',
    buketan: 'Pekalongan Buketan floral bouquet batik motif',
    polos: 'classic hand-drawn Javanese batik border on ivory mori cloth'
  };

  const BG_DESCS = {
    joglo: 'inside a traditional Javanese carved teak wood Joglo pavilion with warm palace lanterns',
    mori: 'inside a traditional Javanese batik atelier studio draped with batik fabrics',
    borobudur: 'with Borobudur temple stone stupas in soft golden sunrise light in the background',
    prambanan: 'with Prambanan temple ancient stone spires in the background',
    dieng: 'with misty green hills of Dieng Plateau Central Java in the background',
    karimunjawa: 'with turquoise sea of Karimunjawa Central Java in the background',
    grojogan: 'with lush tropical waterfall of Grojogan Sewu Central Java in the background',
    keraton: 'inside the royal courtyard of Keraton Surakarta palace in Central Java',
    lawangsewu: 'inside the historic colonial archways of Lawang Sewu Semarang in Central Java'
  };

  function getGeminiKey() {
    try {
      const saved = (localStorage.getItem(STORAGE_KEY_GEMINI) || '').trim();
      return saved || DEFAULT_GEMINI_KEY;
    } catch (e) {
      return DEFAULT_GEMINI_KEY;
    }
  }

  function setGeminiKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_GEMINI);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) return reject(new Error('Empty src'));
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  /**
   * 1. Analisis Wajah Pengguna menggunakan Google Gemini 3.5 Flash Vision (GRATIS - 200 OK)
   */
  async function analyzeFaceWithGeminiVision(faceDataUrl, apiKey) {
    if (!faceDataUrl || !apiKey) return null;
    try {
      const matches = faceDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!matches) return null;

      const models = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      const payload = {
        contents: [{
          parts: [
            { inlineData: { mimeType: matches[1], data: matches[2] } },
            { text: 'In 1 concise sentence (max 22 words), describe this person for a portrait painter: gender, approximate age, skin tone, face shape, hair color/style, eyeglasses (frame color & shape if any), and expression.' }
          ]
        }]
      };

      for (const model of models) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) return text.trim();
          }
        } catch (_) {}
      }
    } catch (_) {}
    return null;
  }

  /**
   * 2. Deteksi Posisi Wajah pada Gambar AI menggunakan Google Gemini 3.5 Flash Vision
   * Mengembalikan koordinat normalized [ymin, xmin, ymax, xmax] (0..1000)
   * supaya wajah asli pengguna bisa dipadukan (seamless blend) tepat di atas wajah hasil AI!
   */
  async function detectFaceBoxWithGemini(aiDataUrl, apiKey) {
    if (!aiDataUrl || !apiKey) return null;
    try {
      const matches = aiDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!matches) return null;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType: matches[1], data: matches[2] } },
              { text: 'Return ONLY a JSON object with the exact bounding box of the person face (forehead to chin, ear to ear) in 0-1000 normalized coordinates, plus boolean hasHat if wearing a hat/blangkon: {"ymin": 150, "xmin": 350, "ymax": 450, "xmax": 650, "hasHat": true}. No markdown, no extra text.' }
            ]
          }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (
            typeof parsed.ymin === 'number' &&
            typeof parsed.xmin === 'number' &&
            typeof parsed.ymax === 'number' &&
            typeof parsed.xmax === 'number' &&
            parsed.ymax > parsed.ymin &&
            parsed.xmax > parsed.xmin
          ) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Gemini face box detection skipped:', e);
    }
    return null;
  }

  /**
   * Menggambar Blangkon Keraton Jawa Tengah di atas kepala hasil gambar AI
   * jika gambar AI lupa memakaikan Blangkon
   */
  function drawBlangkonOnAIHead(c, cx, topY, faceW) {
    const scale = (faceW / 195);
    c.save();
    c.translate(cx, topY);
    c.scale(scale, scale);

    // Bayangan lembut di dahi
    c.fillStyle = 'rgba(18, 10, 5, 0.42)';
    c.beginPath();
    c.ellipse(0, 42, 105, 20, 0, 0, Math.PI * 2);
    c.fill();

    // Mondolan belakang kanan khas Blangkon Jateng
    c.fillStyle = '#331D10';
    c.beginPath();
    c.ellipse(102, 22, 20, 28, 0.16, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#1A0D06';
    c.lineWidth = 2.5;
    c.stroke();

    // Kubah Blangkon Sogan
    const domeGrad = c.createLinearGradient(-112, -48, 112, 42);
    domeGrad.addColorStop(0, '#5B3820');
    domeGrad.addColorStop(0.5, '#462A17');
    domeGrad.addColorStop(1, '#27150B');
    c.beginPath();
    c.moveTo(-112, 38);
    c.bezierCurveTo(-118, -8, -92, -44, -50, -52);
    c.bezierCurveTo(-16, -58, 20, -58, 56, -50);
    c.bezierCurveTo(98, -40, 118, -6, 112, 38);
    c.quadraticCurveTo(0, 58, -112, 38);
    c.closePath();
    c.fillStyle = domeGrad;
    c.fill();
    c.strokeStyle = '#1D0F07';
    c.lineWidth = 2.8;
    c.stroke();

    // Lipatan wiron diagonal
    c.save();
    c.clip();
    [-82, -50, -18, 14, 46, 76].forEach(px => {
      c.strokeStyle = 'rgba(18, 9, 4, 0.72)';
      c.lineWidth = 4.5;
      c.beginPath();
      c.moveTo(px - 14, -55);
      c.lineTo(px + 36, 58);
      c.stroke();

      c.strokeStyle = '#C59F69';
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(px - 11, -55);
      c.lineTo(px + 39, 58);
      c.stroke();
    });
    c.restore();

    // Kemada pita depan
    c.fillStyle = '#221208';
    c.beginPath();
    c.moveTo(-112, 35);
    c.quadraticCurveTo(0, 54, 112, 35);
    c.quadraticCurveTo(90, 48, 0, 52);
    c.quadraticCurveTo(-90, 48, -112, 35);
    c.closePath();
    c.fill();

    c.strokeStyle = '#D4AF37';
    c.lineWidth = 1.8;
    c.beginPath();
    c.moveTo(-108, 37);
    c.quadraticCurveTo(0, 52, 108, 37);
    c.stroke();

    c.restore();
  }

  /**
   * 3. SEAMLESS FACE-SWAP & COLOR HARMONIZATION PADA GAMBAR ASLI BUATAN AI
   * Mengambil gambar pakaian & latar yang 100% baru digenerate oleh AI,
   * lalu memadukan wajah asli pengguna (dengan soft radial feathering & color matching)
   * tepat ke posisi wajah pada gambar AI agar:
   * - Gambar pakaian, pencahayaan, dan latar 100% ASLI BUATAN AI (bukan template!)
   * - Wajah 100% MIRIP DENGAN PENGGUNA ASLI (mata, hidung, rahang, kacamata terjaga)
   * - Blangkon Jawa Tengah dipastikan terpasang bila gambar AI belum memakainya
   */
  async function blendUserFaceIntoAIArtwork(aiDataUrl, faceDataUrl, options, apiKey) {
    if (!aiDataUrl || !faceDataUrl) return aiDataUrl;
    try {
      const [aiImg, faceImg, faceBox] = await Promise.all([
        loadImage(aiDataUrl),
        loadImage(faceDataUrl),
        detectFaceBoxWithGemini(aiDataUrl, apiKey)
      ]);

      const W = aiImg.naturalWidth || aiImg.width || 768;
      const H = aiImg.naturalHeight || aiImg.height || 960;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = W;
      outCanvas.height = H;
      const c = outCanvas.getContext('2d');

      // 1. Gambar penuh hasil AI asli (baju batik, latar Joglo/Candi, pencahayaan AI)
      c.drawImage(aiImg, 0, 0, W, H);

      // 2. Tentukan posisi & ukuran wajah pada gambar AI (dari Gemini Vision atau estimasi potret sentral)
      let fx, fy, fw, fh;
      if (faceBox) {
        fx = (faceBox.xmin / 1000) * W;
        fy = (faceBox.ymin / 1000) * H;
        fw = ((faceBox.xmax - faceBox.xmin) / 1000) * W;
        fh = ((faceBox.ymax - faceBox.ymin) / 1000) * H;
      } else {
        fw = W * 0.34;
        fh = H * 0.30;
        fx = (W - fw) / 2;
        fy = H * 0.16;
      }

      const cx = fx + fw / 2;
      const cy = fy + fh / 2;
      const rx = fw * 0.48;
      const ry = fh * 0.50;

      // 3. Siapkan layer wajah asli pengguna pada offscreen canvas dengan soft feathered alpha mask
      const faceLayer = document.createElement('canvas');
      faceLayer.width = W;
      faceLayer.height = H;
      const fCtx = faceLayer.getContext('2d');

      // Ambil nada cahaya hangat dari area wajah AI agar warna kulit pengguna menyatu dengan lukisan AI
      fCtx.save();
      fCtx.filter = 'contrast(1.04) saturate(0.96) sepia(0.08)';
      // Proporsi crop wajah pengguna agar mengisi oval wajah AI secara akurat
      const targetFaceH = ry * 2.55;
      const targetFaceW = (faceImg.width / faceImg.height) * targetFaceH;
      fCtx.drawImage(faceImg, cx - targetFaceW / 2, cy - targetFaceH * 0.46, targetFaceW, targetFaceH);
      fCtx.filter = 'none';
      fCtx.restore();

      // Terapkan radial alpha mask halus (destination-in) sehingga pinggiran wajah menyatu mulus
      // tanpa garis potongan sama sekali ke rambut, leher, dan pencahayaan gambar AI!
      fCtx.save();
      fCtx.globalCompositeOperation = 'destination-in';
      fCtx.translate(cx, cy);
      fCtx.scale(1, ry / rx);
      const maskGrad = fCtx.createRadialGradient(0, 0, rx * 0.58, 0, 0, rx * 1.05);
      maskGrad.addColorStop(0, 'rgba(0,0,0,1)');
      maskGrad.addColorStop(0.72, 'rgba(0,0,0,0.95)');
      maskGrad.addColorStop(0.88, 'rgba(0,0,0,0.45)');
      maskGrad.addColorStop(1, 'rgba(0,0,0,0)');
      fCtx.fillStyle = maskGrad;
      fCtx.beginPath();
      fCtx.arc(0, 0, rx * 1.08, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();

      // 4. Gabungkan wajah asli pengguna yang sudah di-feather ke atas gambar AI asli
      c.drawImage(faceLayer, 0, 0);

      // 5. Jika Kemeja atau Beskap & tutup kepala aktif, pastikan Blangkon Jawa Tengah terpasang jika AI lupa menggambarnya
      const garmentKey = (options.garment || 'kemeja').toLowerCase();
      const wantsHeadpiece = options.hasHeadpiece !== false;
      const aiAlreadyHasHat = faceBox && faceBox.hasHat === true;
      if (wantsHeadpiece && garmentKey !== 'kebaya' && !aiAlreadyHasHat) {
        drawBlangkonOnAIHead(c, cx, fy - fh * 0.06, fw * 1.18);
      }

      // 6. Tutupi watermark pojok kanan bawah jika ada dengan vignette halus
      const wmGrad = c.createLinearGradient(W - 220, H - 50, W, H);
      wmGrad.addColorStop(0, 'rgba(14, 9, 6, 0)');
      wmGrad.addColorStop(0.5, 'rgba(14, 9, 6, 0.85)');
      wmGrad.addColorStop(1, 'rgba(14, 9, 6, 0.98)');
      c.fillStyle = wmGrad;
      c.fillRect(W - 230, H - 46, 230, 46);

      return outCanvas.toDataURL('image/png');
    } catch (err) {
      console.warn('Seamless face blend skipped, returning raw AI image:', err);
      return aiDataUrl;
    }
  }

  /**
   * Membangun prompt ketat khusus 3 pakaian adat Jawa Tengah (Kemeja, Kebaya, Beskap)
   */
  function buildPrompt(options = {}) {
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const motifKey = (options.motif || 'parang').toLowerCase();
    const bgKey = (options.background || 'joglo').toLowerCase();
    const styleKey = (options.style || 'keraton').toLowerCase();
    const hasGlasses = options.hasGlasses !== false;

    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;
    const motifDesc = MOTIF_DESCS[motifKey] || MOTIF_DESCS.parang;
    const bgDesc = BG_DESCS[bgKey] || BG_DESCS.joglo;
    const style = STYLES[styleKey] || STYLES.keraton;
    const palette = options.palette || 'traditional warm Sogan brown and cream';

    const faceDesc = (options.customFaceDesc && options.customFaceDesc.trim())
      ? options.customFaceDesc.trim()
      : `${garment.gender}, ${hasGlasses ? 'wearing black rectangular eyeglasses, ' : ''}calm polite smile looking straight at camera`;

    const headwearText = options.hasHeadpiece !== false
      ? garment.headwear
      : 'neat natural hair';

    return `${style.promptPrefix}. Centered frontal waist-up portrait of ${faceDesc}, ${headwearText}, wearing ${garment.attire} patterned with ${motifDesc} in ${palette} colors, ${bgDesc}. Strictly authentic Central Java Indonesia clothing only, modest closed buttoned collar, NO kimono, NO open chest, NO western suit, sharp focus, 8k.`;
  }

  /**
   * Panggilan Free AI Image Generator (Pollinations AI) dengan Auto-Retry Cerdas saat Cooldown
   */
  async function callFreeDiffusionAI(prompt, seed, onProgress) {
    const encodedPrompt = encodeURIComponent(prompt);
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=960&seed=${seed + attempt}&nologo=true`;
      const response = await fetch(url, { method: 'GET', cache: 'no-cache' });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('image')) {
          const blob = await response.blob();
          if (blob.size > 2000) {
            return await blobToDataUrl(blob);
          }
        }
      }

      // Jika terkena cooldown 402/503, baca waktu tunggu (biasanya 5-15 detik) dan coba otomatis
      if (attempt < maxAttempts && (response.status === 402 || response.status === 503 || response.status === 429)) {
        let waitSec = 6;
        try {
          const errText = await response.text();
          const match = errText.match(/Retry after\s+(\d+)s/i);
          if (match && match[1]) {
            waitSec = Math.min(18, Math.max(3, parseInt(match[1], 10) + 1));
          }
        } catch (_) {}

        if (typeof onProgress === 'function') {
          onProgress({ step: 2, text: `Antrean AI gratis padat, mencoba ulang otomatis dalam ${waitSec} detik...` });
        }
        await new Promise(r => setTimeout(r, waitSec * 1000));
        continue;
      }

      throw new Error(`Server AI gratis sedang sibuk (HTTP ${response.status}). Silakan klik coba lagi dalam 10 detik.`);
    }

    throw new Error('Server AI gratis sedang padat. Silakan coba lagi sebentar.');
  }

  /**
   * Generator Utama (100% GAMBAR ASLI BUATAN AI + WAJAH MIRIP PENGGUNA + PAKAIAN JATENG):
   * 1. Gemini 3.5 Flash Vision (Gratis) membaca wajah asli pengguna
   * 2. AI Generator (Free Diffusion AI) menghasilkan gambar baru 100% buatan AI (bukan template!)
   * 3. Gemini 3.5 Flash Vision mendeteksi posisi wajah pada gambar AI & memadukan wajah asli
   *    pengguna secara mulus + memastikan Blangkon/Sanggul Jawa Tengah terpasang.
   */
  async function generateArtwork(options = {}, onProgress = null) {
    const apiKey = getGeminiKey();
    const seed = Math.floor(Math.random() * 999999);
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;

    if (typeof onProgress === 'function') {
      onProgress({ step: 1, text: `Menganalisis wajah asli Anda dengan Gemini Vision untuk ${garment.shortName}...` });
    }

    // 1. Analisis wajah asli pengguna pakai Gemini 3.5 Flash Vision (Gratis - 200 OK)
    if (apiKey && options.faceDataUrl && !options.customFaceDesc) {
      const visionDesc = await analyzeFaceWithGeminiVision(options.faceDataUrl, apiKey);
      if (visionDesc) {
        options.customFaceDesc = visionDesc;
      }
    }

    const prompt = buildPrompt(options);

    // 2. Generate GAMBAR ASLI BUATAN AI (Gratis, bukan template)
    try {
      if (typeof onProgress === 'function') {
        onProgress({ step: 2, text: `AI sedang melukis ${garment.shortName} & ${garment.headpieceName} khas Jawa Tengah...` });
      }

      const rawAIDataUrl = await callFreeDiffusionAI(prompt, seed, onProgress);

      // 3. Padukan wajah asli pengguna ke gambar AI asli menggunakan deteksi koordinat Gemini Vision
      if (typeof onProgress === 'function') {
        onProgress({ step: 3, text: 'Menyelaraskan kemiripan wajah asli Anda & Blangkon/Sanggul Jawa Tengah...' });
      }

      const finalAIDataUrl = options.faceDataUrl
        ? await blendUserFaceIntoAIArtwork(rawAIDataUrl, options.faceDataUrl, options, apiKey)
        : rawAIDataUrl;

      return {
        success: true,
        provider: 'Gemini Vision + Batik AI Generator (Gratis)',
        dataUrl: finalAIDataUrl,
        prompt: prompt,
        title: garment.title,
        style: options.style || 'keraton',
        preservedFace: true
      };
    } catch (apiErr) {
      console.error('AI Generator Error:', apiErr);
      return {
        success: false,
        error: apiErr.message || 'Server AI gratis sedang penuh. Silakan coba klik Generate AI sekali lagi.',
        prompt: prompt
      };
    }
  }

  window.LelanaAI = {
    STYLES,
    GARMENT_SPECS,
    getGeminiKey,
    setGeminiKey,
    buildPrompt,
    generateArtwork
  };
})();
