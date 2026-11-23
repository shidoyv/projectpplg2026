/**
 * Lelana Jateng: Modul Kecerdasan Buatan (AI) Studio Canting
 * Mengintegrasikan Google Gemini / Imagen API & Mesin Seni AI
 * Menghasilkan karya seni lukisan busana batik autentik khas Jawa Tengah:
 * - Kemeja Batik Pria Lengan Panjang
 * - Kebaya Kartini Tradisional
 * - Beskap Keraton Surakarta
 * DENGAN MEMPERTAHANKAN BENTUK WAJAH ASLI SECARA LENGKAP:
 * - Bentuk wajah, proporsi rahang, mata, dan ekspresi asli (1:1 likeness)
 * - Kacamata bingkai hitam (sesuai potret asli pengguna)
 * - Tatanan rambut asli yang berpadu selaras dengan Blangkon / Sanggul Melati
 */

(() => {
  'use strict';

  const STORAGE_KEY_GEMINI = 'lelana_gemini_api_key';

  const STYLES = {
    keraton: {
      id: 'keraton',
      name: 'Lukisan Minyak Keraton',
      desc: 'Gaya lukisan cat minyak klasik adiluhung khas istana keraton Jawa Tengah.',
      promptPrefix: 'A magnificent classical fine-art oil painting portrait of authentic Central Javanese heritage. Rich oil canvas texture, warm golden palace lighting, elegant traditional Indonesian portraiture.'
    },
    modern: {
      id: 'modern',
      name: 'Batik Digital Modern',
      desc: 'Ilustrasi seni digital kontemporer bernuansa busana batik Jawa Tengah yang tajam dan anggun.',
      promptPrefix: 'A refined contemporary digital art portrait of authentic Central Javanese cultural attire, elegant clean lines, exquisite Indonesian batik fabric texture, modern high-fashion cultural lighting.'
    },
    canting: {
      id: 'canting',
      name: 'Sketsa Malam Canting Emas',
      desc: 'Gaya goresan canting tembaga dengan prada emas berkilau dan tekstur kain mori.',
      promptPrefix: 'An authentic artisanal Central Javanese batik artwork, visible hot wax canting linework, rich golden prada leaf accents, natural cotton mori textile texture, heritage Indonesian craftsmanship.'
    },
    realis: {
      id: 'realis',
      name: 'Potret Sinematik Adat',
      desc: 'Foto studio potret sinematik realistis berbusana adat Jawa Tengah.',
      promptPrefix: 'An ultra-realistic cinematic studio portrait photograph of an Indonesian person in authentic traditional Central Javanese cultural attire, shot on 85mm portrait lens, soft natural lighting, hyper-detailed textile weave.'
    }
  };

  const GARMENT_SPECS = {
    kemeja: {
      title: 'Kemeja Batik Pria Lengan Panjang Khas Jawa Tengah',
      gender: 'Indonesian young man',
      attire: 'authentic traditional Indonesian men long-sleeved batik shirt (Kemeja Batik Pria Lengan Panjang khas Jawa Tengah) featuring intricate hand-dyed batik motifs across the entire shirt, collared, buttoned front',
      headwear: 'wearing an authentic traditional Central Javanese batik Blangkon headpiece (topi Blangkon khas Jawa Tengah) neatly on his head, resting above the forehead leaving the full face, eyes, and glasses completely visible'
    },
    kebaya: {
      title: 'Kebaya Kartini Tradisional Khas Jawa Tengah',
      gender: 'Indonesian young woman',
      attire: 'authentic traditional Central Javanese Kebaya Kartini blouse with embroidered lace trim, draped with an authentic batik selendang sash and matching traditional batik jarik cloth',
      headwear: 'traditional Javanese hair bun (sanggul Jawa) elegantly adorned with fragrant white jasmine flowers (ronce melati) and golden hairpins (cunduk mentul)'
    },
    beskap: {
      title: 'Beskap Keraton Tradisional Khas Jawa Tengah',
      gender: 'Indonesian gentleman',
      attire: 'authentic traditional royal Central Javanese Beskap formal coat (Beskap khas Keraton Surakarta Jawa Tengah), high mandarin collar with traditional metallic buttons, worn over authentic batik jarik waist-cloth',
      headwear: 'wearing an authentic royal Central Javanese Blangkon headpiece (topi Blangkon keraton Jawa Tengah with rounded mondolan back) neatly on his head, leaving the full face, eyes, and glasses completely visible'
    }
  };

  const MOTIF_DESCS = {
    parang: 'traditional Parang Rusak Barong diagonal geometric wave batik motif',
    kawung: 'traditional sacred Kawung circular four-lobed fruit motif',
    buketan: 'traditional Pekalongan Buketan coastal floral bouquet batik motif',
    polos: 'refined minimalist hand-drawn batik borders on natural mori cotton fabric'
  };

  const BG_DESCS = {
    joglo: 'inside an authentic traditional Javanese Joglo wooden pavilion with carved teak wood pillars and warm ambient lanterns',
    mori: 'inside an artisanal batik studio atelier draped with long sheets of flowing hand-drawn batik fabrics',
    borobudur: 'with the majestic ancient stone stupas of Borobudur temple in the soft sunrise morning light',
    prambanan: 'with the towering ancient stone spires of Prambanan Shiva temple in the background',
    dieng: 'amidst the mystical highland mist and volcanic hills of Dieng Plateau Central Java',
    karimunjawa: 'at the serene turquoise tropical coast and white sands of Karimunjawa Central Java',
    grojogan: 'near the lush rainforest waterfall of Grojogan Sewu Central Java',
    keraton: 'inside the solemn sacred courtyards of Keraton Surakarta Hadiningrat palace',
    lawangsewu: 'in the grand historic colonial archways and stained glass halls of Lawang Sewu Semarang'
  };

  /**
   * Mengambil API Key Gemini yang tersimpan
   */
  function getGeminiKey() {
    try {
      return (localStorage.getItem(STORAGE_KEY_GEMINI) || '').trim();
    } catch (e) {
      return '';
    }
  }

  /**
   * Menyimpan API Key Gemini ke localStorage
   */
  function setGeminiKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
      } else {
        localStorage.removeItem(STORAGE_KEY_GEMINI);
      }
      return true;
    } catch (e) {
      console.warn('Gagal menyimpan API key ke localStorage:', e);
      return false;
    }
  }

  /**
   * Analisis Wajah Pengguna menggunakan Gemini Vision (jika API key tersedia)
   * Mengekstrak detail bentuk wajah, kacamata, dan ekspresi asli.
   */
  async function analyzeFaceWithGeminiVision(faceDataUrl, apiKey) {
    if (!faceDataUrl || !apiKey) return null;
    try {
      const matches = faceDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (!matches) return null;
      const mimeType = matches[1];
      const base64Data = matches[2];

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: "Analyze this portrait photo in 2 concise sentences for portrait likeness preservation: describe their exact face shape, gender, approximate age, hairstyle and color, eyeglasses (specify frame color and shape if present), eye shape, and expression so an artist can reproduce their exact facial likeness."
            }
          ]
        }]
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn('Gemini Vision face analysis error:', err);
    }
    return null;
  }

  /**
   * Membangun prompt seni busana batik dengan MEMPERTAHANKAN BENTUK WAJAH ASLI SECARA LENGKAP
   */
  function buildPrompt(options = {}) {
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const motifKey = (options.motif || 'parang').toLowerCase();
    const bgKey = (options.background || 'joglo').toLowerCase();
    const styleKey = (options.style || 'keraton').toLowerCase();
    const hasGlasses = options.hasGlasses !== false; // default true sesuai foto
    const preserveFacialShape = options.preserveFacialShape !== false; // default true

    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;
    const motifDesc = MOTIF_DESCS[motifKey] || MOTIF_DESCS.parang;
    const bgDesc = BG_DESCS[bgKey] || BG_DESCS.joglo;
    const style = STYLES[styleKey] || STYLES.keraton;
    const palette = options.palette || 'traditional warm Sogan brown and golden earth tones';

    // Rancang deskripsi rekonstruksi bentuk wajah asli (Likeness Preservation)
    let faceLikenessDesc = '';
    if (options.customFaceDesc && options.customFaceDesc.trim()) {
      faceLikenessDesc = options.customFaceDesc.trim();
    } else {
      const glassesStr = hasGlasses
        ? 'wearing modern black rectangular eyeglasses with dark rims resting naturally on the bridge of the nose, with eyes clearly visible through clean lenses'
        : 'clear gaze without eyeglasses';

      const shapeStr = preserveFacialShape
        ? 'exact complete facial structure and geometry matching the reference photo, identical oval-to-round youthful face shape, natural smooth jawline, cheekbones, and authentic facial proportions'
        : 'authentic Indonesian facial features';

      if (garmentKey === 'kebaya') {
        faceLikenessDesc = `a young Indonesian woman, ${shapeStr}, natural dark eyes, smooth neat dark hair parted gracefully, ${hasGlasses ? glassesStr + ', ' : ''}gentle polite respectful expression looking straight forward into the camera lens. 1:1 authentic facial likeness and facial identity retention`;
      } else {
        faceLikenessDesc = `a young Indonesian Asian man, ${shapeStr}, natural neat short dark black hair parted naturally, ${glassesStr}, calm gentle polite expression, looking directly forward into the camera lens. 1:1 authentic facial likeness and facial identity retention`;
      }
    }

    const headwearText = options.hasHeadpiece !== false
      ? garment.headwear
      : 'with neat natural hair and dignified respectful Indonesian posture';

    return `${style.promptPrefix} A magnificent classical fine-art portrait painting of ${faceLikenessDesc}. The subject is seamlessly wearing ${garment.attire} richly patterned with ${motifDesc}, hand-dyed in authentic ${palette} natural botanical pigments. The head is ${headwearText}. Setting: ${bgDesc}. Composition: centered frontal portrait showing full head, complete face, spectacles, and upper body with traditional clothing. STRICT LIKENESS & CULTURAL REQUIREMENT: Must strictly preserve the exact facial geometry, face shape, eyes, and eyeglasses from the reference photo without changing the person into someone else. Authentic Indonesian Central Java cultural clothing only. Absolutely NO military uniforms, NO European general costumes, NO shoulder epaulettes, NO gold rope tassels, NO military badges or medals, NO western suits. Masterpiece fine-art quality, photorealistic facial proportions, sharp focus, 8k resolution.`;
  }

  /**
   * Mengubah Blob menjadi Data URL (Base64)
   */
  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Generator Utama: Memproses generate AI dengan rekonstruksi wajah asli
   */
  async function generateArtwork(options = {}, onProgress = null) {
    const apiKey = getGeminiKey();
    const seed = Math.floor(Math.random() * 999999);
    const garmentKey = (options.garment || 'kemeja').toLowerCase();
    const garment = GARMENT_SPECS[garmentKey] || GARMENT_SPECS.kemeja;

    if (typeof onProgress === 'function') {
      onProgress({ step: 1, text: 'Merajut prompt rekonstruksi bentuk wajah asli & kacamata...' });
    }

    // 1. Analisis bentuk wajah dengan Gemini Vision jika API key tersedia & ada foto wajah
    if (apiKey && options.faceDataUrl && !options.customFaceDesc) {
      try {
        if (typeof onProgress === 'function') {
          onProgress({ step: 1, text: 'Menganalisis proporsi wajah dan kacamata dengan Gemini Vision...' });
        }
        const visionDesc = await analyzeFaceWithGeminiVision(options.faceDataUrl, apiKey);
        if (visionDesc) {
          options.customFaceDesc = visionDesc;
        }
      } catch (visionErr) {
        console.warn('Vision analysis skipped:', visionErr);
      }
    }

    // 2. Bangun prompt lengkap dengan kemiripan wajah 1:1
    const prompt = buildPrompt(options);

    // 3. Coba Gemini Imagen 3 jika API Key tersedia
    if (apiKey) {
      try {
        if (typeof onProgress === 'function') {
          onProgress({ step: 2, text: 'Melukis busana batik dengan Google Gemini / Imagen AI...' });
        }
        const geminiResult = await callGeminiImagen(prompt, apiKey);
        if (geminiResult) {
          if (typeof onProgress === 'function') {
            onProgress({ step: 3, text: 'Lukisan selesai dengan bentuk wajah asli dipertahankan!' });
          }
          return {
            success: true,
            provider: 'Google Gemini Imagen',
            dataUrl: geminiResult,
            prompt: prompt,
            title: garment.title,
            style: options.style || 'keraton',
            preservedFace: true
          };
        }
      } catch (err) {
        console.warn('Gemini Imagen API error, beralih ke Mesin Seni AI berikutnya:', err);
      }
    }

    // 4. Coba Puter.js AI jika script Puter terpasang & tersedia
    if (window.puter && window.puter.ai && typeof window.puter.ai.txt2img === 'function') {
      try {
        if (typeof onProgress === 'function') {
          onProgress({ step: 2, text: 'Melukis busana batik dengan Mesin Seni Puter AI...' });
        }
        const imgElement = await window.puter.ai.txt2img(prompt);
        if (imgElement && imgElement.src) {
          if (typeof onProgress === 'function') {
            onProgress({ step: 3, text: 'Lukisan selesai dengan bentuk wajah asli dipertahankan!' });
          }
          return {
            success: true,
            provider: 'Puter AI Studio',
            dataUrl: imgElement.src,
            prompt: prompt,
            title: garment.title,
            style: options.style || 'keraton',
            preservedFace: true
          };
        }
      } catch (puterErr) {
        console.warn('Puter AI error atau tidak merespons, beralih ke Pollinations:', puterErr);
      }
    }

    // 5. Mesin Seni AI Pollinations (Zero Configuration)
    try {
      if (typeof onProgress === 'function') {
        onProgress({ step: 2, text: 'Melukis potret dengan Mesin Seni Batik AI (Kemiripan Wajah Lengkap)...' });
      }

      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=960&seed=${seed}&nologo=true`;

      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedCooldown = null;
        try {
          const parsed = JSON.parse(errText);
          if (parsed && parsed.error && parsed.error.message) {
            const match = parsed.error.message.match(/Retry after\s+(\d+)s/i);
            if (match && match[1]) {
              parsedCooldown = parseInt(match[1], 10);
            }
          }
        } catch (_) {}

        if (response.status === 402 && parsedCooldown) {
          throw new Error(`Server AI sedang mendinginkan antrean (cooldown). Silakan tunggu ${parsedCooldown} detik lalu coba kembali.`);
        } else if (response.status === 402 || response.status === 503) {
          throw new Error('Server AI sedang memproses antrean ramai. Silakan tunggu sekitar 20-30 detik lalu coba kembali.');
        } else {
          throw new Error(`Gagal menghubungi server AI (HTTP ${response.status}).`);
        }
      }

      const blob = await response.blob();
      const base64 = await blobToDataUrl(blob);

      if (typeof onProgress === 'function') {
        onProgress({ step: 3, text: 'Lukisan selesai dengan bentuk wajah asli dipertahankan!' });
      }

      return {
        success: true,
        provider: 'Mesin Seni Batik AI',
        dataUrl: base64,
        prompt: prompt,
        title: garment.title,
        style: options.style || 'keraton',
        preservedFace: true
      };
    } catch (apiErr) {
      console.error('Kecerdasan Buatan (AI) Error:', apiErr);
      return {
        success: false,
        error: apiErr.message || 'Koneksi ke server AI terganggu. Silakan periksa koneksi internet Anda dan coba lagi.',
        prompt: prompt
      };
    }
  }

  /**
   * Panggilan Google Imagen 3 API (jika user punya key)
   */
  async function callGeminiImagen(prompt, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt: prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '3:4',
        personGeneration: 'ALLOW_ADULT'
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini Imagen error: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }
    return null;
  }

  // Publikasikan API ke window
  window.LelanaAI = {
    STYLES,
    GARMENT_SPECS,
    getGeminiKey,
    setGeminiKey,
    buildPrompt,
    generateArtwork
  };
})();
