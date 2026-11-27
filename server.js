const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env file (gitignored) into process.env
(function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  } catch (err) {
    console.warn('Warning: failed to read .env:', err.message);
  }
})();

const PORT = process.env.PORT || 3000;
const MAX_BODY_BYTES = 20 * 1024 * 1024; // 20 MB for base64 canvas image

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error('Payload terlalu besar (maksimal 20MB).'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error('Format JSON tidak valid.'));
      }
    });
    req.on('error', reject);
  });
}

function parseDataUrlToBuffer(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Format gambar kanvas tidak valid (harus data URL base64).');
  }
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastErr = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      lastErr = err;
      const causeMsg = err.cause ? ` (${err.cause.code || err.cause.message})` : '';
      console.warn(`[HF Proxy] Attempt ${attempt}/${retries} failed for ${url}: ${err.message}${causeMsg}`);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
  const causeMsg = lastErr && lastErr.cause ? ` (${lastErr.cause.code || lastErr.cause.message})` : '';
  throw new Error(`${lastErr ? lastErr.message : 'fetch failed'}${causeMsg}`);
}

async function uploadToGradioSpace(baseUrl, imageBuffer, mimeType, filename, authHeaders) {
  const form = new FormData();
  form.append('files', new Blob([imageBuffer], { type: mimeType }), filename);

  const uploadRes = await fetchWithRetry(`${baseUrl}/gradio_api/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: form
  });
  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => '');
    throw new Error(`Upload gagal (${uploadRes.status}): ${errText.slice(0, 180)}`);
  }
  const uploadedPaths = await uploadRes.json();
  const uploadedPath = Array.isArray(uploadedPaths) ? uploadedPaths[0] : null;
  if (!uploadedPath) {
    throw new Error('Server tidak mengembalikan path file upload.');
  }

  return {
    path: uploadedPath,
    orig_name: filename,
    mime_type: mimeType,
    meta: { _type: 'gradio.FileData' }
  };
}

async function runGradioEndpoint({ spaceName, baseUrl, endpointName, dataPayload, hfToken }) {
  const authHeaders = hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {};
  const cleanEp = endpointName.replace(/^\/+/, '');

  const callRes = await fetchWithRetry(`${baseUrl}/gradio_api/call/${cleanEp}`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: dataPayload })
  });
  if (!callRes.ok) {
    const errText = await callRes.text().catch(() => '');
    throw new Error(`${spaceName} call/${cleanEp} gagal (${callRes.status}): ${errText.slice(0, 200)}`);
  }
  const callJson = await callRes.json();
  const eventId = callJson && callJson.event_id;
  if (!eventId) {
    throw new Error(`${spaceName} tidak mengembalikan event_id.`);
  }

  const sseRes = await fetchWithRetry(`${baseUrl}/gradio_api/call/${cleanEp}/${eventId}`, {
    method: 'GET',
    headers: {
      ...authHeaders,
      'Accept': 'text/event-stream'
    }
  });
  if (!sseRes.ok) {
    const errText = await sseRes.text().catch(() => '');
    throw new Error(`${spaceName} stream gagal (${sseRes.status}): ${errText.slice(0, 200)}`);
  }

  const sseText = await sseRes.text();
  const blocks = sseText.split(/\r?\n\r?\n/);
  let completedData = null;
  let errorDetail = null;

  for (const block of blocks) {
    const eventMatch = block.match(/^event:\s*(.+)$/m);
    const dataMatch = block.match(/^data:\s*(.+)$/m);
    if (!eventMatch) continue;
    const ev = eventMatch[1].trim();
    const rawData = dataMatch ? dataMatch[1].trim() : '';

    if (ev === 'complete') {
      try {
        completedData = JSON.parse(rawData);
      } catch (_) {
        completedData = rawData;
      }
      break;
    } else if (ev === 'error') {
      errorDetail = rawData || 'ZeroGPU sedang penuh atau kuota harian IP ini habis.';
      break;
    }
  }

  if (errorDetail) {
    throw new Error(`${spaceName} error: ${errorDetail.slice(0, 240)}`);
  }
  if (!completedData) {
    throw new Error(`${spaceName} selesai tanpa hasil gambar.`);
  }

  // Extract image URL from Gradio output (supports ImageData or Gallery array)
  let firstOut = Array.isArray(completedData) ? completedData[0] : completedData;
  if (Array.isArray(firstOut)) firstOut = firstOut[0];
  if (firstOut && firstOut.image && typeof firstOut.image === 'object') {
    firstOut = firstOut.image;
  }

  let resultImgUrl = null;
  if (typeof firstOut === 'string') {
    resultImgUrl = firstOut;
  } else if (firstOut && typeof firstOut === 'object') {
    if (firstOut.url) {
      resultImgUrl = firstOut.url;
    } else if (firstOut.path) {
      resultImgUrl = `${baseUrl}/gradio_api/file=${firstOut.path}`;
    }
  }

  if (!resultImgUrl) {
    throw new Error(`${spaceName} tidak mengembalikan URL gambar hasil.`);
  }

  const imgRes = await fetch(resultImgUrl, { headers: authHeaders });
  if (!imgRes.ok) {
    throw new Error(`Gagal mengunduh gambar hasil dari ${spaceName} (HTTP ${imgRes.status}).`);
  }
  const outMime = (imgRes.headers.get('content-type') || 'image/webp').split(';')[0];
  const outBuf = Buffer.from(await imgRes.arrayBuffer());

  return {
    buffer: outBuf,
    mimeType: outMime,
    dataUrl: `data:${outMime};base64,${outBuf.toString('base64')}`
  };
}

async function runNeuralFaceSwap(faceBuffer, faceMime, targetBuffer, targetMime, hfToken) {
  const baseUrl = 'https://tonyassi-face-swap.hf.space';
  const authHeaders = hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {};
  const srcExt = faceMime.includes('png') ? 'png' : 'jpg';
  const dstExt = targetMime.includes('png') ? 'png' : (targetMime.includes('webp') ? 'webp' : 'jpg');

  const [srcFile, dstFile] = await Promise.all([
    uploadToGradioSpace(baseUrl, faceBuffer, faceMime, `user-face.${srcExt}`, authHeaders),
    uploadToGradioSpace(baseUrl, targetBuffer, targetMime, `ai-batik.${dstExt}`, authHeaders)
  ]);

  return await runGradioEndpoint({
    spaceName: 'InsightFace Neural FaceSwap',
    baseUrl,
    endpointName: '/swap_faces',
    dataPayload: [srcFile, dstFile],
    hfToken
  });
}

async function handleHuggingFaceImageEdit(req, res) {
  try {
    const body = await readJsonBody(req);
    const hfToken = (body.hfToken || process.env.HF_TOKEN || '').trim();
    const prompt = (body.prompt || 'Transform the 2D illustrated character into a realistic photograph.').trim();
    const multiImagePrompt = (body.multiImagePrompt || prompt).trim();
    const seed = Number(body.seed) || Math.floor(Math.random() * 999999);
    const canvasImg = parseDataUrlToBuffer(body.image);
    const faceImg = body.faceImage ? parseDataUrlToBuffer(body.faceImage) : null;
    const authHeaders = hfToken ? { 'Authorization': `Bearer ${hfToken}` } : {};

    let stage1Result = null;
    let usedProvider = '';
    const errors = [];

    // 1. Prioritas Utama: Multi-Image Qwen-Image-Edit-2511 / 2509 (Kirim Kanvas + Foto Wajah Resolusi Penuh!)
    if (faceImg) {
      const multiSpaces = [
        { spaceName: 'Qwen Image Edit 2511 (Multi-Image)', baseUrl: 'https://qwen-qwen-image-edit-2511.hf.space' },
        { spaceName: 'Qwen Image Edit 2509 (Multi-Image)', baseUrl: 'https://qwen-qwen-image-edit-2509.hf.space' }
      ];

      for (const sp of multiSpaces) {
        try {
          console.log(`[HF Proxy] Mencoba ${sp.spaceName} dengan kanvas + foto wajah asli...`);
          const [canvasFile, faceFile] = await Promise.all([
            uploadToGradioSpace(sp.baseUrl, canvasImg.buffer, canvasImg.mimeType, 'canvas.jpg', authHeaders),
            uploadToGradioSpace(sp.baseUrl, faceImg.buffer, faceImg.mimeType, 'face.jpg', authHeaders)
          ]);

          const galleryInput = [
            { image: canvasFile, caption: null },
            { image: faceFile, caption: null }
          ];

          stage1Result = await runGradioEndpoint({
            spaceName: sp.spaceName,
            baseUrl: sp.baseUrl,
            endpointName: '/infer',
            dataPayload: [galleryInput, multiImagePrompt, seed, true, 4, 24, 768, 1024, true],
            hfToken
          });
          usedProvider = sp.spaceName;
          console.log(`[HF Proxy] Tahap 1 berhasil via ${sp.spaceName}!`);
          break;
        } catch (err) {
          console.warn(`[HF Proxy] ${sp.spaceName} gagal:`, err.message);
          errors.push(err.message);
        }
      }
    }

    // 2. Fallback Tahap 1: Single-Image FLUX.1 Kontext Dev / Qwen-Image-Edit
    if (!stage1Result) {
      const singleSpaces = [
        {
          spaceName: 'FLUX.1 Kontext Dev',
          baseUrl: 'https://black-forest-labs-flux-1-kontext-dev.hf.space',
          buildData: (fileData) => [fileData, prompt, seed, true, 2.5, 24]
        },
        {
          spaceName: 'Qwen Image Edit',
          baseUrl: 'https://qwen-qwen-image-edit.hf.space',
          buildData: (fileData) => [fileData, prompt, seed, true, 4, 24, true]
        }
      ];

      for (const sp of singleSpaces) {
        try {
          console.log(`[HF Proxy] Mencoba ${sp.spaceName}...`);
          const canvasFile = await uploadToGradioSpace(sp.baseUrl, canvasImg.buffer, canvasImg.mimeType, 'canvas.jpg', authHeaders);
          stage1Result = await runGradioEndpoint({
            spaceName: sp.spaceName,
            baseUrl: sp.baseUrl,
            endpointName: '/infer',
            dataPayload: sp.buildData(canvasFile),
            hfToken
          });
          usedProvider = sp.spaceName;
          console.log(`[HF Proxy] Tahap 1 berhasil via ${sp.spaceName}!`);
          break;
        } catch (err) {
          console.warn(`[HF Proxy] ${sp.spaceName} gagal:`, err.message);
          errors.push(err.message);
        }
      }
    }

    if (!stage1Result) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: `Semua server Hugging Face gratis sedang sibuk/limit ZeroGPU. Tambahkan Hugging Face Token gratis (hf_...) di Pengaturan AI untuk kuota lebih besar. Detail: ${errors.join(' | ')}`
      }));
      return;
    }

    // 3. Tahap 2 (Face-Lock 1:1): Neural AI Face Swap memakai foto selfie asli pengguna
    let finalDataUrl = stage1Result.dataUrl;
    if (faceImg) {
      try {
        console.log('[HF Proxy] Tahap 2: Menyelaraskan kemiripan wajah 1:1 via Neural FaceSwap...');
        const swapped = await runNeuralFaceSwap(
          faceImg.buffer,
          faceImg.mimeType,
          stage1Result.buffer,
          stage1Result.mimeType,
          hfToken
        );
        finalDataUrl = swapped.dataUrl;
        usedProvider = `${usedProvider} + Face-Lock AI`;
        console.log('[HF Proxy] Tahap 2 Face-Lock berhasil!');
      } catch (swapErr) {
        console.warn('[HF Proxy] Tahap 2 Face-Lock dilewati (pakai hasil Tahap 1):', swapErr.message);
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: `Hugging Face Gratis (${usedProvider})`,
      dataUrl: finalDataUrl
    }));
  } catch (err) {
    console.error('[HF Proxy Error]:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Gagal memproses gambar ke Hugging Face: ' + (err.message || String(err))
    }));
  }
}

async function handleNvidiaImageEdit(req, res) {
  try {
    const body = await readJsonBody(req);
    const apiKey = (body.apiKey || process.env.NVIDIA_API_KEY || '').trim();
    if (!apiKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'NVIDIA API Key belum diatur. Masukkan API Key nvapi-... di Pengaturan AI atau file .env.'
      }));
      return;
    }

    const modelId = body.model || 'black-forest-labs/flux-3-image-klein';
    const invokeUrl = `https://ai.api.nvidia.com/v1/genai/${modelId}`;

    const nvidiaPayload = {
      prompt: body.prompt || 'Transform the 2D illustrated character into an ultra-realistic photograph.',
      image: body.image,
      width: Number(body.width) || 1024,
      height: Number(body.height) || 768,
      steps: Number(body.steps) || 28,
      cfg_scale: Number(body.cfg_scale) || 3.5,
      samples: 1
    };

    const upstream = await fetch(invokeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nvidiaPayload)
    });

    const rawText = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {}

    if (!upstream.ok) {
      const detail = (parsed && (parsed.detail || parsed.title || parsed.message || parsed.error))
        || rawText.slice(0, 300)
        || `HTTP ${upstream.status}`;
      res.writeHead(upstream.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        status: upstream.status,
        error: `NVIDIA AI gagal (${upstream.status}): ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`
      }));
      return;
    }

    // Extract base64 image from NVIDIA NIM response (artifacts[0].base64 or image or data[0].b64_json)
    let base64Str = null;
    if (parsed) {
      if (Array.isArray(parsed.artifacts) && parsed.artifacts[0]?.base64) {
        base64Str = parsed.artifacts[0].base64;
      } else if (typeof parsed.image === 'string') {
        base64Str = parsed.image;
      } else if (Array.isArray(parsed.data) && parsed.data[0]?.b64_json) {
        base64Str = parsed.data[0].b64_json;
      } else if (typeof parsed.b64_json === 'string') {
        base64Str = parsed.b64_json;
      }
    }

    if (!base64Str) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Respons NVIDIA AI tidak mengandung gambar base64.',
        keys: parsed ? Object.keys(parsed) : []
      }));
      return;
    }

    const dataUrl = base64Str.startsWith('data:image/')
      ? base64Str
      : `data:image/png;base64,${base64Str}`;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: `NVIDIA NIM (${modelId})`,
      dataUrl
    }));
  } catch (err) {
    console.error('[NVIDIA Proxy Error]:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Gagal menghubungi server NVIDIA AI: ' + (err.message || String(err))
    }));
  }
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Hugging Face Free Spaces Image Editing Proxy (FLUX.1 Kontext + Qwen-Image-Edit)
  if (req.method === 'POST' && req.url.split('?')[0] === '/api/hf-image-edit') {
    handleHuggingFaceImageEdit(req, res);
    return;
  }

  // NVIDIA NIM Image Editing Proxy Endpoint
  if (req.method === 'POST' && req.url.split('?')[0] === '/api/nvidia-image-edit') {
    handleNvidiaImageEdit(req, res);
    return;
  }

  // Health/Status check for AI configuration
  if (req.method === 'GET' && req.url.split('?')[0] === '/api/ai-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hfFreeSpaces: true,
      hfTokenConfigured: Boolean(process.env.HF_TOKEN),
      nvidiaConfigured: Boolean(process.env.NVIDIA_API_KEY),
      primaryModel: 'black-forest-labs/FLUX.1-Kontext-Dev'
    }));
    return;
  }

  // API fallback (Backend menggunakan Supabase Cloud)
  if (req.url.startsWith('/api/') || req.url.startsWith('/storage/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      backend: 'supabase',
      message: 'Backend Studio Canting telah menggunakan Supabase Cloud secara langsung.'
    }));
    return;
  }

  let parsedUrl = req.url.split('?')[0];
  let safePath = path.normalize(decodeURIComponent(parsedUrl)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found: ' + safePath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Lelana Jateng server running on http://localhost:${PORT}`);
  if (process.env.NVIDIA_API_KEY) {
    console.log('NVIDIA NIM AI Proxy: AKTIF (flux-3-image-klein)');
  } else {
    console.log('NVIDIA NIM AI Proxy: Menunggu API Key (atur di .env atau Pengaturan AI)');
  }
});
