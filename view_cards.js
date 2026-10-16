const fs = require('fs');
const html = fs.readFileSync('c:/Artificial_Intelligence_Local/metic_clone/en/index.html', 'utf8');

let idx = 0;
let c = 0;
while ((idx = html.indexOf('data-card="true"', idx)) !== -1) {
  c++;
  console.log(`=== CARD ${c} ===`);
  const end = html.indexOf('</article>', idx);
  console.log(html.substring(idx - 60, idx + 600));
  idx += 20;
}
