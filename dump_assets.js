const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const assets = [];
const re = /(?:href|src)="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
  if (m[1].includes('chunk') || m[1].includes('.css') || m[1].includes('.js')) {
    assets.push(m[1]);
  }
}
console.log('Sample assets in index.html:');
assets.slice(0, 15).forEach(a => console.log(' -', a));
