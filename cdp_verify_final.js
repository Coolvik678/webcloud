const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_final');

try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9444',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  let res = await fetch('http://127.0.0.1:9444/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  if (!tab) {
    res = await fetch('http://127.0.0.1:9444/json/new', { method: 'PUT' });
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

  console.log('--- 1. Navigating to Home Page: http://127.0.0.1:8085/en ---');
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
    expression: `JSON.stringify(Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] a, a[href*="journal"]')).map(a => ({
      text: a.textContent.slice(0, 40),
      href: a.getAttribute('href'),
      cursor: a.style.cursor
    })))`
  });
  console.log('Journal Cards:', journalInfo?.result?.value);

  // Scroll to Portfolio Section & Screenshot
  await send('Runtime.evaluate', { expression: `
    const el = document.querySelector('[data-card="true"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  ` });
  await new Promise(r => setTimeout(r, 1000));
  let shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_portfolio_section.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_portfolio_section.png');
  }

  // Scroll to Journal Section & Screenshot
  await send('Runtime.evaluate', { expression: `
    const el = document.querySelector('section[aria-labelledby="journal-titel"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  ` });
  await new Promise(r => setTimeout(r, 1000));
  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_journal_section.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_journal_section.png');
  }

  console.log('--- 2. Navigating to Start Project: http://127.0.0.1:8085/en/start-project ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en/start-project' });
  await new Promise(r => setTimeout(r, 2000));

  // Test Interactive Draft Drawing
  await send('Runtime.evaluate', { expression: `
    const nameInput = document.querySelector('#f-name');
    if (nameInput) { nameInput.value = 'Alexander Wright'; nameInput.dispatchEvent(new Event('input', { bubbles: true })); }

    const compInput = document.querySelector('#f-company');
    if (compInput) { compInput.value = 'Apex Holdings'; compInput.dispatchEvent(new Event('input', { bubbles: true })); }

    const siteInput = document.querySelector('#f-existingSite');
    if (siteInput) { siteInput.value = 'https://apexholdings.co'; siteInput.dispatchEvent(new Event('input', { bubbles: true })); }

    const msgInput = document.querySelector('#f-message');
    if (msgInput) { msgInput.value = 'We require an ultra-luxury digital architecture platform with 3D WebGL showcase and interactive lead scheduling.'; msgInput.dispatchEvent(new Event('input', { bubbles: true })); }

    const chip1 = document.querySelector('input[value="website"]');
    if (chip1) { chip1.checked = true; chip1.dispatchEvent(new Event('change', { bubbles: true })); }

    const budget1 = document.querySelector('input[value="b3"]');
    if (budget1) { budget1.checked = true; budget1.dispatchEvent(new Event('change', { bubbles: true })); }

    const time1 = document.querySelector('input[value="asap"]');
    if (time1) { time1.checked = true; time1.dispatchEvent(new Event('change', { bubbles: true })); }
  ` });

  await new Promise(r => setTimeout(r, 1000));

  const draftState = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      draftCount: document.querySelector('.build-count-value')?.textContent,
      browserUrl: document.querySelector('.frame-url')?.textContent,
      wordsCount: document.querySelector('.measure .text-ink.tabular-nums')?.textContent,
      budgetLabel: document.querySelector('dl > div:nth-child(1) dt span.text-ink')?.textContent,
      timingLabel: document.querySelector('dl > div:nth-child(2) dt span.text-ink')?.textContent
    })`
  });
  console.log('Interactive Draft State after user input:', draftState?.result?.value);

  shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_start_project_interactive.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_start_project_interactive.png');
  }

  ws.close();
  chromeProc.kill();
  console.log('All CDP Verification tests finished successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  chromeProc.kill();
  process.exit(1);
});
