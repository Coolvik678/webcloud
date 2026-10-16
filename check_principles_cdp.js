const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_principles_check');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9673',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,1100'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1800));
  let res = await fetch('http://127.0.0.1:9673/json/list');
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

  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 2500));

  // Find principles section and scroll into view
  const resPrinc = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = Array.from(document.querySelectorAll('h3, h2, div')).find(e => 
        e.textContent.includes('A foundation built on excellence') || 
        e.textContent.includes('The best people to help you')
      );
      if (el) {
        el.scrollIntoView({ block: 'center' });
        return { found: true, text: el.innerText };
      }
      return { found: false };
    })()`,
    returnByValue: true
  });
  console.log('Principles search:', resPrinc?.result?.value);

  await new Promise(r => setTimeout(r, 800));
  const shotPrinciples = await send('Page.captureScreenshot', { format: 'png' });
  if (shotPrinciples?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_principles_replaced_verified.png'), Buffer.from(shotPrinciples.data, 'base64'));
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
