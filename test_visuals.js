const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_profile_' + Date.now());

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9872',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9872/json/list');
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
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Audit Card 1
  await send('Runtime.evaluate', {
    expression: `const c1 = document.querySelectorAll('[data-card="true"]')[0]; if (c1) c1.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1000));
  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  if (s1?.data) fs.writeFileSync(path.join(__dirname, 'shot_card1_now.png'), Buffer.from(s1.data, 'base64'));

  // 2. Audit Card 2
  await send('Runtime.evaluate', {
    expression: `const c2 = document.querySelectorAll('[data-card="true"]')[1]; if (c2) c2.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1000));
  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  if (s2?.data) fs.writeFileSync(path.join(__dirname, 'shot_card2_now.png'), Buffer.from(s2.data, 'base64'));

  // 3. Audit Card 3
  await send('Runtime.evaluate', {
    expression: `const c3 = document.querySelectorAll('[data-card="true"]')[2]; if (c3) c3.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 1000));
  const s3 = await send('Page.captureScreenshot', { format: 'png' });
  if (s3?.data) fs.writeFileSync(path.join(__dirname, 'shot_card3_now.png'), Buffer.from(s3.data, 'base64'));

  // 4. Audit Journal
  await send('Runtime.evaluate', {
    expression: `const j = document.querySelector('section[aria-labelledby="journal-titel"]'); if (j) j.scrollIntoView({ block: "start" });`
  });
  await new Promise(r => setTimeout(r, 1000));
  const sj = await send('Page.captureScreenshot', { format: 'png' });
  if (sj?.data) fs.writeFileSync(path.join(__dirname, 'shot_journal_now.png'), Buffer.from(sj.data, 'base64'));

  // 5. Audit Footer
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.body.scrollHeight);`
  });
  await new Promise(r => setTimeout(r, 1000));
  const sf = await send('Page.captureScreenshot', { format: 'png' });
  if (sf?.data) fs.writeFileSync(path.join(__dirname, 'shot_footer_now.png'), Buffer.from(sf.data, 'base64'));

  console.log('ALL SCREENSHOTS CAPTURED');
  ws.close();
  chromeProc.kill();
  try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
