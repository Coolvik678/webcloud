const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_hero_shot');

try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9667',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  let res = await fetch('http://127.0.0.1:9667/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  if (!tab) {
    res = await fetch('http://127.0.0.1:9667/json/new', { method: 'PUT' });
    tab = await res.json();
  }

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

  const logs = [];
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      logs.push(data.params.type + ': ' + data.params.args.map(a => a.value || a.description).join(' '));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      logs.push('EXCEPTION: ' + JSON.stringify(data.params.exceptionDetails));
    }
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  await send('Runtime.enable');
  await send('Page.enable');

  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 3000));

  // Check state of loupe elements
  const loupeInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        hasLoupeClass: document.documentElement.classList.contains('has-loupe'),
        loupeHit: !!document.getElementById('lupe-griff'),
        loupeSicht: !!document.getElementById('lupe-sicht'),
        loupeGlas: !!document.getElementById('lupe-glas'),
        loupePoster: !!document.querySelector('.loupe-poster'),
        title: document.title,
        heading: document.querySelector('h1')?.textContent
      };
    })()`,
    returnByValue: true
  });
  console.log('Loupe Info:', loupeInfo?.result?.value);
  console.log('Logs recorded:', logs.slice(0, 10));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_hero_view.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved shot_hero_view.png');
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  chromeProc.kill();
  process.exit(1);
});
