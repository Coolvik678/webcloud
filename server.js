const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8085;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.rsc': 'text/x-component'
};

const KILL_STYLE = `<style id="kill-black-screen">
  .preloader, html.intro .preloader, .intro .preloader, [data-no-lens="true"].preloader {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    z-index: -9999 !important;
  }
  html.intro { overflow: auto !important; }
  body { overflow: auto !important; background-color: #f4f4f2 !important; }
</style>`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === '/_client_error') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    return;
  }

  // Next.js Image Optimizer: /_next/image?url=...
  if (pathname === '/_next/image') {
    const targetUrl = parsed.query.url;
    if (targetUrl) {
      const relPath = targetUrl.replace(/^\/+/, '');
      const localImg = path.join(BASE_DIR, relPath);
      if (fs.existsSync(localImg) && fs.statSync(localImg).isFile()) {
        serveFile(localImg, res);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Image not found');
    return;
  }

  // Root /
  if (pathname === '/' || pathname === '') {
    serveFile(path.join(BASE_DIR, 'index.html'), res);
    return;
  }

  // Journal Route Aliases
  if (pathname === '/en/journal/on-youtube' || pathname === '/journal/on-youtube') {
    serveFile(path.join(BASE_DIR, 'en', 'journal', '300-million-button', 'index.html'), res);
    return;
  }
  if (pathname === '/journal/300-million-button') {
    serveFile(path.join(BASE_DIR, 'en', 'journal', '300-million-button', 'index.html'), res);
    return;
  }
  if (pathname === '/journal/20-billion-default') {
    serveFile(path.join(BASE_DIR, 'en', 'journal', '20-billion-default', 'index.html'), res);
    return;
  }

  // Clean local path
  const rel = pathname.replace(/^\/+/, '');
  let localPath = path.join(BASE_DIR, rel);

  // 1. Direct file
  if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    serveFile(localPath, res);
    return;
  }

  // 2. Directory index.html
  if (fs.existsSync(localPath) && fs.statSync(localPath).isDirectory()) {
    const idx = path.join(localPath, 'index.html');
    if (fs.existsSync(idx) && fs.statSync(idx).isFile()) {
      serveFile(idx, res);
      return;
    }
  }

  // 3. Path + '.html'
  if (fs.existsSync(localPath + '.html') && fs.statSync(localPath + '.html').isFile()) {
    serveFile(localPath + '.html', res);
    return;
  }

  // Fallback to 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found: ' + pathname);
});

function serveFile(filePath, res) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html') {
      let content = fs.readFileSync(filePath, 'utf8');
      if (!filePath.includes('pristine') && !filePath.includes('raw') && !filePath.includes('original')) {
        if (!content.includes('kill-black-screen')) {
          content = content.replace('</head>', KILL_STYLE + '\n</head>');
        }
        if (!content.includes('/webcloud-ui.js')) {
          content = content.replace('</body>', '<script src="/webcloud-ui.js" defer></script>\n</body>');
        }
        if (!content.includes('/webcloud-engine.js')) {
          content = content.replace('</body>', '<script src="/webcloud-engine.js" defer></script>\n</body>');
        }
      }
      const buf = Buffer.from(content, 'utf8');
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': buf.length,
        'Vary': 'RSC, Next-Router-State-Tree, Next-Router-Prefetch'
      });
      res.end(buf);
      return;
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stat.size,
      'Vary': 'RSC, Next-Router-State-Tree, Next-Router-Prefetch'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
  } catch (err) {
    if (!res.headersSent) res.writeHead(500);
    res.end('Internal Server Error');
  }
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`>> WebCloud Ultra-Reliable Node Server running at:`);
  console.log(`   http://localhost:${PORT}/en`);
  console.log(`   http://127.0.0.1:${PORT}/en`);
});

server.on('error', (e) => {
  console.error('Server error:', e);
});
