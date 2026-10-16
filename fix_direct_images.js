const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('c:/Artificial_Intelligence_Local/metic_clone');

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

const htmlFiles = walk(ROOT);
console.log(`Processing ${htmlFiles.length} HTML files for image fixes...`);

let replacedTotal = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let before = content;

  // Replace /_next/image?url=%2F... with decoded direct path
  content = content.replace(/srcSet="([^"]+)"/g, (match, val) => {
    const newVal = val.replace(/\/_next\/image\?url=%2F([^&]+)[^,\s]*/g, '/$1');
    return `srcSet="${newVal}"`;
  });

  content = content.replace(/src="\/_next\/image\?url=%2F([^&"]+)[^"]*"/g, (match, pathPart) => {
    const decoded = decodeURIComponent(pathPart);
    return `src="/${decoded}"`;
  });

  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    replacedTotal++;
    console.log(`Fixed images in: ${path.relative(ROOT, file)}`);
  }
});

console.log(`Updated images in ${replacedTotal} HTML files.`);
