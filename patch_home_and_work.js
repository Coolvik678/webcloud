const fs = require('fs');
const path = require('path');

const LOGO_SVG = `<span class="inline-flex items-center gap-2 font-sans font-semibold tracking-[-0.03em]"><svg class="h-5 w-5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg><span>webcloud<span class="text-accent">.</span></span></span>`;

function patchHome(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Portfolio cards links
  html = html.replace('href="/en/work/gorw-table-tennis"', 'href="https://sobha-privy-collection.com/" target="_blank" rel="noopener noreferrer"');
  html = html.replace('href="/work/gorw-table-tennis"', 'href="https://sobha-privy-collection.com/" target="_blank" rel="noopener noreferrer"');

  html = html.replace('href="/en/work/dimbach-veterinary-practice"', 'href="https://thenest.pl/en" target="_blank" rel="noopener noreferrer"');
  html = html.replace('href="/work/dimbach-veterinary-practice"', 'href="https://thenest.pl/en" target="_blank" rel="noopener noreferrer"');

  html = html.replace('href="/en/work/portfolio-manuel-mayrhofer"', 'href="https://21oaks.org/" target="_blank" rel="noopener noreferrer"');
  html = html.replace('href="/work/portfolio-manuel-mayrhofer"', 'href="https://21oaks.org/" target="_blank" rel="noopener noreferrer"');

  // 2. Journal links: disable navigation to blank pages
  html = html.replace('href="/en/journal/on-youtube"', 'href="javascript:void(0)" style="cursor:default"');
  html = html.replace('href="/journal/on-youtube"', 'href="javascript:void(0)" style="cursor:default"');

  html = html.replace('href="/en/journal/why-i-dont-use-templates"', 'href="javascript:void(0)" style="cursor:default"');
  html = html.replace('href="/journal/why-i-dont-use-templates"', 'href="javascript:void(0)" style="cursor:default"');

  html = html.replace('href="/en/journal/200-milliseconds"', 'href="javascript:void(0)" style="cursor:default"');
  html = html.replace('href="/journal/200-milliseconds"', 'href="javascript:void(0)" style="cursor:default"');

  // 3. Logo in header & footer
  // Replace <span class="font-sans font-semibold tracking-[-0.03em]">metic<span class="text-accent">.</span></span>
  // or webcloud
  const logoRegex = /<a[^>]*aria-label="[^"]*home"[^>]*>[\s\S]*?<\/a>/gi;
  html = html.replace(logoRegex, (match) => {
    const hrefMatch = match.match(/href="([^"]+)"/);
    const href = hrefMatch ? hrefMatch[1] : '/en';
    return `<a class="flex h-11 items-center px-3 text-[1.375rem] leading-none" aria-label="webcloud. home" href="${href}">${LOGO_SVG}</a>`;
  });

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Successfully patched home: ${filePath}`);
}

patchHome('c:/Artificial_Intelligence_Local/metic_clone/en/index.html');
patchHome('c:/Artificial_Intelligence_Local/metic_clone/index.html');
patchHome('c:/Artificial_Intelligence_Local/metic_clone/en/work/index.html');
patchHome('c:/Artificial_Intelligence_Local/metic_clone/work/index.html');
