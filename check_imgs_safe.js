const fs = require('fs');
const html = fs.readFileSync('c:/Artificial_Intelligence_Local/metic_clone/en/index.html', 'utf8');
const imgs = (html.match(/src="[^"]+"/g) || []).filter(s => s.includes('.png') || s.includes('.jpg') || s.includes('.webp') || s.includes('image'));
console.log('Sample image srcs in en/index.html:');
imgs.slice(0, 10).forEach(i => console.log(' -', i));
