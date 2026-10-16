const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_templates_check');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9672',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,1100'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1800));
  let res = await fetch('http://127.0.0.1:9672/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');

  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en/journal/why-i-dont-use-templates' });
  await new Promise(r => setTimeout(r, 2500));

  const shotTop = await send('Page.captureScreenshot', { format: 'png' });
  if (shotTop?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_templates_article_top.png'), Buffer.from(shotTop.data, 'base64'));
  }

  // Scroll 500px down to see title & cover image & prose
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 450);` });
  await new Promise(r => setTimeout(r, 800));
  const shotMid = await send('Page.captureScreenshot', { format: 'png' });
  if (shotMid?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_templates_article_mid.png'), Buffer.from(shotMid.data, 'base64'));
  }

  // Check element positions and heights
  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const h1 = document.querySelector('h1');
      const img = document.querySelector('.parallax-img img, [data-reveal="clip"] img');
      const prose = document.querySelector('.prose');
      return {
        h1Text: h1 ? h1.innerText : null,
        imgVisible: img ? {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          rect: img.getBoundingClientRect(),
          clipPath: window.getComputedStyle(img.parentElement).clipPath,
          opacity: window.getComputedStyle(img).opacity
        } : null,
        proseTop: prose ? prose.getBoundingClientRect().top : null
      };
    })()`,
    returnByValue: true
  });
  console.log('TEMPLATES ARTICLE DIAGNOSTICS:', JSON.stringify(info?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
