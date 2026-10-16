const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testScrollCapture() {
  const p = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    'http://localhost:8085/en'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://localhost:9223/json', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', async () => {
      const tabs = JSON.parse(data);
      const wsUrl = tabs[0].webSocketDebuggerUrl;
      const WebSocket = require('ws'); // If ws not installed, we can use simple http
      p.kill();
    });
  }).on('error', () => { p.kill(); });
}
