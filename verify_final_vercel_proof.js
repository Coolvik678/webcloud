const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile_final_vercel_proof');
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9682',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  let res = await fetch('http://127.0.0.1:9682/json/list');
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

  console.log('Navigating to live production: https://webcloud-corporation.vercel.app ...');
  await send('Page.navigate', { url: 'https://webcloud-corporation.vercel.app' });
  await new Promise(r => setTimeout(r, 4000));

  // Move mouse over magnifying glass
  for (let i = 0; i < 6; i++) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 600 + i * 40,
      y: 400 + i * 20
    });
    await new Promise(r => setTimeout(r, 100));
  }

  const shotHero = await send('Page.captureScreenshot', { format: 'png' });
  if (shotHero?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_vercel_hero.png'), Buffer.from(shotHero.data, 'base64'));
    console.log('Saved shot_final_vercel_hero.png');
  }

  // Scroll to build section (line and graph)
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1500);` });
  await new Promise(r => setTimeout(r, 1500));

  const shotBuild = await send('Page.captureScreenshot', { format: 'png' });
  if (shotBuild?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_vercel_build.png'), Buffer.from(shotBuild.data, 'base64'));
    console.log('Saved shot_final_vercel_build.png');
  }

  // Scroll to principles
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = Array.from(document.querySelectorAll('h3, h2, div')).find(e => 
        e.textContent.includes('A foundation built on excellence')
      );
      if (el) el.scrollIntoView({ block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotPrinciples = await send('Page.captureScreenshot', { format: 'png' });
  if (shotPrinciples?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_final_vercel_principles.png'), Buffer.from(shotPrinciples.data, 'base64'));
    console.log('Saved shot_final_vercel_principles.png');
  }

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        hasCanvas: !!document.querySelector('canvas'),
        buildText: document.body.innerText.includes('Build progress'),
        excellenceFound: document.body.innerText.includes('A foundation built on excellence'),
        bestPeopleFound: document.body.innerText.includes('The best people to help you'),
        codeByHandFound: document.body.innerText.includes('Code by hand'),
        oneNumberFound: document.body.innerText.includes('One number, one face')
      };
    })()`,
    returnByValue: true
  });
  console.log('FINAL VERCEL VERIFICATION:', JSON.stringify(check?.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
