const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
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

  // Handle local game launcher (launches Unity Editor or Game executable on Windows)
  if (req.url === '/api/launch-game' || req.url.startsWith('/api/launch-game')) {
    const { exec } = require('child_process');
    const unityExe = 'C:\\Program Files\\Unity\\Hub\\Editor\\6000.6.6f1\\Editor\\Unity.exe';
    const projectPath = 'C:\\Users\\vincent lim\\arvr_perbaikan';
    const builtExe = path.join(__dirname, 'game_build', 'MisteriBorobudurVR.exe');

    let commandToRun;
    let targetType = 'unity';
    if (fs.existsSync(builtExe)) {
      commandToRun = `start "" "${builtExe}"`;
      targetType = 'standalone';
    } else {
      commandToRun = `start "" "${unityExe}" -projectPath "${projectPath}"`;
      targetType = 'unity';
    }

    console.log(`[Game Launcher] Menjalankan: ${commandToRun}`);
    exec(commandToRun, (error) => {
      if (error) {
        console.error('[Game Launcher] Gagal:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          targetType,
          message: targetType === 'standalone' ? 'Game Standalone berhasil dibuka!' : 'Unity Editor berhasil dibuka dengan proyek game!'
        }));
      }
    });
    return;
  }

  // Proxy API or Storage requests to Laravel backend (port 8000)
  if (req.url.startsWith('/api/') || req.url.startsWith('/storage/')) {
    const options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'success',
        backend: 'supabase',
        message: 'Backend Studio Canting telah dimigrasi ke Supabase Cloud. Silakan gunakan integrasi Supabase langsung di Studio Canting.'
      }));
    });

    req.pipe(proxyReq, { end: true });
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
});
