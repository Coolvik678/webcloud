const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('c:/Artificial_Intelligence_Local/metic_clone');
const OUT_DIR = path.join(ROOT, '.vercel', 'output');
const STATIC_DIR = path.join(OUT_DIR, 'static');

console.log('Preparing Vercel Build Output API v3...');

// Clean existing output
try {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
} catch (e) {}

fs.mkdirSync(STATIC_DIR, { recursive: true });

// Copy all static files into .vercel/output/static
const skip = new Set([
  '.git',
  '.vercel',
  '.chrome_debug_profile_loupe_check',
  '.chrome_debug_profile_templates_check',
  '.chrome_debug_profile_principles_check'
]);

function copyRecursive(src, dest) {
  const base = path.basename(src);
  if (skip.has(base) || base.endsWith('.png') || base.endsWith('.log') || base.endsWith('.bak')) {
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursive(ROOT, STATIC_DIR);
console.log('Static files copied to .vercel/output/static');

// Also copy static/ to _next/static inside .vercel/output/static to guarantee both paths resolve
const staticSrc = path.join(STATIC_DIR, 'static');
const nextStaticDest = path.join(STATIC_DIR, '_next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(nextStaticDest, { recursive: true });
  for (const f of fs.readdirSync(staticSrc)) {
    const s = path.join(staticSrc, f);
    const d = path.join(nextStaticDest, f);
    if (fs.statSync(s).isDirectory()) {
      fs.cpSync(s, d, { recursive: true });
    } else {
      fs.copyFileSync(s, d);
    }
  }
  console.log('Synchronized _next/static mirror');
}

// Write .vercel/output/config.json
const config = {
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '^/_next/static/(.*)$', dest: '/static/$1' },
    { src: '^/en/journal/on-youtube/?$', dest: '/en/journal/300-million-button/index.html' },
    { src: '^/journal/on-youtube/?$', dest: '/journal/300-million-button/index.html' },
    { src: '^/?$', dest: '/en/index.html' },
    { src: '^/en/?$', dest: '/en/index.html' },
    { src: '^/en/(.*)/?$', dest: '/en/$1/index.html' },
    { src: '^/(.*)/?$', dest: '/$1/index.html' }
  ]
};

fs.writeFileSync(path.join(OUT_DIR, 'config.json'), JSON.stringify(config, null, 2), 'utf8');
console.log('Generated .vercel/output/config.json');

// Count files in static
function countFiles(dir) {
  let count = 0;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) count += countFiles(p);
    else count++;
  }
  return count;
}
console.log(`Total static files ready for deployment: ${countFiles(STATIC_DIR)}`);
