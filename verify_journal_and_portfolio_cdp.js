const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_check2');

try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9555',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  let res = await fetch('http://127.0.0.1:9555/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  if (!tab) {
    res = await fetch('http://127.0.0.1:9555/json/new', { method: 'PUT' });
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

  console.log('--- Navigating to http://127.0.0.1:8085/en ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 2500));

  // Check Portfolio Cards
  const cardsInfo = await send('Runtime.evaluate', {
    expression: `JSON.stringify(Array.from(document.querySelectorAll('[data-card="true"]')).map(c => ({
      h3: c.querySelector('h3')?.textContent,
      category: c.querySelector('.measure')?.textContent,
      href: c.querySelector('a')?.getAttribute('href'),
      target: c.querySelector('a')?.getAttribute('target')
    })))`
  });
  console.log('Portfolio Cards on Home:', cardsInfo?.result?.value);

  // Check Journal Cards
  const journalInfo = await send('Runtime.evaluate', {
    expression: `JSON.stringify(Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] li')).map(li => ({
      label: li.querySelector('.cx-label')?.textContent,
      type: li.querySelector('[data-cx="type"]')?.textContent,
      h3: li.querySelector('h3')?.textContent,
      p: li.querySelector('p:not([data-cx="type"])')?.textContent,
      hasImg: !!li.querySelector('img'),
      imgSrc: li.querySelector('img')?.getAttribute('src')?.slice(0, 50)
    })))`
  });
  console.log('Journal Cards Info:', journalInfo?.result?.value);

  // Scroll to Portfolio Section & Screenshot
  await send('Runtime.evaluate', { expression: `
    const el = document.querySelector('[data-card="true"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  ` });
  await new Promise(r => setTimeout(r, 1000));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_portfolio_experience_first.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_portfolio_experience_first.png');
  }

  // Scroll to Journal Section & Screenshot
  await send('Runtime.evaluate', { expression: `
    const el = document.querySelector('section[aria-labelledby="journal-titel"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  ` });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_journal_restored.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_journal_restored.png');
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
