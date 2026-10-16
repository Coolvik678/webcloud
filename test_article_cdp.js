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
  await new Promise(r => ws.onopen = r);
  await send('Page.enable');

  // Test 1: Load 300-million-button page
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en/journal/300-million-button' });
  await new Promise(r => setTimeout(r, 2000));

  const shotArticleTop = await send('Page.captureScreenshot', { format: 'png' });
  if (shotArticleTop?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_300m_article_top.png'), Buffer.from(shotArticleTop.data, 'base64'));
  }

  // Scroll to Try it and Code window
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 500);` });
  await new Promise(r => setTimeout(r, 800));
  const shotArticleMid = await send('Page.captureScreenshot', { format: 'png' });
  if (shotArticleMid?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_300m_article_mid.png'), Buffer.from(shotArticleMid.data, 'base64'));
  }

  // Test 2: Check homepage journal links
  await send('Page.navigate', { url: 'http://127.0.0.1:8085/en' });
  await new Promise(r => setTimeout(r, 2000));

  const homeJournal = await send('Runtime.evaluate', {
    expression: `(() => {
      return Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] ul > li a')).map(a => ({
        text: a.querySelector('h3')?.textContent,
        href: a.getAttribute('href')
      }));
    })()`,
    returnByValue: true
  });
  console.log('HOMEPAGE JOURNAL LINKS:', JSON.stringify(homeJournal?.result?.value, null, 2));

  // Screenshot homepage journal
  await send('Runtime.evaluate', {
    expression: `document.querySelector('section[aria-labelledby="journal-titel"]')?.scrollIntoView({ block: "start" });`
  });
  await new Promise(r => setTimeout(r, 800));
  const shotHomeJournal = await send('Page.captureScreenshot', { format: 'png' });
  if (shotHomeJournal?.data) {
    fs.writeFileSync(path.join(__dirname, 'shot_homepage_journal_cards.png'), Buffer.from(shotHomeJournal.data, 'base64'));
  }

  console.log('VERIFICATION FINISHED');
  ws.close();
  chromeProc.kill();
  process.exit(0);
}
run().catch(err => { console.error(err); chromeProc.kill(); process.exit(1); });
