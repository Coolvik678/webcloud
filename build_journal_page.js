const fs = require('fs');
const path = require('path');

const srcPath = 'c:/Artificial_Intelligence_Local/metic_clone/en/journal/why-i-dont-use-templates/index.html';
const rawHtml = fs.readFileSync(srcPath, 'utf8');

const artStart = rawHtml.indexOf('<article>');
const artEnd = rawHtml.indexOf('</article>') + 10;

const preArticle = rawHtml.slice(0, artStart);
const postArticle = rawHtml.slice(artEnd);

const articleContent = `<article>
  <section class="shell frame pb-10 pt-[calc(var(--nav-h)+3rem)] md:pt-[calc(var(--nav-h)+5rem)]">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <p class="measure flex flex-wrap gap-x-[1.2em]">
        <span>Million Dollar Details</span>
        <span>·</span>
        <span>01/03</span>
        <span>·</span>
        <span>Insight</span>
        <time dateTime="2026-10-21T08:00:00.000Z">21 October 2026</time>
        <span>·</span>
        <span>2 min read</span>
      </p>
      <div class="relative mt-4">
        <h1 data-reveal="focus" class="display-1 kinetic-wobble-target" style="--i:0" data-x="Heading" data-x-font="true" data-x-color="true" data-note="Optical size and width of the type follow the line. Nothing is scaled.">
          <span class="kinetic">
            <span class="sr-only">The $300 million button</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="T" class="kinetic-char"></span><span data-char="true" data-ch="h" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="$" class="kinetic-char"></span><span data-char="true" data-ch="3" class="kinetic-char"></span><span data-char="true" data-ch="0" class="kinetic-char"></span><span data-char="true" data-ch="0" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="m" class="kinetic-char"></span><span data-char="true" data-ch="i" class="kinetic-char"></span><span data-char="true" data-ch="l" class="kinetic-char"></span><span data-char="true" data-ch="l" class="kinetic-char"></span><span data-char="true" data-ch="i" class="kinetic-char"></span><span data-char="true" data-ch="o" class="kinetic-char"></span><span data-char="true" data-ch="n" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="b" class="kinetic-char"></span><span data-char="true" data-ch="u" class="kinetic-char"></span><span data-char="true" data-ch="t" class="kinetic-char"></span><span data-char="true" data-ch="t" class="kinetic-char"></span><span data-char="true" data-ch="o" class="kinetic-char"></span><span data-char="true" data-ch="n" class="kinetic-char"></span></span>
          </span>
        </h1>
      </div>
      <p class="lead mt-6 max-w-[48ch]">An online store changed one button and made $300 million more in a year. Here is the button from the reel: live, with all nine details, ready to copy.</p>
    </div>
  </section>

  <!-- 01 Try It Comparison Box -->
  <section class="shell frame mt-10 md:mt-16">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <div class="measure text-accent font-mono mb-2">01</div>
      <h2 class="display-3 mb-2">Try it</h2>
      <p class="text-ink-2 max-w-[50ch] mb-6">Hover it, move around it, press it. On the left: the browser default, on the right: the one from the reel.</p>
      
      <div class="relative overflow-hidden rounded-[var(--radius-media)] border border-line bg-paper-2 p-8 md:p-14 flex flex-col md:flex-row items-center justify-around gap-10">
        <!-- Left: Default -->
        <div class="flex flex-col items-center gap-3">
          <button type="button" class="px-3 py-1.5 bg-[#e9e9ed] text-[#1c1c1e] text-[13px] font-sans border border-[#8e8e93] rounded-[4px] cursor-pointer shadow-sm active:bg-[#d1d1d6]">
            Start a project
          </button>
          <span class="text-xs font-mono text-ink-2 opacity-60">default button</span>
        </div>

        <div class="h-px w-24 bg-line md:h-24 md:w-px"></div>

        <!-- Right: WebCloud 9-Detail Button -->
        <div class="flex flex-col items-center gap-3">
          <a class="btn btn-primary interactive-spring-btn" href="/en/start-project">
            <span class="btn-glow" aria-hidden="true"></span>
            <span class="relative">Start a project</span>
            <span class="btn-dot" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
              </svg>
            </span>
          </a>
          <span class="text-xs font-mono text-accent">nine details tuned</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 02 The Code Window -->
  <section class="shell frame mt-16 md:mt-24">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <div class="measure text-accent font-mono mb-2">02</div>
      <h2 class="display-3 mb-2">The button, ready to copy</h2>
      <p class="text-ink-2 max-w-[50ch] mb-6">Plain HTML, CSS and JavaScript. Every detail from the reel is marked in the CSS.</p>

      <div class="overflow-hidden rounded-[var(--radius-media)] border border-line bg-[#0c0c0e] text-[#f2efe9] shadow-2xl">
        <div class="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#141418]">
          <span class="font-mono text-xs text-white/60">pill-button.html</span>
          <button type="button" id="copy-code-btn" class="rounded px-2.5 py-1 text-xs font-mono bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer" onclick="navigator.clipboard.writeText(document.querySelector('#code-block-src').innerText); this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy code', 2000);">
            Copy code
          </button>
        </div>
        <div class="overflow-x-auto p-4 md:p-6 font-mono text-[13px] leading-relaxed select-all">
          <pre id="code-block-src" class="text-[#f2efe9]"><code>&lt;!-- 1. Button Container --&gt;
&lt;a class="pill-btn" href="/start-project"&gt;
  &lt;span class="glow" aria-hidden="true"&gt;&lt;/span&gt;
  &lt;span class="text"&gt;Start a project&lt;/span&gt;
  &lt;span class="dot"&gt;
    &lt;svg viewBox="0 0 256 256"&gt;
      &lt;path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"/&gt;
    &lt;/svg&gt;
  &lt;/span&gt;
&lt;/a&gt;

&lt;style&gt;
/* The 9 Details: Height, Pill Shape, Space Grotesk, Color, Red Dot, 45deg Hover, Glow, Magnet, Spring */
.pill-btn {
  height: 52px;              /* Detail 1: Size 52px */
  border-radius: 999px;      /* Detail 2: Full pill */
  font-family: 'Space Grotesk', sans-serif; /* Detail 3: Type */
  background: #121214;       /* Detail 4: Color */
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  padding: 0 1.5rem;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.pill-btn:hover .dot svg {
  transform: rotate(45deg);  /* Detail 6: 45deg rotation */
  transition: transform 300ms ease;
}
.pill-btn:active {
  transform: scale(0.97);    /* Detail 9: Press scale .97 */
}
&lt;/style&gt;</code></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- The Story -->
  <section class="shell frame mt-16 md:mt-24">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <h2 class="display-3 mb-6">The story</h2>
      <div class="prose mx-auto text-ink-2 leading-relaxed space-y-4">
        <p>UX researcher Jared Spool tells it like this: a large online store asked customers to log in or register before checkout. They replaced the "Register" button with "Continue" and a note that nobody needs an account to buy. 45% more customers completed their purchase, worth an extra $300 million in the first year.</p>
        <p>Google once tested 41 shades of blue for its links. According to Dan Cobley, then head of Google UK, the winning shade brought in an extra $200 million a year in ad revenue.</p>
      </div>
    </div>
  </section>

  <!-- The Nine Details -->
  <section class="shell frame mt-16 md:mt-20">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <h2 class="display-3 mb-6">The nine details</h2>
      <ul class="grid gap-3 text-sm md:text-base text-ink-2 list-disc pl-5">
        <li><strong>Size:</strong> 52 px tall, comfortably above the 44 px minimum thumb target.</li>
        <li><strong>Shape:</strong> a full pill (border-radius: 999px).</li>
        <li><strong>Type:</strong> a real font, Space Grotesk 500.</li>
        <li><strong>Color:</strong> almost black, #121214.</li>
        <li><strong>Signal:</strong> one red dot with an arrow.</li>
        <li><strong>Hover:</strong> the arrow turns 45° in 300 ms.</li>
        <li><strong>Light:</strong> a soft glow follows your cursor.</li>
        <li><strong>Magnet:</strong> it leans toward you, with a spring.</li>
        <li><strong>Press:</strong> it gives a little, scale .97.</li>
      </ul>
    </div>
  </section>

  <!-- Sources -->
  <section class="shell frame mt-12 md:mt-16">
    <div data-reveal="up" class="mx-auto max-w-[62rem]" style="--i:0">
      <h3 class="font-sans font-semibold text-lg mb-3">Sources</h3>
      <ul class="grid gap-1.5 text-sm">
        <li><a class="underline text-accent" href="https://articles.uie.com/three_hund_mil_button/" target="_blank" rel="noopener noreferrer">Jared Spool, "The $300 Million Button"</a></li>
        <li><a class="underline text-accent" href="https://www.theguardian.com/technology/2014/feb/05/why-google-engineers-designers" target="_blank" rel="noopener noreferrer">Google's 41 shades of blue (Dan Cobley)</a></li>
      </ul>
    </div>
  </section>

  <!-- CTA Box -->
  <section class="shell frame mt-16 md:mt-24">
    <div data-reveal="up" class="mx-auto max-w-[62rem] p-8 md:p-12 rounded-[var(--radius-media)] border border-line bg-paper-2 flex flex-col md:flex-row items-center justify-between gap-6" style="--i:0">
      <div>
        <h3 class="display-4 font-semibold">Want details like this on your website?</h3>
        <p class="text-ink-2 mt-1">Bespoke digital architecture engineered to convert.</p>
      </div>
      <a class="btn btn-primary shrink-0" href="/en/start-project">
        <span class="btn-glow" aria-hidden="true"></span>
        <span class="relative">Start a project</span>
        <span class="btn-dot" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
          </svg>
        </span>
      </a>
    </div>
  </section>

  <!-- Next Article and Back to Journal -->
  <section class="shell frame mt-24 md:mt-32">
    <div class="mx-auto max-w-[62rem]">
      <a class="group rule flex items-end justify-between gap-6 pt-8" href="/en/journal/why-i-dont-use-templates">
        <div>
          <p class="measure">Next article</p>
          <p class="display-3 mt-2 transition-colors duration-300 group-hover:text-accent-deep">Why WebCloud doesn't use templates</p>
        </div>
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-[var(--ease-lens)] group-hover:rotate-45">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
            <path d="M204,64V168a12,12,0,0,1-24,0V93L72.49,200.49a12,12,0,0,1-17-17L163,76H88a12,12,0,0,1,0-24H192A12,12,0,0,1,204,64Z"></path>
          </svg>
        </span>
      </a>
      <a class="link mt-8 inline-block text-sm" href="/en/journal">Back to the journal</a>
    </div>
  </section>
</article>`;

let newHtml = preArticle + articleContent + postArticle;
newHtml = newHtml.replace('<title>Why I don’t use templates | WebCloud.</title>', '<title>The $300 million button | WebCloud Corporation</title>');

fs.writeFileSync('c:/Artificial_Intelligence_Local/metic_clone/en/journal/300-million-button/index.html', newHtml, 'utf8');
fs.writeFileSync('c:/Artificial_Intelligence_Local/metic_clone/journal/300-million-button/index.html', newHtml, 'utf8');

console.log('SUCCESS: Written 300-million-button/index.html to both en/ and root');
