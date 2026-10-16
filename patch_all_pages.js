const fs = require('fs');
const path = require('path');

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
  [data-reveal] {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    translate: none !important;
    clip-path: none !important;
  }
  .brief-build .brief-step>h2,
  .js .brief-build .field-label,
  .js .brief-build .field>legend,
  .js .brief-build .field-hint,
  .js .brief-build .brief-draft,
  .js .brief-build .brief-submit {
    opacity: 1 !important;
  }
  .brief-build .chip {
    clip-path: none !important;
  }
</style>`;

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item.startsWith('.')) continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (item === 'index.html') {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walk('c:/Artificial_Intelligence_Local/metic_clone');
console.log(`Found ${htmlFiles.length} HTML files to patch.`);

let patchedCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // 1. Remove intro from theme-init
  if (content.includes("d.classList.add('intro')")) {
    content = content.replace(/d\.classList\.add\('intro'\)/g, "d.classList.remove('intro')");
    modified = true;
  }

  // 2. Inject kill style if not present
  if (!content.includes('kill-black-screen')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', KILL_STYLE + '\n</head>');
    } else {
      content = KILL_STYLE + '\n' + content;
    }
    modified = true;
  }

  // 3. Ensure scripts are injected before </body>
  if (!content.includes('/webcloud-ui.js')) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', '<script src="/webcloud-ui.js" defer></script>\n</body>');
      modified = true;
    }
  }
  if (!content.includes('/webcloud-engine.js')) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', '<script src="/webcloud-engine.js" defer></script>\n</body>');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    patchedCount++;
    console.log(`Patched: ${path.relative('c:/Artificial_Intelligence_Local/metic_clone', file)}`);
  }
}

console.log(`Finished patching ${patchedCount} files.`);
