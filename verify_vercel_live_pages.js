const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_vercel_live_check2');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9676',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9676/json/list');
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

  // Test 1: Templates article on production
  await send('Page.navigate', { url: 'https://webcloud-corporation.vercel.app/en/journal/why-i-dont-use-templates' });
  await new Promise(r => setTimeout(r, 3500));
  const shotTemplates = await send('Page.captureScreenshot', { format: 'png' });
  if (shotTemplates?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_vercel_live_templates.png'), Buffer.from(shotTemplates.data, 'base64'));
    console.log('Saved shot_vercel_live_templates.png');
  }

  // Test 2: Principles section on production homepage
  await send('Page.navigate', { url: 'https://webcloud-corporation.vercel.app' });
  await new Promise(r => setTimeout(r, 3500));
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = Array.from(document.querySelectorAll('h3, h2, div')).find(e => 
        e.textContent.includes('A foundation built on excellence') || 
        e.textContent.includes('The best people to help you')
      );
      if (el) el.scrollIntoView({ block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));
  const shotPrinciples = await send('Page.captureScreenshot', { format: 'png' });
  if (shotPrinciples?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_vercel_live_principles.png'), Buffer.from(shotPrinciples.data, 'base64'));
    console.log('Saved shot_vercel_live_principles.png');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
