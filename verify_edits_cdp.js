const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_verify_edits_2');
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
  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  
  await new Promise(r => setTimeout(r, 2000));

  // Pointermove for loupe
  await send('Runtime.evaluate', {
    expression: `window.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 200 }));`
  });

  await new Promise(r => setTimeout(r, 3000));

  // 1. Audit Result
  const audit = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('[data-card="true"]')).map(c => ({
        title: c.querySelector('h3')?.textContent,
        imgSrc: c.querySelector('img')?.getAttribute('src'),
        tag: c.querySelector('p.measure')?.textContent
      }));
      const jCards = Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] ul > li')).map(j => ({
        tag: j.querySelector('.measure')?.textContent,
        title: j.querySelector('h3')?.textContent,
        lead: j.querySelector('p.text-ink-2')?.textContent,
        note: j.querySelector('.secret-note')?.textContent
      }));
      return { cards, jCards };
    })()`,
    returnByValue: true
  });
  console.log('AUDIT RESULT 2:', JSON.stringify(audit?.result?.value, null, 2));

  // 2. Scroll to Card 1
  await send('Runtime.evaluate', {
    expression: `const c1 = document.querySelectorAll('[data-card="true"]')[0]; if (c1) c1.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotCard1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shotCard1 && shotCard1.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_verified_card1.png'), Buffer.from(shotCard1.data, 'base64'));
  }

  // 3. Scroll to Card 2
  await send('Runtime.evaluate', {
    expression: `const c2 = document.querySelectorAll('[data-card="true"]')[1]; if (c2) c2.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotCard2 = await send('Page.captureScreenshot', { format: 'png' });
  if (shotCard2 && shotCard2.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_verified_card2.png'), Buffer.from(shotCard2.data, 'base64'));
  }

  // 4. Scroll to Card 3
  await send('Runtime.evaluate', {
    expression: `const c3 = document.querySelectorAll('[data-card="true"]')[2]; if (c3) c3.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotCard3 = await send('Page.captureScreenshot', { format: 'png' });
  if (shotCard3 && shotCard3.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_verified_card3.png'), Buffer.from(shotCard3.data, 'base64'));
  }

  // 5. Scroll to Journal
  await send('Runtime.evaluate', {
    expression: `const j = document.querySelector('section[aria-labelledby="journal-titel"]'); if (j) j.scrollIntoView({ block: "start" });`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotJournal = await send('Page.captureScreenshot', { format: 'png' });
  if (shotJournal && shotJournal.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_verified_journal2.png'), Buffer.from(shotJournal.data, 'base64'));
  }

  // 6. Scroll to Footer
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.body.scrollHeight);`
  });
  await new Promise(r => setTimeout(r, 1200));
  const shotFooter = await send('Page.captureScreenshot', { format: 'png' });
  if (shotFooter && shotFooter.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_verified_footer2.png'), Buffer.from(shotFooter.data, 'base64'));
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
