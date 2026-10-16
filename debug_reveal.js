const fs = require('fs');

const cssFiles = ['_next/static/chunks/2wnnw6qlwfrl2.css', '_next/static/chunks/1luoi79ecass9.css'];
for (const css of cssFiles) {
  if (fs.existsSync('c:/Artificial_Intelligence_Local/metic_clone/' + css)) {
    const c = fs.readFileSync('c:/Artificial_Intelligence_Local/metic_clone/' + css, 'utf8');
    console.log(css, 'contains [data-reveal]:', c.includes('[data-reveal]'));
    let idx = 0;
    while ((idx = c.indexOf('[data-reveal]', idx)) !== -1) {
      console.log('Snippet:', c.substring(idx, idx + 120));
      idx += 10;
    }
  }
}
