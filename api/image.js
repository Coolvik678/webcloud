const fs = require('fs');
const path = require('path');
const url = require('url');

module.exports = (req, res) => {
  const parsed = url.parse(req.url, true);
  const targetUrl = parsed.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }
  const decoded = decodeURIComponent(targetUrl);
  const relPath = decoded.replace(/^\/+/, '');
  const filePath = path.join(process.cwd(), relPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif'
    };
    const contentType = mimeMap[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return fs.createReadStream(filePath).pipe(res);
  }

  return res.status(404).send('Image not found: ' + relPath);
};
