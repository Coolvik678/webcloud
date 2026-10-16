/**
 * WebCloud Production Engine
 * Complete client transformations:
 * 1. Favicon & Document Title (WebCloud Corporation)
 * 2. Header & Footer Brand Logo with stylized W. geometric mark
 * 3. Portfolio Card Images, Titles, and Direct Routing (WebCloud 3D Flagship, Sobha Privy, The Nest)
 * 4. Permanent Journal Articles:
 *    - Card 1: The $300 million button (/en/journal/300-million-button)
 *    - Card 2: Why WebCloud doesn't use templates (/en/journal/why-i-dont-use-templates)
 *    - Card 3: The 200 milliseconds that decide everything (/en/journal/200-milliseconds)
 *    - All articles: /en/journal
 * 5. Contact Details (myovik@gmail.com, WhatsApp +91 90768 88172, remove Austrian addresses)
 * 6. Floating WhatsApp Contact Button
 * 7. Start Project Direct WhatsApp Lead Dispatch
 */
(function() {
  'use strict';

  var WA_PHONE = '919076888172';
  var WA_URL = 'https://wa.me/' + WA_PHONE;
  var IG_URL = 'https://www.instagram.com/webcloud_coorp/';
  var GMAIL = 'myovik@gmail.com';

  var PORTFOLIO_DATA = [
    {
      title: 'WebCloud 3D Flagship Experience',
      tag: '3D WebGL · Flagship 2026',
      lead: 'Interactive 3D digital flagship and immersive hardware tour engineered with Three.js and spatial audio.',
      secret: 'Next-Gen Flagship.',
      img: '/api/media/file/webcloud-3d-flagship.png',
      url: 'https://webcloud-3d-flagship.vercel.app/'
    },
    {
      title: 'Sobha Privy Collection',
      tag: 'Ultra-Luxury Real Estate · Dubai',
      lead: 'Ultra-luxury waterfront residences and architectural marvel in Dubai.',
      secret: 'Dubai Luxury.',
      img: '/api/media/file/sobha-privy.png',
      url: 'https://sobha-privy-collection.com/'
    },
    {
      title: 'The Nest Sanctuary',
      tag: 'Modern Workspace · Warsaw',
      lead: 'Bespoke modern workspace and architectural sanctuary in Warsaw.',
      secret: 'Warsaw Workspace.',
      img: '/api/media/file/thenest.webp',
      url: 'https://thenest.pl/en'
    }
  ];

  var JOURNAL_DATA = [
    {
      tag: 'Million Dollar Details · 01/03',
      title: 'The $300 million button',
      lead: 'An online store changed one button and made $300 million more in a year. Here is the button from the reel: live, with all nine details, ready to copy.',
      url: '/en/journal/300-million-button',
      note: 'Nine details tuned.'
    },
    {
      tag: 'Million Dollar Details · 02/03',
      title: 'The $20 billion default',
      lead: 'In 2022, Google paid Apple about $20 billion for one preselected option. Here is a dropdown that shows its default loud and clear: live, with all nine details, ready to copy.',
      url: '/en/journal/20-billion-default',
      note: 'Nine details tuned.'
    },
    {
      tag: 'Insight · Architecture',
      title: "Why WebCloud doesn't use templates",
      lead: "A site builder saves three weeks and costs you recognisability. Why WebCloud doesn't make that trade, and when bespoke engineering wins.",
      url: '/en/journal/why-i-dont-use-templates',
      note: 'Craft over shortcuts.'
    }
  ];

  // 1. Title & Favicon
  function applyDocumentMetadata() {
    if (!document.title.includes('WebCloud')) {
      document.title = 'WebCloud Corporation';
    }

    var existingIcons = document.querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']");
    if (existingIcons.length > 0) {
      existingIcons.forEach(function(l) {
        if (!l.href.includes('favicon.svg')) {
          l.href = '/favicon.svg?v=wc';
          l.type = 'image/svg+xml';
        }
      });
    } else {
      var icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      icon.href = '/favicon.svg?v=wc';
      document.head.appendChild(icon);
    }
  }

  // 2. Preloader Safety Guard
  try {
    window.sessionStorage.setItem('metic-intro', '1');
    setTimeout(function() {
      var p = document.querySelector('.preloader');
      if (p) {
        p.style.opacity = '0';
        p.style.pointerEvents = 'none';
        setTimeout(function() { p.style.display = 'none'; }, 400);
      }
      document.documentElement.classList.remove('intro');
      if (document.body) document.body.style.overflow = '';
    }, 1200);
  } catch(e) {}

  // 3. Brand & Content Transformations
  function applyDecorations() {
    applyDocumentMetadata();

    // A. Logo Mark: Stylized W. geometric mark + WebCloud Corporation
    var LOGO_HTML = '<span class="inline-flex items-center gap-2.5 font-sans font-semibold tracking-[-0.03em]">' +
      '<svg class="h-6 w-6 shrink-0" viewBox="0 0 32 32" fill="none">' +
        '<rect width="32" height="32" rx="6" fill="#0a0a0b"/>' +
        '<path d="M6 12L10 21L14 15L18 21L22 12" stroke="#f2efe9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="26" cy="20" r="2.2" fill="#ff3e3e"/>' +
      '</svg>' +
      '<span class="text-ink">WebCloud Corporation<span class="text-accent">.</span></span>' +
    '</span>';

    document.querySelectorAll('header a[aria-label*="home"], footer a[aria-label*="home"]').forEach(function(a) {
      if (a.getAttribute('aria-label') !== 'WebCloud Corporation home') {
        a.setAttribute('aria-label', 'WebCloud Corporation home');
        a.innerHTML = LOGO_HTML;
      }
    });

    // B. Portfolio Cards (Images + Copy)
    var cards = document.querySelectorAll('[data-card="true"]');
    cards.forEach(function(card, idx) {
      if (idx < PORTFOLIO_DATA.length) {
        var data = PORTFOLIO_DATA[idx];

        // 1. Swap Image & strip srcset
        var img = card.querySelector('img');
        if (img && img.getAttribute('src') !== data.img) {
          img.removeAttribute('srcset');
          img.src = data.img;
          img.alt = data.title;
        }

        // 2. Headline
        var h3 = card.querySelector('h3');
        if (h3 && !card.dataset.wcTitleDone) {
          card.dataset.wcTitleDone = 'true';
          h3.innerHTML = data.title + ' &nearr;';
        }

        // 3. Category / Tag
        var cat = card.querySelector('p.measure');
        if (cat) {
          cat.textContent = data.tag;
        }

        // 4. Lead copy
        var lead = card.querySelector('p.lead');
        if (lead) {
          lead.textContent = data.lead;
        }

        // 5. Secret note
        var secret = card.querySelector('.secret-note');
        if (secret) {
          secret.textContent = data.secret;
        }
      }
    });

    // C. Permanent Journal Section on Homepage
    var journalSection = document.querySelector('section[aria-labelledby="journal-titel"]');
    if (journalSection) {
      var allLink = journalSection.querySelector('a[href*="journal"]');
      if (allLink) {
        allLink.href = '/en/journal';
        allLink.removeAttribute('target');
      }

      var jCards = journalSection.querySelectorAll('ul > li');
      jCards.forEach(function(li, idx) {
        if (idx < JOURNAL_DATA.length) {
          var jData = JOURNAL_DATA[idx];

          var a = li.querySelector('a');
          if (a) {
            a.href = jData.url;
            a.removeAttribute('target');
          }

          var tag = li.querySelector('.measure');
          if (tag) tag.textContent = jData.tag;

          var h3 = li.querySelector('h3');
          if (h3) h3.textContent = jData.title;

          var lead = li.querySelector('p.text-ink-2');
          if (lead) lead.textContent = jData.lead;

          var note = li.querySelector('.secret-note');
          if (note) note.textContent = jData.note;
        }
      });
    }

    // D. Contact Information (myovik@gmail.com, WhatsApp, remove Austrian address)
    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
      a.href = 'mailto:' + GMAIL;
      if (a.textContent.indexOf('@') !== -1) {
        a.textContent = GMAIL;
      }
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function(a) {
      a.href = WA_URL;
      a.textContent = '+91 90768 88172';
    });

    // Remove Austrian addresses
    document.querySelectorAll('footer ul li, section ul li, #hauptmenu li').forEach(function(li) {
      var text = li.textContent;
      if (text.indexOf('Linden 118') !== -1 || text.indexOf('Mühlviertel') !== -1) {
        li.style.display = 'none';
      }
    });

    // Menu address note cleanup
    document.querySelectorAll('#hauptmenu p').forEach(function(p) {
      if (p.textContent.indexOf('St. Georgen') !== -1 || p.textContent.indexOf('Upper Austria') !== -1) {
        p.textContent = 'WebCloud Digital Architecture';
      }
    });

    // Footer brand description update
    document.querySelectorAll('footer p').forEach(function(p) {
      var t = p.textContent;
      if (t.indexOf('St. Georgen') !== -1 || t.indexOf('Upper Austria') !== -1) {
        p.textContent = 'Web and digital architecture studio. Bespoke high-performance digital experiences and 3D web applications.';
      } else if (t.indexOf('meticulous:') !== -1) {
        p.textContent = 'WebCloud Corporation: engineered with precision.';
      }
    });

    // Principles & Brand phrases sanitization
    document.querySelectorAll('h3, h2, p, span, li').forEach(function(el) {
      if (el.children.length === 0 || el.children.length === 1 && el.querySelector('span')) {
        var txt = el.textContent.trim();
        if (txt.includes('Code by hand') || txt.includes('Code by hand.')) {
          el.textContent = 'A foundation built on excellence.';
        } else if (txt.includes('One number, one face') || txt.includes('One number 1') || txt.includes('1 number 1')) {
          el.textContent = 'The best people to help you.';
        } else if (txt.includes('Lean, readable source code instead of generated bloat')) {
          el.textContent = 'Engineered from the ground up with precision architecture, clean systems, and zero compromise on performance.';
        } else if (txt.includes('You talk to the person who designs') || txt.includes('No hotline, no forwarding')) {
          el.textContent = 'Direct partnership with elite digital architects. Strategic guidance, seamless execution, and dedicated support from start to finish.';
        }
      }
    });

    // Resolve any Next.js image optimizer paths directly to static assets
    document.querySelectorAll('img').forEach(function(img) {
      if (img.src && img.src.indexOf('/_next/image') !== -1) {
        var match = img.src.match(/url=([^&]+)/);
        if (match) {
          var realPath = decodeURIComponent(match[1]);
          img.src = realPath.charAt(0) === '/' ? realPath : '/' + realPath;
        }
      }
      if (img.srcset && img.srcset.indexOf('/_next/image') !== -1) {
        img.srcset = img.srcset.replace(/\/_next\/image\?url=%2F([^&]+)[^,\s]*/g, '/$1');
      }
    });

    // Footer copyright update
    document.querySelectorAll('footer .rule div, footer .rule p, footer').forEach(function(el) {
      if (el.childNodes) {
        el.childNodes.forEach(function(node) {
          if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf('metic') !== -1) {
            node.nodeValue = node.nodeValue.replace(/metic\.\s*·\s*Manuel Mayrhofer/g, 'WebCloud Corporation');
          }
        });
      }
    });

    // Social Links in Footer: item 5 is Instagram, item 6 is WhatsApp
    var contactUl = document.querySelector('footer div.md\\:col-span-3 ul');
    if (contactUl) {
      var lis = contactUl.querySelectorAll('li');
      lis.forEach(function(li) {
        var a = li.querySelector('a');
        if (a) {
          var txt = a.textContent.trim().toLowerCase();
          var href = (a.getAttribute('href') || '').toLowerCase();
          if (txt === 'instagram' || href.indexOf('instagram') !== -1) {
            a.textContent = 'Instagram';
            a.href = IG_URL;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          } else if (txt === 'youtube' || href.indexOf('youtube') !== -1 || txt === 'whatsapp' || href.indexOf('wa.me') !== -1) {
            a.textContent = 'WhatsApp';
            a.href = WA_URL + '?text=' + encodeURIComponent('Hello WebCloud!');
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }
        }
      });
    }

    // E. Floating WhatsApp Button
    if (!document.getElementById('webcloud-floating-whatsapp')) {
      var fab = document.createElement('a');
      fab.id = 'webcloud-floating-whatsapp';
      fab.href = WA_URL + '?text=' + encodeURIComponent('Hi WebCloud, I would like to discuss a project.');
      fab.target = '_blank';
      fab.rel = 'noopener noreferrer';
      fab.setAttribute('aria-label', 'Chat with WebCloud on WhatsApp');
      fab.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:52px;height:52px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,0.4);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);cursor:pointer;';
      fab.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#ffffff" viewBox="0 0 256 256"><path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,218.35a8,8,0,0,0,9.82,9.82l41.47-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6-1.08l-30.92,8.46,8.46-30.92a8,8,0,0,0-1.08-6A88,88,0,1,1,128,216Zm47.46-62.89-21.7-9.3a16,16,0,0,0-17.72,3.61l-6.49,6.49a56.44,56.44,0,0,1-29.16-29.16l6.49-6.49a16,16,0,0,0,3.61-17.72l-9.3-21.7a16,16,0,0,0-19.34-9.15l-16,4.8A16,16,0,0,0,56,90.4a96.11,96.11,0,0,0,96,96,16,16,0,0,0,12.72-9.66l4.8-16A16,16,0,0,0,175.46,153.11Z"/></svg>';
      fab.addEventListener('mouseenter', function() { fab.style.transform = 'scale(1.1) rotate(5deg)'; });
      fab.addEventListener('mouseleave', function() { fab.style.transform = 'scale(1) rotate(0deg)'; });
      document.body.appendChild(fab);
    }
  }

  // 4. Capture-Phase Event Router
  document.addEventListener('click', function(e) {
    // A. Portfolio Cards -> Open Real Portfolio in New Tab
    var card = e.target.closest('[data-card="true"]');
    if (card) {
      e.preventDefault();
      e.stopPropagation();
      var allCards = Array.from(document.querySelectorAll('[data-card="true"]'));
      var idx = allCards.indexOf(card);
      var targetUrl = (idx >= 0 && idx < PORTFOLIO_DATA.length) ? PORTFOLIO_DATA[idx].url : PORTFOLIO_DATA[0].url;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // B. Journal Card Clicks -> Open Actual Permanent Journal Page
    var journalLink = e.target.closest('section[aria-labelledby="journal-titel"] a');
    if (journalLink) {
      var href = journalLink.getAttribute('href') || '';
      var cardLi = journalLink.closest('li');
      var allJournal = Array.from(document.querySelectorAll('section[aria-labelledby="journal-titel"] ul > li'));
      var jIdx = allJournal.indexOf(cardLi);

      if (jIdx >= 0 && jIdx < JOURNAL_DATA.length) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = JOURNAL_DATA[jIdx].url;
        return;
      } else if (href.includes('journal')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/en/journal';
        return;
      }
    }
  }, true);

  // 5. Start Project Form -> WhatsApp Lead Capture
  document.addEventListener('submit', function(e) {
    var form = e.target.closest('.brief-build, form');
    if (form) {
      e.preventDefault();
      e.stopPropagation();

      var name = (form.querySelector('#f-name, input[name="name"]')?.value || '').trim();
      var email = (form.querySelector('#f-email, input[name="email"]')?.value || '').trim();
      var company = (form.querySelector('#f-company, input[name="company"]')?.value || '').trim();
      var phone = (form.querySelector('#f-phone, input[name="phone"]')?.value || '').trim();
      var msg = (form.querySelector('#f-message, textarea[name="message"]')?.value || '').trim();

      var services = [];
      form.querySelectorAll('input[name="projectType"]:checked').forEach(function(cb) {
        services.push(cb.value);
      });

      var budget = form.querySelector('input[name="budget"]:checked')?.value || 'Not specified';
      var timeline = form.querySelector('input[name="timeline"]:checked')?.value || 'Not specified';

      var lines = [
        '🚀 *New Project Brief from WebCloud Website*',
        '',
        '👤 *Client:* ' + (name || 'Anonymous'),
        '📧 *Email:* ' + (email || 'Not provided'),
        '🏢 *Company:* ' + (company || 'Not provided'),
        '📞 *Phone:* ' + (phone || 'Not provided'),
        '🛠 *Services:* ' + (services.length > 0 ? services.join(', ') : 'All Services'),
        '💰 *Budget:* ' + budget,
        '⏱ *Timeline:* ' + timeline,
        '',
        '📝 *Project Details:*',
        msg || '(No additional message provided)'
      ];

      var waMsg = encodeURIComponent(lines.join('\n'));
      window.open(WA_URL + '?text=' + waMsg, '_blank');
    }
  }, true);

  // 6. Continuous / Post-hydration decorator
  function runLoop() {
    applyDecorations();
  }

  if (document.readyState === 'complete') {
    runLoop();
  } else {
    window.addEventListener('load', runLoop);
  }

  setTimeout(runLoop, 300);
  setTimeout(runLoop, 800);
  setTimeout(runLoop, 1600);
  setTimeout(runLoop, 3000);
})();
