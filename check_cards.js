const fs = require('fs');
const html = fs.readFileSync('c:/Artificial_Intelligence_Local/metic_clone/en/index.html', 'utf8');
const cardMatches = html.match(/data-card="true"[\s\S]*?<\/a>/g);
console.log('Cards found:', cardMatches ? cardMatches.length : 0);
if (cardMatches) {
  cardMatches.forEach((c, i) => {
    console.log('--- CARD ' + (i+1) + ' ---');
    const imgs = c.match(/<img[^>]+>/g);
    console.log('Imgs:', imgs);
  });
}
