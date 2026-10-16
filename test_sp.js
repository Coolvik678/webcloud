const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');

async function testStartProject() {
  console.log('Testing http://localhost:8085/en/start-project ...');
  // Use curl or chrome
  const cmd = `chrome --headless --disable-gpu --screenshot="c:\\Artificial_Intelligence_Local\\metic_clone\\start_project_test.png" --window-size=1440,1080 http://localhost:8085/en/start-project`;
  try {
    execSync(cmd);
    console.log('Screenshot saved to start_project_test.png');
  } catch (e) {
    console.error('Error running chrome:', e.message);
  }
}

testStartProject();
