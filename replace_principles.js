const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(([from, to]) => {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

const REPLACEMENTS = [
  [
    '<h3 class="display-4">Code by hand.</h3><p class="mt-3 text-ink-2">Lean, readable source code instead of generated bloat. That is why pages load fast.</p>',
    '<h3 class="display-4">A foundation built on excellence.</h3><p class="mt-3 text-ink-2">Engineered from the ground up with precision architecture, clean systems, and zero compromise on performance.</p>'
  ],
  [
    '<h3 class="display-4">One number, one face.</h3><p class="mt-3 text-ink-2">You talk to the person who designs and develops. From the first conversation until well after launch.</p>',
    '<h3 class="display-4">The best people to help you.</h3><p class="mt-3 text-ink-2">Direct partnership with elite digital architects. Strategic guidance, seamless execution, and dedicated support from start to finish.</p>'
  ],
  [
    '<p class="display-4 mt-3">One number, one face.</p><p class="mt-2 max-w-[36ch] text-ink-2">You talk to the person who designs and builds. No hotline, no forwarding, no ticket.</p>',
    '<p class="display-4 mt-3">The best people to help you.</p><p class="mt-2 max-w-[36ch] text-ink-2">Direct partnership with elite digital architects. Strategic guidance, seamless execution, and dedicated support.</p>'
  ],
  [
    'One number, one face, from the Mühlviertel',
    'Direct support from the best people to help you, engineered with total reliability'
  ],
  [
    'One number, one face.',
    'The best people to help you.'
  ],
  [
    'One number, one face',
    'The best people to help you'
  ],
  [
    'Code by hand.',
    'A foundation built on excellence.'
  ],
  [
    'Code by hand',
    'A foundation built on excellence'
  ],
  [
    'You talk to the person who designs and builds. No hotline, no forwarding, no ticket.',
    'Direct partnership with elite digital architects. Dedicated guidance and support from start to finish.'
  ]
];

const files = [
  'en/index.html',
  'index.html',
  'en/region/index.html',
  'en/services/hosting-domains-email/index.html',
  'en/index_test_brand.html',
  'en/test_sync_hydration.html',
  '_next/static/chunks/1u_zf6w34t411.js',
  'static/chunks/1u_zf6w34t411.js'
];

files.forEach(f => replaceInFile(path.join(__dirname, f), REPLACEMENTS));
console.log('Replacements completed successfully.');
