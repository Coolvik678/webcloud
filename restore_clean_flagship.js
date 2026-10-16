const fs = require('fs');
const path = require('path');

const pristinePath = path.resolve('c:/Artificial_Intelligence_Local/metic_clone/en/index_pristine.html');
let content = fs.readFileSync(pristinePath, 'utf8');

// 1. Inject clean minimal kill-black-screen (NEVER touch transform or clip-path)
const cleanKillStyle = '<style id="kill-black-screen">.preloader,html.intro .preloader,.intro .preloader{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}html.intro{overflow:auto!important}body{overflow:auto!important;background-color:#f4f4f2!important}</style>';
if (!content.includes('id="kill-black-screen"')) {
  content = content.replace('</head>', cleanKillStyle + '\n</head>');
}

// 2. Inject webcloud scripts before </body>
const scripts = '<script src="/webcloud-ui.js" defer></script>\n<script src="/webcloud-engine.js" defer></script>';
if (!content.includes('/webcloud-ui.js')) {
  content = content.replace('</body>', scripts + '\n</body>');
}

// 3. Precision replacement of banned phrases in the principles section
content = content.replace(/Code by hand\./g, 'A foundation built on excellence.');
content = content.replace(/Code by hand/g, 'A foundation built on excellence');

content = content.replace(/One number, one face\./g, 'The best people to help you.');
content = content.replace(/One number, one face/g, 'The best people to help you');
content = content.replace(/1 number 1 face/g, 'The best people to help you');

// 4. Update the subtext of the principles
content = content.replace(
  'You talk to the person who designs and develops/builds.',
  'Direct partnership with elite digital architects. Strategic guidance, seamless execution, and dedicated support from start to finish.'
);
content = content.replace(
  'Keine Templates, kein Plugin-Ballast. Jedes Element entsteht neu und passt exakt zu deiner Marke.',
  'No templates, no plugin bloat. Every element is engineered new and fits your brand exactly.'
);

// 5. Write to both en/index.html and index.html
fs.writeFileSync('c:/Artificial_Intelligence_Local/metic_clone/en/index.html', content, 'utf8');
fs.writeFileSync('c:/Artificial_Intelligence_Local/metic_clone/index.html', content, 'utf8');
console.log('Restored en/index.html and index.html with pristine animations + brand copy!');
