const { execSync } = require('child_process');

const CHROME = '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"';

const pages = [
  { url: 'http://localhost:8085/en', out: 'c:\\Artificial_Intelligence_Local\\metic_clone\\final_verify_home.png', h: 1080 },
  { url: 'http://localhost:8085/en/start-project', out: 'c:\\Artificial_Intelligence_Local\\metic_clone\\final_verify_start_project.png', h: 1600 },
  { url: 'http://localhost:8085/en/work', out: 'c:\\Artificial_Intelligence_Local\\metic_clone\\final_verify_work.png', h: 1200 }
];

for (const p of pages) {
  const cmd = `${CHROME} --headless --disable-gpu --screenshot="${p.out}" --window-size=1440,${p.h} ${p.url}`;
  try {
    execSync(cmd);
    console.log(`Success: ${p.out}`);
  } catch (e) {
    console.error(`Failed ${p.out}:`, e.message);
  }
}
