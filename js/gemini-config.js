/**
 * Lelana Jateng: Modul Kecerdasan Buatan (AI) Studio Canting
 * ARSITEKTUR IMAGE-TO-IMAGE (CANVAS 2D + FOTO WAJAH -> FOTO ASLI REALISTIS):
 * - Menggunakan NVIDIA NIM API: Black Forest Labs `flux-3-image-klein` (Mode: Image Editing)
 * - Mengirim gambar komposit utuh dari kanvas Studio Canting (latar destinasi + baju batik/coretan
 *   canting pengguna + pose + blangkon/sanggul + foto wajah asli pengguna) ke proxy lokal `server.js`
 *   (`/api/nvidia-image-edit`) agar bebas CORS dan API Key aman di `.env` (gitignored).
 */

(() => {
  'use strict';

  const STORAGE_KEY_HF = 'lelana_hf_token';
  const STORAGE_KEY_NVIDIA = 'lelana_nvidia_api_key';
  const STORAGE_KEY_GEMINI = 'lelana_gemini_api_key';

  const STYLES = {
    realis: {
      id: 'realis',
      name: 'Foto Asli Realistis',
      desc: 'Mengubah ilustrasi kanvas 2D menjadi foto manusia asli yang menyatu alami dengan latar dan wajah Anda.',
      promptPrefix: 'Ultra-realistic 85mm DSLR photograph of a real Indonesian person standing naturally in this exact scene, natural camera lighting, authentic fabric texture, crisp skin detail, photorealistic'
    },
    keraton: {
      id: 'keraton',
      name: 'Potret Realistis Keraton',
      desc: 'Foto potret sinematik hangat bernuansa adiluhung khas keraton Jawa Tengah.',
      promptPrefix: 'Ultra-realistic cinematic editorial photograph of a real Indonesian person standing naturally in this exact scene, warm golden heritage lighting, natural realistic shadows, fine batik fabric weave, photorealistic'
    },
    modern: {
      id: 'modern',
      name: 'Editorial Batik Modern',
      desc: 'Foto majalah fesyen budaya Indonesia yang tajam dan anggun.',
      promptPrefix: 'High-fashion editorial portrait photograph of a real Indonesian person in this exact scene, crisp natural daylight, lifelike cotton batik texture, realistic human anatomy and proportions'
    },
    canting: {
      id: 'canting',
      name: 'Lukisan Seni Adiluhung',
      desc: 'Sentuhan foto-lukisan klasik Jawa Tengah dengan nuansa sogan hangat.',
      promptPrefix: 'Photorealistic fine-art Javanese heritage portrait photograph with warm sogan tones, natural human skin and realistic woven batik garment texture'
    }
  };

  const GARMENT_SPECS = {
    kemeja: {
      title: 'Kemeja Batik Pria Khas Jawa Tengah',
      shortName: 'Kemeja Batik Pria',
      headpieceName: 'Blangkon Keraton',
      attire: 'authentic real-life Indonesian men collared buttoned batik shirt (Kemeja Batik Pria Jawa Tengah) with natural cotton folds and real buttons, paired with tailored dark formal trousers and polished shoes',
      headwear: 'authentic woven brown batik Javanese Blangkon cap resting naturally on the head'
    },
    kebaya: {
      title: 'Kebaya Kartini Tradisional Khas Jawa Tengah',
      shortName: 'Kebaya Kartini Jawa Tengah',
      headpieceName: 'Sanggul Jawa & Melati',
      attire: 'authentic real-life Central Javanese Kebaya Kartini traditional embroidered blouse with natural fabric drape, gold kerongsang brooches, and traditional wrapped batik kain jarik skirt',
      headwear: 'authentic traditional Javanese black hair bun (sanggul Jawa) adorned with fresh white jasmine flowers (ronce melati)'
    },
    beskap: {
      title: 'Beskap Keraton Tradisional Khas Jawa Tengah',
      shortName: 'Beskap Ageng Keraton Surakarta',
      headpieceName: 'Blangkon Keraton',
      attire: 'authentic real-life Central Javanese royal Beskap formal jacket (Beskap Keraton Surakarta) with mandarin collar, asymmetric gold buttons, and traditional batik kain jarik wrap',
      headwear: 'authentic woven sogan batik Javanese royal Blangkon cap resting naturally on the head'
    }
  };

  const MOTIF_DESCS = {
    parang: 'Parang Rusak diagonal batik motif',
    kawung: 'Kawung geometric four-petal batik motif',
    buketan: 'Pekalongan Buketan floral batik motif',
    polos: 'custom hand-drawn canting batik pattern'
  };

  const BG_DESCS = {
    joglo: 'traditional Javanese carved teak wood Joglo pavilion interior',
    mori: 'traditional Javanese batik atelier studio',
    borobudur: 'Borobudur temple stone stupas in Central Java',
    prambanan: 'Prambanan temple ancient stone spires',
    dieng: 'misty green hills of Dieng Plateau Central Java',
    karimunjawa: 'turquoise tropical beach of Karimunjawa Central Java',
    grojogan: 'lush tropical waterfall of Grojogan Sewu Central Java',
    keraton: 'royal courtyard of Keraton Surakarta palace',
    lawangsewu: 'historic colonial archways of Lawang Sewu Semarang'
  };

  function getHfToken() {
    try {
      return (localStorage.getItem(STORAGE_KEY_HF) || '').trim();
    } catch (e) {
      return '';
    }
  }

  function setHfToken(token) {
    try {
      if (token && token.trim()) {
        localStorage.setItem(STORAGE_KEY_HF, token.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_HF);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getNvidiaKey() {
    try {
      return (localStorage.getItem(STORAGE_KEY_NVIDIA) || '').trim();
    } catch (e) {
      return '';
    }
  }

  function setNvidiaKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem(STORAGE_KEY_NVIDIA, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_NVIDIA);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getGeminiKey() {
    try {
      return (localStorage.getItem(STORAGE_KEY_GEMINI) || '').trim();
    } catch (e) {
      return '';
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

  /**
   * Membangun prompt Image Editing untuk mengubah ilustrasi kanvas 2D + foto wajah
   * menjadi foto manusia asli yang realistis sambil mempertahankan wajah, motif batik, dan latar.
   */
  function buildPrompt(options = {}) {
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const motifKey = (options.motif || 'parang').toLowerCase();
    const bgKey = (options.background || 'joglo').toLowerCase();
    const styleKey = (options.style || 'keraton').toLowerCase();

    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;
    const motifDesc = MOTIF_DESCS[motifKey] || MOTIF_DESCS.parang;
    const bgDesc = BG_DESCS[bgKey] || BG_DESCS.joglo;
    const style = STYLES[styleKey] || STYLES.keraton;
    const palette = options.palette || 'traditional warm Sogan brown and cream';

    const headwearText = options.hasHeadpiece !== false
      ? `wearing ${garment.headwear}`
      : 'with natural neat hair without hat';

    return [
      `${style.promptPrefix}.`,
      'Transform the flat 2D illustrated body, arms, hands, clothing, and headpiece in this input image into a completely real, lifelike human person standing naturally in the exact same room and position.',
      'CRITICAL FACE PRESERVATION: Strictly keep the exact real human face, identity, eyes, eyebrows, nose, mouth, jawline, skin tone, eyeglasses (if any), and expression from the person head in the input image, blending the neck and lighting naturally onto a real human body.',
      `CLOTHING & BATIK PRESERVATION: Replace the flat 2D drawing with ${garment.attire}, ${headwearText}, strictly preserving the exact ${motifDesc} and every hand-drawn batik pattern and color (${palette}) visible on the shirt in the input image, now rendered as real woven cotton batik cloth with realistic wrinkles, seams, and natural shadows.`,
      `Keep the exact same ${bgDesc} background, lighting direction, and respectful standing pose. Remove all black 2D cartoon outlines, remove any circular frame border around the face, and make the entire image look like a genuine real camera photograph.`
    ].join(' ');
  }

  function buildMultiImagePrompt(options = {}) {
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const motifKey = (options.motif || 'parang').toLowerCase();
    const bgKey = (options.background || 'joglo').toLowerCase();
    const styleKey = (options.style || 'keraton').toLowerCase();

    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;
    const motifDesc = MOTIF_DESCS[motifKey] || MOTIF_DESCS.parang;
    const bgDesc = BG_DESCS[bgKey] || BG_DESCS.joglo;
    const style = STYLES[styleKey] || STYLES.keraton;
    const palette = options.palette || 'traditional warm Sogan brown and cream';

    const headwearText = options.hasHeadpiece !== false
      ? `wearing ${garment.headwear}`
      : 'with natural hair';

    return [
      `${style.promptPrefix}.`,
      'Replace the 2D illustrated character in image 1 with a real-life photograph of the EXACT person from image 2 standing in the exact same position inside image 1.',
      'STRICT IDENTITY LOCK: The person head, face, eyes, eyebrows, nose, lips, jawline, glasses, hairstyle, skin tone, age, and gender MUST be 100% identical to the real person in image 2.',
      `CLOTHING & BATIK: Dress the person from image 2 in ${garment.attire}, ${headwearText}, keeping the exact ${motifDesc} and hand-drawn batik colors (${palette}) shown on the garment in image 1, rendered as real woven batik fabric with natural folds and shadows.`,
      `Keep the exact ${bgDesc} background from image 1. Remove all 2D black outlines and circular face borders. Authentic DSLR camera photo.`
    ].join(' ');
  }

  /**
   * Menentukan daftar URL proxy lokal yang bisa dihubungi
   */
  function getProxyEndpoints() {
    const endpoints = [];
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      endpoints.push(`${window.location.origin}/api/hf-image-edit`);
    }
    if (!endpoints.includes('http://localhost:3000/api/hf-image-edit')) {
      endpoints.push('http://localhost:3000/api/hf-image-edit');
    }
    return endpoints;
  }

  /**
   * Memanggil Hugging Face Free Image Editing (Multi-Image Qwen-2511 + Neural Face-Lock)
   * melalui proxy `server.js`
   */
  async function callHuggingFaceImageEdit(canvasDataUrl, faceDataUrl, prompt, multiImagePrompt, seed, onProgress) {
    const customHfToken = getHfToken();
    const endpoints = getProxyEndpoints();
    let lastError = null;

    const payload = {
      prompt: prompt,
      multiImagePrompt: multiImagePrompt,
      image: canvasDataUrl,
      faceImage: faceDataUrl || null,
      seed: seed
    };
    if (customHfToken) {
      payload.hfToken = customHfToken;
    }

    for (const url of endpoints) {
      try {
        if (typeof onProgress === 'function') {
          onProgress({ step: 2, text: 'Mengubah kanvas menjadi foto asli & menyelaraskan wajah 1:1 (Hugging Face AI)...' });
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data && data.success && data.dataUrl) {
          return data;
        }

        if (res.status === 404 || res.status === 405) {
          lastError = new Error('Endpoint proxy tidak ditemukan di port ini, mencoba server lokal port 3000...');
          continue;
        }

        throw new Error((data && data.error) || `Server Hugging Face AI mengembalikan error HTTP ${res.status}`);
      } catch (err) {
        lastError = err;
        if (err instanceof TypeError || /Failed to fetch|NetworkError/i.test(err.message || '')) {
          continue;
        }
        throw err;
      }
    }

    throw new Error(
      (lastError && lastError.message && !/Failed to fetch/i.test(lastError.message))
        ? lastError.message
        : 'Server lokal `server.js` belum berjalan. Jalankan `node server.js` di terminal lalu buka http://localhost:3000/studio-canting.html'
    );
  }

  /**
   * Generator Utama Studio Canting:
   * Mengubah gambar komposit kanvas (latar + baju batik/coretan + foto wajah)
   * menjadi foto manusia asli yang realistis dengan kemiripan wajah 1:1.
   */
  async function generateArtwork(options = {}, onProgress = null) {
    const seed = Math.floor(Math.random() * 999999);
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;
    const sourceImage = options.canvasDataUrl || options.faceDataUrl;
    const faceImage = (options.faceDataUrl && String(options.faceDataUrl).startsWith('data:image/'))
      ? options.faceDataUrl
      : null;

    if (!sourceImage) {
      return {
        success: false,
        error: 'Gambar kanvas atau foto wajah belum tersedia. Silakan ambil foto terlebih dahulu.'
      };
    }

    if (typeof onProgress === 'function') {
      onProgress({ step: 1, text: `Menyiapkan kanvas ${garment.shortName} & foto wajah resolusi penuh Anda...` });
    }

    const prompt = buildPrompt(options);
    const multiImagePrompt = buildMultiImagePrompt(options);

    try {
      const result = await callHuggingFaceImageEdit(sourceImage, faceImage, prompt, multiImagePrompt, seed, onProgress);

      if (typeof onProgress === 'function') {
        onProgress({ step: 3, text: 'Menyempurnakan hasil foto realistis & kemiripan wajah asli Anda...' });
      }

      return {
        success: true,
        provider: result.provider || 'Hugging Face Gratis (Multi-Image + Face-Lock)',
        dataUrl: result.dataUrl,
        prompt: multiImagePrompt,
        title: garment.title,
        style: options.style || 'keraton',
        preservedFace: true
      };
    } catch (apiErr) {
      console.error('Hugging Face AI Generator Error:', apiErr);
      return {
        success: false,
        error: apiErr.message || 'Gagal menghasilkan foto AI. Pastikan server.js berjalan.',
        prompt: multiImagePrompt
      };
    }
  }

  window.LelanaAI = {
    STYLES,
    GARMENT_SPECS,
    getHfToken,
    setHfToken,
    getNvidiaKey,
    setNvidiaKey,
    getGeminiKey,
    setGeminiKey,
    buildPrompt,
    generateArtwork
  };
})();
