const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_loupe_check');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9671',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1800));
  let res = await fetch('http://127.0.0.1:9671/json/list');
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
  const logs = [];
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      logs.push(data.params.type + ': ' + data.params.args.map(a => a.value || a.description).join(' '));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      logs.push('EXCEPTION: ' + JSON.stringify(data.params.exceptionDetails?.exception?.description || data.params.exceptionDetails?.text));
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
  
  await new Promise(r => setTimeout(r, 2000));

  // Dispatch pointermove to wake up chunk 931736 dynamic import of loupe
  await send('Runtime.evaluate', {
    expression: `window.dispatchEvent(new PointerEvent('pointermove', { clientX: 200, clientY: 200 }));`
  });

  await new Promise(r => setTimeout(r, 2500));

  // 1. Audit State
  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        logo: document.querySelector('header a[aria-label*="home"]')?.textContent,
        cards: Array.from(document.querySelectorAll('[data-card="true"]')).map(c => ({
          h3: c.querySelector('h3')?.textContent,
          img: c.querySelector('img')?.getAttribute('src'),
          tag: c.querySelector('p.measure')?.textContent,
          lead: c.querySelector('p.lead')?.textContent
        })),
        journal: Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] ul > li')).map(j => ({
          tag: j.querySelector('.measure')?.textContent,
          h3: j.querySelector('h3')?.textContent,
          lead: j.querySelector('p.text-ink-2')?.textContent,
          note: j.querySelector('.secret-note')?.textContent
        })),
        contact: Array.from(document.querySelectorAll('footer div.md\\:col-span-3 ul li a')).map(a => a.textContent + ' -> ' + a.getAttribute('href')),
        loupeCanvas: !!document.getElementById('lupe-papier')
      };
    })()`,
    returnByValue: true
  });
  console.log('FINAL AUDIT:', JSON.stringify(state?.result?.value, null, 2));

  // Screenshot 1: Hero
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot1?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_hero.png'), Buffer.from(shot1.data, 'base64'));
  }

  // Screenshot 2: Card 1
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-card="true"]')[0]?.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot2?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_card1.png'), Buffer.from(shot2.data, 'base64'));
  }

  // Screenshot 3: Card 2
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-card="true"]')[1]?.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot3?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_card2.png'), Buffer.from(shot3.data, 'base64'));
  }

  // Screenshot 4: Card 3
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-card="true"]')[2]?.scrollIntoView({ block: "center" });`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot4?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_card3.png'), Buffer.from(shot4.data, 'base64'));
  }

  // Screenshot 5: Journal
  await send('Runtime.evaluate', {
    expression: `document.querySelector('section[aria-labelledby="journal-titel"]')?.scrollIntoView({ block: "start" });`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot5 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot5?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_journal.png'), Buffer.from(shot5.data, 'base64'));
  }

  // Screenshot 6: Footer
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.body.scrollHeight);`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot6 = await send('Page.captureScreenshot', { format: 'png' });
  if (shot6?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_footer.png'), Buffer.from(shot6.data, 'base64'));
  }

  console.log('DONE CAPTURING ALL SHOTS');
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
