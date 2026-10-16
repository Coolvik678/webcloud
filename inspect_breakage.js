const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_inspect_breakage');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9678',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9678/json/list');
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
  await send('Runtime.enable');
  await send('Console.enable');

  const logs = [];
  ws.addEventListener('message', (e) => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      logs.push(`[CONSOLE ${d.params.type}] ` + d.params.args.map(a => a.value || a.description).join(' '));
    }
    if (d.method === 'Runtime.exceptionThrown') {
      logs.push(`[EXCEPTION] ` + d.params.exceptionDetails.text + ' ' + (d.params.exceptionDetails.exception?.description || ''));
    }
  });

  console.log('Navigating to http://localhost:8085/en ...');
  await send('Page.navigate', { url: 'http://localhost:8085/en' });
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- BROWSER LOGS & EXCEPTIONS ---');
  logs.forEach(l => console.log(l));

  // Check if Loupe canvas exists and is active
  const loupeCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const loupeSvg = document.querySelector('svg.loupe, [data-loupe], .loupe');
      const canvas = document.querySelector('canvas');
      const buildSection = document.querySelector('.brief-build, section.build, [data-build]');
      const progress = document.querySelector('.progress, [data-progress]');
      return {
        hasCanvas: !!canvas,
        hasLoupeSvg: !!loupeSvg,
        hasBuildSection: !!buildSection,
        htmlClass: document.documentElement.className,
        bodyBg: window.getComputedStyle(document.body).backgroundColor
      };
    })()`,
    returnByValue: true
  });
  console.log('--- LOUPE & BUILD DIAGNOSTICS ---', JSON.stringify(loupeCheck?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
