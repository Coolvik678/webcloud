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
 * 6. Floating Gmail Contact Button (myovik@gmail.com)
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
      id: 'webcloud-3d-flagship',
      title: 'WebCloud 3D Flagship Experience',
      tag: '3D WebGL · Flagship 2026',
      lead: 'Interactive 3D digital flagship and immersive hardware tour engineered with Three.js and spatial audio.',
      secret: 'Next-Gen Flagship.',
      img: '/api/media/file/webcloud-3d-flagship.webp',
      url: 'https://webcloud-3d-flagship.vercel.app/'
    },
    {
      id: 'truus-agency',
      title: 'Truus Advertising Studio',
      tag: 'Creative Agency · Amsterdam',
      lead: 'Advertising for the new mainstream: cultural creative strategy, viral campaigns, and 360° digital activations.',
      secret: 'New Mainstream.',
      img: '/api/media/file/truus.webp',
      url: 'https://truus.co/?ref=killerportfolio'
    },
    {
      id: 'andreas-vision',
      title: 'Andreas Vision Studio',
      tag: 'Design Engineering · Europe',
      lead: 'Precision, joyful interfaces and design systems engineered from first sketch to production for high-growth tech companies.',
      secret: 'Vision & Systems.',
      img: '/api/media/file/andreas-vision.webp',
      url: 'https://andreas.vision/'
    },
    {
      id: 'sobha-privy',
      title: 'Sobha Privy Collection',
      tag: 'Ultra-Luxury Real Estate · Dubai',
      lead: 'Ultra-luxury waterfront residences and architectural marvel in Dubai.',
      secret: 'Dubai Luxury.',
      img: '/api/media/file/sobha-privy.webp',
      url: 'https://sobha-privy-collection.com/'
    },
    {
      id: 'thenest-sanctuary',
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
    window.sessionStorage.setItem('webcloud-intro', '1');
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

    // B. Scalable Portfolio Cards (Dynamic Spawning + Sticky Stacking + Hover Lens + Direct Routing)
    var cardsContainer = document.querySelector('div.grid.gap-6:has([data-card="true"])') || document.querySelector('div.grid.gap-6');
    if (!cardsContainer) {
      var firstCard = document.querySelector('[data-card="true"]');
      if (firstCard) cardsContainer = firstCard.parentElement;
    }

    if (cardsContainer) {
      var initialCards = Array.from(cardsContainer.querySelectorAll('[data-card="true"]'));

      // Dynamically clone and append cards if fewer than PORTFOLIO_DATA.length
      if (initialCards.length > 0 && initialCards.length < PORTFOLIO_DATA.length) {
        var cardTemplate = initialCards[initialCards.length - 1];
        for (var i = initialCards.length; i < PORTFOLIO_DATA.length; i++) {
          var clonedCard = cardTemplate.cloneNode(true);
          delete clonedCard.dataset.wcTitleDone;
          delete clonedCard.dataset.lensBound;
          var clonedLens = clonedCard.querySelector('.hover-lens');
          if (clonedLens) delete clonedLens.dataset.lensBound;
          cardsContainer.appendChild(clonedCard);
        }
      }

      var allCards = Array.from(cardsContainer.querySelectorAll('[data-card="true"]'));
      allCards.forEach(function(card, idx) {
        if (idx < PORTFOLIO_DATA.length) {
          var data = PORTFOLIO_DATA[idx];

          // Set exact sticky stacking offset (1.25rem / 20px per card)
          card.style.top = 'calc(var(--nav-h) + ' + (idx * 1.25) + 'rem)';
          card.setAttribute('data-target-url', data.url);

          // 1. Swap Images (main + hover lens glass inner) & strip srcset
          var imgs = card.querySelectorAll('img');
          imgs.forEach(function(img) {
            img.removeAttribute('srcset');
            img.src = data.img;
            img.alt = data.title;
          });

          // 2. Headline with direct arrow
          var h3 = card.querySelector('h3');
          if (h3) {
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

          // 6. Anchor href target update
          var a = card.querySelector('a');
          if (a) {
            a.href = data.url;
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
          }

          // 7. Interactive Hover Lens Engine
          var lensContainer = card.querySelector('.hover-lens');
          if (lensContainer && !lensContainer.dataset.lensBound) {
            lensContainer.dataset.lensBound = 'true';
            var glass = lensContainer.querySelector('.hover-lens-glass');
            var inner = lensContainer.querySelector('.hover-lens-inner');
            var r = 84;
            var zoom = 2.2;
            lensContainer.addEventListener('pointermove', function(e) {
              if (e.pointerType !== 'mouse') return;
              var rect = lensContainer.getBoundingClientRect();
              var d = e.clientX - rect.left;
              var u = e.clientY - rect.top;
              if (glass) glass.style.transform = 'translate3d(' + (d - r) + 'px, ' + (u - r) + 'px, 0)';
              if (inner) {
                inner.style.width = rect.width + 'px';
                inner.style.height = rect.height + 'px';
                inner.style.transform = 'translate3d(' + (r - d * zoom) + 'px, ' + (r - u * zoom) + 'px, 0) scale(' + zoom + ')';
              }
              lensContainer.classList.add('is-lensing');
            });
            lensContainer.addEventListener('pointerleave', function() {
              lensContainer.classList.remove('is-lensing');
            });
          }
        }
      });

      // Update project counts anywhere on the page
      document.querySelectorAll('.measure').forEach(function(el) {
        if (/^\d+\s+projects?$/i.test(el.textContent.trim())) {
          el.textContent = PORTFOLIO_DATA.length + ' projects';
        }
      });
    }

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
      if (a.id === 'webcloud-floating-gmail' || a.closest('#webcloud-floating-gmail')) return;
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
        p.textContent = 'Web and digital architecture studio. Bespoke high-performance digital experiences and 3D web applications. Global Hubs: New York · London · Zurich · Dubai · Bangalore · Singapore · Tokyo.';
      } else if (t.indexOf('meticulous:') !== -1) {
        p.textContent = 'WebCloud Corporation: engineered with precision across international time zones.';
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

    // Resolve any Next.js image optimizer paths directly to static assets and prevent broken image falls
    function sanitizeImageElement(img) {
      if (!img) return;
      var src = img.getAttribute('src') || img.src || '';
      var srcset = img.getAttribute('srcset') || img.srcset || '';

      if (src.indexOf('/_next/image') !== -1 || srcset.indexOf('/_next/image') !== -1) {
        var match = (src + ' ' + srcset).match(/url=([^&"'\s]+)/);
        if (match) {
          var realPath = decodeURIComponent(match[1]);
          if (realPath.charAt(0) !== '/') realPath = '/' + realPath;
          img.removeAttribute('srcset');
          img.src = realPath;
        }
      }

      if (src.indexOf('kontakt-lupe') !== -1 || (img.alt && img.alt.toLowerCase().indexOf('magnifier') !== -1)) {
        img.removeAttribute('srcset');
        img.src = '/api/media/file/kontakt-lupe.jpeg';
      }

      if (src.indexOf('story-paper') !== -1) {
        img.removeAttribute('srcset');
        img.src = '/api/media/file/story-paper-1920x1079.jpg';
      }
    }

    document.querySelectorAll('img').forEach(sanitizeImageElement);

    // Dynamic brand text node scrub
    function scrubBrandText(el) {
      if (!el) return;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      var n;
      while (n = walker.nextNode()) {
        var v = n.nodeValue;
        if (!v) continue;
        if (/\b(metic|matic|meticulous)\b/i.test(v)) {
          if (/arithmetic|automatic|dramatic|programmatic|mathematical/i.test(v)) continue;
          n.nodeValue = v
            .replace(/\bMetic\b/g, 'WebCloud')
            .replace(/\bmetic\b/g, 'webcloud')
            .replace(/\bMatic\b/g, 'WebCloud')
            .replace(/\bmatic\b/g, 'webcloud')
            .replace(/closer \u2192 meticulous \u2192 metic\.?/g, 'digital \u2192 engineering \u2192 webcloud.')
            .replace(/genau \u2192 meticulous \u2192 metic\.?/g, 'pr\u00e4zise \u2192 architektur \u2192 webcloud.')
            .replace(/\bmeticulous\b/gi, 'precision engineered');
        }
      }
    }
    scrubBrandText(document.body);


    // Footer copyright update
    document.querySelectorAll('footer .rule div, footer .rule p, footer').forEach(function(el) {
      if (el.childNodes) {
        el.childNodes.forEach(function(node) {
          if (node.nodeType === 3 && node.nodeValue && node.nodeValue.indexOf('webcloud') !== -1) {
            node.nodeValue = node.nodeValue.replace(/webcloud\.\s*·\s*WebCloud Corporation/g, 'WebCloud Corporation');
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
            a.textContent = 'Gmail';
            a.href = 'mailto:' + GMAIL + '?subject=' + encodeURIComponent('Project Inquiry — WebCloud Corporation');
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
          }
        }
      });
    }

    // Clean up any old floating whatsapp if present
    var oldWa = document.getElementById('webcloud-floating-whatsapp');
    if (oldWa) oldWa.remove();

        // E. Floating Gmail Button (directed to myovik@gmail.com with Official Gmail Logo)
    var GMAIL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30" style="display:block;pointer-events:none;">' +
      '<path fill="#4285F4" d="M45,16.2l-5,2.9V37c0,2.2-1.8,4-4,4H12c-2.2,0-4-1.8-4-4V19.1l-5-2.9C1.8,15.4,1,13.9,1,12.3c0-3.2,3.3-5.3,6.2-4l16.8,9.8l16.8-9.8c2.9-1.3,6.2,0.8,6.2,4C47,13.9,46.2,15.4,45,16.2z"/>' +
      '<path fill="#34A853" d="M36,41h8c2.2,0,4-1.8,4-4V16.2l-12,7V41z"/>' +
      '<path fill="#EA4335" d="M12,41H4c-2.2,0-4-1.8-4-4V16.2l12,7V41z"/>' +
      '<path fill="#FBBC05" d="M24,25.3l16-9.3V12.3c0-3.2-3.3-5.3-6.2-4L24,14l-9.8-5.7c-2.9-1.3-6.2,0.8-6.2,4v3.7L24,25.3z"/>' +
      '</svg>';

    var existingFab = document.getElementById('webcloud-floating-gmail');
    if (!existingFab) {
      var fab = document.createElement('a');
      fab.id = 'webcloud-floating-gmail';
      fab.href = 'mailto:' + GMAIL + '?subject=' + encodeURIComponent('Project Inquiry — WebCloud Corporation');
      fab.setAttribute('aria-label', 'Email WebCloud Corporation');
      fab.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:56px;height:56px;background:#ffffff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.08);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s ease;cursor:pointer;text-decoration:none;overflow:visible;';
      
      fab.innerHTML = GMAIL_SVG;

      // Tooltip pill on hover
      var tip = document.createElement('span');
      tip.textContent = 'Email ' + GMAIL;
      tip.style.cssText = 'position:absolute;right:68px;background:#0a0a0b;color:#f2efe9;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,0.25);opacity:0;pointer-events:none;transform:translateX(8px);transition:all 0.25s cubic-bezier(0.16,1,0.3,1);letter-spacing:-0.01em;border:1px solid rgba(255,255,255,0.1);';
      fab.appendChild(tip);

      fab.addEventListener('mouseenter', function() {
        fab.style.transform = 'scale(1.1) rotate(-4deg)';
        fab.style.boxShadow = '0 14px 36px rgba(0,0,0,0.25), 0 4px 14px rgba(234,67,53,0.3)';
        tip.style.opacity = '1';
        tip.style.transform = 'translateX(0)';
      });
      fab.addEventListener('mouseleave', function() {
        fab.style.transform = 'scale(1) rotate(0deg)';
        fab.style.boxShadow = '0 10px 30px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)';
        tip.style.opacity = '0';
        tip.style.transform = 'translateX(8px)';
      });

      document.body.appendChild(fab);
    } else {
      if (!existingFab.querySelector('svg')) {
        var oldTip = existingFab.querySelector('span');
        existingFab.innerHTML = GMAIL_SVG;
        if (oldTip) existingFab.appendChild(oldTip);
      }
    }
  }

  // 4. Capture-Phase Event Router
  document.addEventListener('click', function(e) {
    // A. Portfolio Cards -> Open Real Portfolio in New Tab
    var card = e.target.closest('[data-card="true"]');
    if (card) {
      e.preventDefault();
      e.stopPropagation();
      var targetUrl = card.getAttribute('data-target-url');
      if (!targetUrl) {
        var allCards = Array.from(document.querySelectorAll('[data-card="true"]'));
        var idx = allCards.indexOf(card);
        targetUrl = (idx >= 0 && idx < PORTFOLIO_DATA.length) ? PORTFOLIO_DATA[idx].url : PORTFOLIO_DATA[0].url;
      }
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

  // 5. Start Project Form -> Direct Email Dispatch (myovik@gmail.com)
  document.addEventListener('submit', function(e) {
    var form = e.target.closest('.brief-build, form');
    if (form) {
      e.preventDefault();
      e.stopPropagation();

      var submitBtn = form.querySelector('button[type="submit"]');
      var name = (form.querySelector('#f-name, input[name="name"]')?.value || '').trim();
      var email = (form.querySelector('#f-email, input[name="email"]')?.value || '').trim();
      var company = (form.querySelector('#f-company, input[name="company"]')?.value || '').trim();
      var phone = (form.querySelector('#f-phone, input[name="phone"]')?.value || '').trim();
      var msg = (form.querySelector('#f-message, textarea[name="message"]')?.value || '').trim();

      var services = [];
      form.querySelectorAll('input[name="projectType"]:checked').forEach(function(cb) {
        services.push(cb.value);
      });

      var budgetCode = form.querySelector('input[name="budget"]:checked')?.value || 'Not specified';
      var activeCurr = (localStorage.getItem('webcloud_currency') || 'USD').toUpperCase();
      var budgetLabel = budgetCode;
      var currMap = {
        USD: { b1: 'up to $2,500', b2: '$2,500 to $9,000', b3: '$9,000 to $25,000', b4: 'over $25,000' },
        EUR: { b1: 'up to €2,000', b2: '€2,000 to €8,000', b3: '€8,000 to €20,000', b4: 'over €20,000' },
        GBP: { b1: 'up to £1,800', b2: '£1,800 to £7,000', b3: '£7,000 to £18,000', b4: 'over £18,000' },
        INR: { b1: 'up to ₹2,00,000', b2: '₹2,00,000 to ₹7,50,000', b3: '₹7,50,000 to ₹20,00,000', b4: 'over ₹20,00,000' },
        AED: { b1: 'up to AED 9,000', b2: 'AED 9,000 to AED 35,000', b3: 'AED 35,000 to AED 95,000', b4: 'over AED 95,000' },
        SGD: { b1: 'up to S$3,300', b2: 'S$3,300 to S$12,000', b3: 'S$12,000 to S$33,000', b4: 'over S$33,000' },
        CHF: { b1: 'up to CHF 2,000', b2: 'CHF 2,000 to CHF 8,000', b3: 'CHF 8,000 to CHF 20,000', b4: 'over CHF 20,000' },
        CAD: { b1: 'up to CA$3,500', b2: 'CA$3,500 to CA$12,500', b3: 'CA$12,500 to CA$33,000', b4: 'over CA$33,000' },
        AUD: { b1: 'up to AU$3,800', b2: 'AU$3,800 to AU$14,000', b3: 'AU$14,000 to AU$36,000', b4: 'over AU$36,000' },
        JPY: { b1: 'up to ¥350,000', b2: '¥350,000 to ¥1,400,000', b3: '¥1,400,000 to ¥3,500,000', b4: 'over ¥3,500,000' }
      };
      if (currMap[activeCurr] && currMap[activeCurr][budgetCode]) {
        budgetLabel = currMap[activeCurr][budgetCode] + ' (' + activeCurr + ')';
      } else if (budgetCode === 'open') {
        budgetLabel = 'Open (' + activeCurr + ')';
      }

      var timeline = form.querySelector('input[name="timeline"]:checked')?.value || 'Not specified';

      // Visual feedback on submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.85';
        submitBtn.innerHTML = '<span class="relative">Sending brief to ' + GMAIL + '...</span><span class="btn-dot" style="animation:spin 1s linear infinite">⏳</span>';
      }

      var subjectText = '🚀 New WebCloud Project Brief: ' + (company || name || 'New Client') + ' [' + budgetLabel + ']';
      var emailLines = [
        '🚀 New Project Brief from WebCloud Website',
        '-------------------------------------------',
        'Client: ' + (name || 'Anonymous'),
        'Email: ' + (email || 'Not provided'),
        'Company: ' + (company || 'Not provided'),
        'Phone: ' + (phone || 'Not provided'),
        'Services: ' + (services.length > 0 ? services.join(', ') : 'All Services'),
        'Budget: ' + budgetLabel,
        'Timeline: ' + timeline,
        'Currency: ' + activeCurr,
        '-------------------------------------------',
        'Project Details:',
        msg || '(No additional message provided)'
      ].join('\n');

      var payload = {
        _subject: subjectText,
        _replyto: email || GMAIL,
        _template: 'table',
        _captcha: 'false',
        Client_Name: name || 'Anonymous',
        Client_Email: email || 'Not provided',
        Company: company || 'Not provided',
        Phone: phone || 'Not provided',
        Services: services.length > 0 ? services.join(', ') : 'All Services',
        Budget: budgetLabel,
        Timeline: timeline,
        Currency: activeCurr,
        Project_Details: msg || 'No additional message provided'
      };

      function renderSuccess() {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '1';
          submitBtn.innerHTML = '<span class="relative font-medium" style="color:#22c55e">✓ Brief Sent to ' + GMAIL + '</span><span class="btn-dot" style="background:#22c55e;color:#fff">✓</span>';
        }

        // Show prominent confirmation box
        var conf = form.querySelector('#wc-sent-confirmation');
        if (!conf) {
          conf = document.createElement('div');
          conf.id = 'wc-sent-confirmation';
          conf.style.cssText = 'margin-top:1.25rem;padding:1rem 1.25rem;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);border-radius:12px;color:#22c55e;font-size:0.9rem;line-height:1.5;';
          var btnContainer = submitBtn ? (submitBtn.closest('.mt-8, .mt-6, div') || submitBtn.parentElement) : form;
          btnContainer.appendChild(conf);
        }
        conf.innerHTML = '<div style="font-weight:600;display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;"><svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg> Brief Dispatched to ' + GMAIL + '</div><div>Your brief has been delivered directly to WebCloud. We will review your requirements and respond within 24 hours.</div>';

        // Stamp browser preview
        var stamp = document.querySelector('.bd-stamp');
        if (stamp) {
          stamp.textContent = 'Received.';
          stamp.style.opacity = '1';
        }
      }

      function fallbackEmail() {
        var mailtoUri = 'mailto:' + GMAIL + '?subject=' + encodeURIComponent(subjectText) + '&body=' + encodeURIComponent(emailLines);
        window.location.href = mailtoUri;
        renderSuccess();
      }

      fetch('https://formsubmit.co/ajax/' + GMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        renderSuccess();
      })
      .catch(function(err) {
        fallbackEmail();
      });
    }
  }, true);

  // 6. Global image error protection & dynamic observer
  window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
      var img = e.target;
      var src = (img.src || '').toLowerCase();
      var alt = (img.alt || '').toLowerCase();

      if (src.indexOf('kontakt-lupe') !== -1 || alt.indexOf('magnifier') !== -1) {
        img.removeAttribute('srcset');
        img.src = '/api/media/file/kontakt-lupe.jpeg';
      } else if (src.indexOf('/_next/image') !== -1) {
        var match = (img.src || '').match(/url=([^&]+)/);
        if (match) {
          var real = decodeURIComponent(match[1]);
          if (real.charAt(0) !== '/') real = '/' + real;
          img.removeAttribute('srcset');
          img.src = real;
        }
      } else if (src.indexOf('story-paper') !== -1) {
        img.removeAttribute('srcset');
        img.src = '/api/media/file/story-paper-1920x1079.jpg';
      }
    }
  }, true);

  if (window.MutationObserver && document.body) {
    var obs = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') {
              var s = (node.src || '').toLowerCase();
              if (s.indexOf('kontakt-lupe') !== -1 || (node.alt && node.alt.toLowerCase().indexOf('magnifier') !== -1)) {
                node.removeAttribute('srcset');
                node.src = '/api/media/file/kontakt-lupe.jpeg';
              }
            }
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // 7. Continuous / Post-hydration decorator
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

