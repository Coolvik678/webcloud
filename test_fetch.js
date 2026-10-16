const http = require('http');

function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get('http://localhost:8085' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          length: data.length,
          hasKill: data.includes('kill-black-screen'),
          hasIntro: data.includes("classList.add('intro')")
        });
      });
    }).on('error', err => resolve({ path: urlPath, error: err.message }));
  });
}

async function run() {
  const paths = [
    '/en',
    '/en/start-project',
    '/en/work',
    '/en/journal',
    '/en/services',
    '/en/studio',
    '/en/contact'
  ];
  for (const p of paths) {
    const result = await checkUrl(p);
    console.log(result);
  }
}

run();
