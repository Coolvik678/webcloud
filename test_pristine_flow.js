const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_pristine_verify');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9680',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9680/json/list');
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

  await send('Page.navigate', { url: 'http://localhost:8085/en/index_pristine.html' });
  await new Promise(r => setTimeout(r, 3500));

  // Move mouse to trigger loupe
  for (let i = 0; i < 5; i++) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 500 + i * 50,
      y: 400 + i * 30
    });
    await new Promise(r => setTimeout(r, 100));
  }

  const shotTop = await send('Page.captureScreenshot', { format: 'png' });
  if (shotTop?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_pristine_loupe.png'), Buffer.from(shotTop.data, 'base64'));
  }

  // Scroll to build section (line and graph)
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 1500);`
  });
  await new Promise(r => setTimeout(r, 1500));

  const shotBuild = await send('Page.captureScreenshot', { format: 'png' });
  if (shotBuild?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_pristine_build.png'), Buffer.from(shotBuild.data, 'base64'));
  }

  const diagnostics = await send('Runtime.evaluate', {
    expression: `(() => {
      const loupe = document.querySelector('svg.loupe, [data-loupe], canvas');
      const progress = document.querySelector('[data-progress], .build-progress');
      return {
        loupeFound: !!loupe,
        progressText: document.body.innerText.includes('Build progress')
      };
    })()`,
    returnByValue: true
  });
  console.log('PRISTINE DIAGNOSTICS:', JSON.stringify(diagnostics?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
