const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve('c:/Artificial_Intelligence_Local/metic_clone');

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
  [data-reveal],
  [data-reveal="clip"] > *,
  [data-reveal="focus"],
  [data-reveal="up"],
  [data-reveal="fade"],
  [data-assemble] [data-cx],
  [data-assemble] .cx-body,
  .prose {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    translate: none !important;
    clip-path: none !important;
    visibility: visible !important;
  }
  .brief-build [data-reveal] {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }
  .brief-build .brief-step>h2,
  .js .brief-build .field-label,
  .js .brief-build .field>legend,
  .js .brief-build .field-hint,
  .brief-build .brief-draft,
  .brief-build .brief-submit {
    opacity: 1 !important;
  }
  .brief-build .chip {
    clip-path: none !important;
  }
  .field-input {
    border: 1px solid var(--line) !important;
    background: var(--paper) !important;
    color: var(--ink) !important;
  }
</style>`;

const SCRIPT_TAGS = `<script src="/webcloud-ui.js" defer></script>\n<script src="/webcloud-engine.js" defer></script>`;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.html') && !file.includes('raw') && !file.includes('pristine')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = walk(BASE_DIR);
console.log(`Found ${htmlFiles.length} HTML files to bake.`);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Inject KILL_STYLE if not present
  if (!content.includes('kill-black-screen') && content.includes('</head>')) {
    content = content.replace('</head>', `${KILL_STYLE}\n</head>`);
    changed = true;
  }

  // 2. Inject scripts if not present
  if (!content.includes('/webcloud-ui.js') && content.includes('</body>')) {
    content = content.replace('</body>', `${SCRIPT_TAGS}\n</body>`);
    changed = true;
  }

  // 3. Point /_next/static/ to /static/ so assets never get blocked by _next filters
  if (content.includes('/_next/static/')) {
    content = content.replaceAll('/_next/static/', '/static/');
    changed = true;
  }

  // 4. Sanitize banned phrases
  if (content.includes('Code by hand')) {
    content = content.replaceAll('Code by hand.', 'A foundation built on excellence.');
    content = content.replaceAll('Code by hand', 'A foundation built on excellence');
    changed = true;
  }
  if (content.includes('One number, one face')) {
    content = content.replaceAll('One number, one face.', 'The best people to help you.');
    content = content.replaceAll('One number, one face', 'The best people to help you');
    changed = true;
  }
  if (content.includes('1 number 1 face')) {
    content = content.replaceAll('1 number 1 face', 'The best people to help you');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Basked & updated: ${path.relative(BASE_DIR, file)}`);
  }
});
console.log('Baking complete!');
