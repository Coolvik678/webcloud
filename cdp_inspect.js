const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(__dirname, '.chrome_debug_profile');

// Clean profile dir if needed
try { fs.rmSync(USER_DATA, { recursive: true, force: true }); } catch (e) {}

const chromeProc = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9333',
  '--remote-allow-origins=*',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1500));

  let res = await fetch('http://127.0.0.1:9333/json/version');
  let ver = await res.json();
  console.log('Connected to Chrome:', ver.Browser);

  res = await fetch('http://127.0.0.1:9333/json/list');
  let targets = await res.json();
  let tab = targets.find(t => t.type === 'page');
  if (!tab) {
    res = await fetch('http://127.0.0.1:9333/json/new', { method: 'PUT' });
    tab = await res.json();
  }
  console.log('Opened tab:', tab.webSocketDebuggerUrl);

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
    if (data.method === 'Console.messageAdded') {
      console.log('[BROWSER CONSOLE]', data.params.message.level, data.params.message.text);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      const args = data.params.args.map(a => a.value ?? a.description ?? JSON.stringify(a)).join(' ');
      console.log(`[CONSOLE ${data.params.type.toUpperCase()}]`, args);
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', JSON.stringify(data.params.exceptionDetails));
    }
  };

  await new Promise(r => ws.onopen = r);

  await send('Runtime.enable');
  await send('Console.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });

  console.log('Waiting 5s for page execution...');
  await new Promise(r => setTimeout(r, 5000));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot && shot.data) {
    fs.writeFileSync(path.join(__dirname, 'cdp_screen_5s.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved cdp_screen_5s.png');
  }

  // Check DOM state
  const evalIntro = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      classList: document.documentElement.className,
      sessionStorageIntro: sessionStorage.getItem('webcloud-intro'),
      canvases: document.querySelectorAll('canvas').length,
      preloaderDisplay: getComputedStyle(document.querySelector('.preloader') || document.body).display,
      bodyChildren: document.body.children.length,
      title: document.title,
      h1: document.querySelector('h1')?.textContent,
      h2: document.querySelector('h2')?.textContent,
      lensVisible: !!document.querySelector('.lens-scope, .radar, canvas')
    })`
  });

  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 14500);' });
  await new Promise(r => setTimeout(r, 1500));
  const shotFooter = await send('Page.captureScreenshot', { format: 'png' });
  if (shotFooter && shotFooter.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_footer_verified.png'), Buffer.from(shotFooter.data, 'base64'));
    console.log('Saved shot_footer_verified.png');
  }

  const evalVerification = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      heroLead: document.querySelector('.hero-lead p.lead')?.textContent,
      navWordmark: document.querySelector('header a[aria-label*="home"] span')?.textContent,
      footerWordmark: document.querySelector('footer a[aria-label*="home"] span')?.textContent,
      footerTagline: document.querySelector('footer p.text-ink-2')?.textContent,
      footerOrigin: document.querySelector('footer p.measure')?.textContent,
      footerCopyright: document.querySelector('footer .rule p')?.textContent,
      whatsappLinks: Array.from(document.querySelectorAll('a[href*="wa.me"]')).length,
      youtubeLinks: Array.from(document.querySelectorAll('a[href*="youtube"]')).length
    })`
  });
  console.log('Verification Data:', evalVerification?.result?.value);

  const evalCards = await send('Runtime.evaluate', {
    expression: `JSON.stringify(Array.from(document.querySelectorAll('section')).map(s => ({
      id: s.id || s.getAttribute('aria-labelledby') || s.className.slice(0, 30),
      h2: s.querySelector('h2')?.textContent,
      h3: Array.from(s.querySelectorAll('h3')).map(h => h.textContent)
    })))`
  });
  console.log('Sections on page:', evalCards?.result?.value);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test error:', err);
  chromeProc.kill();
  process.exit(1);
});
