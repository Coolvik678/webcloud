const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_inspect_vercel_breakage');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9679',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9679/json/list');
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

  console.log('Navigating to https://webcloud-corporation.vercel.app ...');
  await send('Page.navigate', { url: 'https://webcloud-corporation.vercel.app' });
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- BROWSER LOGS & EXCEPTIONS ON VERCEL ---');
  logs.forEach(l => console.log(l));

  // Check interactive elements on Vercel
  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const loupeEl = document.querySelector('[data-loupe], .loupe, [data-lens]');
      // Test mouse movement over hero
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 700, clientY: 400 }));
      
      // Check Build section
      const build = document.querySelector('section[aria-labelledby="brief-titel"], .brief-build');
      return {
        hasCanvas: !!canvas,
        canvasVisible: canvas ? (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) : false,
        htmlClass: document.documentElement.className,
        hasBuild: !!build
      };
    })()`,
    returnByValue: true
  });
  console.log('--- VERCEL ELEMENT DIAGNOSTICS ---', JSON.stringify(check?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
