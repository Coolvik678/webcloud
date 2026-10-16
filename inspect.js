const fs = require('fs');
const html = fs.readFileSync('en/index.html', 'utf8');

// Find all cards
let idx = 0;
let count = 0;
while ((idx = html.indexOf('data-card', idx)) !== -1) {
  count++;
  console.log(`=== CARD ${count} at ${idx} ===`);
  console.log(html.substring(Math.max(0, idx - 150), idx + 500));
  idx += 10;
}

// Find journal section
let jIdx = html.indexOf('journal');
console.log('=== JOURNAL SECTION ===');
while (jIdx !== -1 && jIdx < html.length) {
  const snippet = html.substring(jIdx - 50, jIdx + 300);
  if (snippet.includes('<a') || snippet.includes('href')) {
    console.log(`Journal at ${jIdx}:`, snippet);
  }
  jIdx = html.indexOf('journal', jIdx + 100);
}
