const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_journal_shot');

try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9666',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  let res = await fetch('http://127.0.0.1:9666/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  if (!tab) {
    res = await fetch('http://127.0.0.1:9666/json/new', { method: 'PUT' });
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

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  await send('Runtime.enable');
  await send('Page.enable');

  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 2500));

  // Find exact position of journal section
  const pos = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('journal-titel');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - 50;
      window.scrollTo(0, top);
      return { top, text: el.textContent };
    })()`
  });
  console.log('Scrolled to journal position:', pos?.result?.value);

  await new Promise(r => setTimeout(r, 1500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_journal_fixed.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved shot_journal_fixed.png');
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
