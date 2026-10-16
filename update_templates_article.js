const fs = require('fs');
const path = require('path');

const targets = [
  'en/journal/why-i-dont-use-templates/index.html',
  'journal/why-i-dont-use-templates/index.html'
];

targets.forEach(rel => {
  const p = path.join(__dirname, rel);
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, 'utf8');

  // Fix title & meta
  html = html.replace(/<title>.*?<\/title>/, '<title>Why WebCloud doesn’t use templates | WebCloud Corporation</title>');
  html = html.replace(/content="Why I don’t use templates"/g, 'content="Why WebCloud doesn’t use templates"');
  html = html.replace(/Why I don’t make that trade, and when it still makes sense\./g, "Why WebCloud doesn't make that trade, and when bespoke digital engineering wins.");

  // Fix kinetic title
  const oldH1 = '<h1 data-reveal="focus" class="display-1"';
  if (html.includes(oldH1)) {
    const h1Start = html.indexOf(oldH1);
    const h1End = html.indexOf('</h1>', h1Start) + 5;
    const newH1 = `<h1 data-reveal="focus" class="display-1 kinetic-wobble-target" style="--i:0" data-x="Heading" data-x-font="true" data-x-color="true">
          <span class="kinetic">
            <span class="sr-only">Why WebCloud doesn’t use templates</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="W" class="kinetic-char"></span><span data-char="true" data-ch="h" class="kinetic-char"></span><span data-char="true" data-ch="y" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="W" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span><span data-char="true" data-ch="b" class="kinetic-char"></span><span data-char="true" data-ch="C" class="kinetic-char"></span><span data-char="true" data-ch="l" class="kinetic-char"></span><span data-char="true" data-ch="o" class="kinetic-char"></span><span data-char="true" data-ch="u" class="kinetic-char"></span><span data-char="true" data-ch="d" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="d" class="kinetic-char"></span><span data-char="true" data-ch="o" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span><span data-char="true" data-ch="s" class="kinetic-char"></span><span data-char="true" data-ch="n" class="kinetic-char"></span><span data-char="true" data-ch="’" class="kinetic-char"></span><span data-char="true" data-ch="t" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="u" class="kinetic-char"></span><span data-char="true" data-ch="s" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span>&nbsp;</span>
            <span aria-hidden="true" class="kinetic-word"><span data-char="true" data-ch="t" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span><span data-char="true" data-ch="m" class="kinetic-char"></span><span data-char="true" data-ch="p" class="kinetic-char"></span><span data-char="true" data-ch="l" class="kinetic-char"></span><span data-char="true" data-ch="a" class="kinetic-char"></span><span data-char="true" data-ch="t" class="kinetic-char"></span><span data-char="true" data-ch="e" class="kinetic-char"></span><span data-char="true" data-ch="s" class="kinetic-char"></span></span>
          </span>
        </h1>`;
    html = html.substring(0, h1Start) + newH1 + html.substring(h1End);
  }

  // Ensure cover image and text have no gap and are forced visible
  const styleInject = `<style>
    [data-reveal=clip] > *, [data-reveal] {
      clip-path: none !important;
      opacity: 1 !important;
      filter: none !important;
      transform: none !important;
      visibility: visible !important;
    }
  </style>`;
  if (!html.includes('clip-path: none !important')) {
    html = html.replace('</head>', styleInject + '\n</head>');
  }

  // Update prose copy
  const oldProse = '<div class="prose mx-auto"><p>There is a good reason site builders are so successful';
  if (html.includes(oldProse)) {
    const proseStart = html.indexOf(oldProse);
    const proseEnd = html.indexOf('</div></div></section>', proseStart);
    const newProse = `<div class="prose mx-auto">
      <p>There is a good reason site builders are so successful: they work. In three days you have a generic page with a contact form. For quick experiments, that is fine. But for a growing business, the hidden cost is immense.</p>
      <p>The price isn't the software subscription. The price is that your site looks like ten thousand others. The same template, the same spacing, the same forgettable layout. Visitors do not notice it consciously, but they do not remember anything either.</p>
      <p>Then there is the technical reality: a site builder has to cater to every possible use case, so it ships unnecessary bloat. Megabytes of redundant JavaScript for a page with four paragraphs. That destroys your Core Web Vitals, kills organic search ranking, and bounces visitors on mobile connections.</p>
      <p>WebCloud engineers every website from the first pixel. Clean architecture, bespoke interactivity, and zero unnecessary dependencies. That is not purism — that is arithmetic.</p>
      <p>Our rule of thumb: if you can afford to be interchangeable, take a template. If your brand demands distinct identity and peak performance, WebCloud is here to build it.</p>
    `;
    html = html.substring(0, proseStart) + newProse + html.substring(proseEnd);
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log('Updated templates article:', rel);
});
