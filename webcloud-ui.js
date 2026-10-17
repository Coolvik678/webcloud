/**
 * WebCloud Studio - Standalone Client Interaction Engine
 * Menu, Synthesizer Audio, X-Ray mode, Accordions, and Start Project Interactive Draft
 */
(function() {
  'use strict';

  function initWebCloudUI() {
    // 1. Menu Controller
    const menuBtn = document.querySelector('button[aria-controls="hauptmenu"]');
    const menuModal = document.getElementById('hauptmenu');

    if (menuBtn && menuModal) {
      let isOpen = false;
      const menuLinks = menuModal.querySelectorAll('a[href]');
      const spans = menuBtn.querySelectorAll('span > span > span');

      function setMenuState(open) {
        isOpen = open;
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuModal.setAttribute('aria-hidden', String(!isOpen));

        if (isOpen) {
          menuModal.classList.remove('invisible', 'pointer-events-none');
          menuModal.style.transition = 'clip-path 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
          menuModal.style.clipPath = 'circle(160% at calc(100% - 2.5rem) 2.5rem)';
          
          const animatedLinks = menuModal.querySelectorAll('.translate-y-\\[110\\%\\]');
          animatedLinks.forEach((el, idx) => {
            el.style.transition = `transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 35}ms`;
            el.style.transform = 'translateY(0%)';
          });

          if (spans.length >= 2) {
            spans[0].style.transform = 'translateY(0) rotate(45deg)';
            spans[1].style.transform = 'translateY(0) rotate(-45deg)';
          }
        } else {
          menuModal.style.transition = 'clip-path 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
          menuModal.style.clipPath = 'circle(0px at calc(100% - 2.5rem) 2.5rem)';
          
          const animatedLinks = menuModal.querySelectorAll('.translate-y-\\[110\\%\\]');
          animatedLinks.forEach(el => {
            el.style.transform = 'translateY(110%)';
          });

          if (spans.length >= 2) {
            spans[0].style.transform = 'translateY(-2.5px) rotate(0deg)';
            spans[1].style.transform = 'translateY(2.5px) rotate(0deg)';
          }

          setTimeout(() => {
            if (!isOpen) {
              menuModal.classList.add('invisible', 'pointer-events-none');
            }
          }, 450);
        }
      }

      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setMenuState(!isOpen);
      });

      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
          setMenuState(false);
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
          setMenuState(false);
        }
      });
    }

    // 2. Sound Toggle & Synthesizer
    const soundBtn = document.querySelector('button[aria-label*="sound" i], button[title*="Sound" i]');
    if (soundBtn) {
      let soundOn = true;
      let audioCtx = null;

      function playTone(freq, duration) {
        if (!soundOn) return;
        try {
          if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
      }

      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        soundOn = !soundOn;
        soundBtn.setAttribute('aria-pressed', String(soundOn));
        soundBtn.setAttribute('title', soundOn ? 'Sound is on' : 'Sound is off');
        const soundBars = soundBtn.querySelector('.sound-bars');
        if (soundBars) {
          soundBars.classList.toggle('is-on', soundOn);
        }
        if (soundOn) {
          playTone(520, 0.12);
        }
      });

      document.querySelectorAll('a, button').forEach(el => {
        if (el === soundBtn) return;
        el.addEventListener('mouseenter', () => {
          if (soundOn && Math.random() > 0.45) playTone(820, 0.04);
        });
      });
    }

    // 3. X-Ray Blueprint Mode
    const xrayBtn = document.querySelector('button[title*="X-ray" i]');
    if (xrayBtn) {
      let xrayActive = false;
      xrayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        xrayActive = !xrayActive;
        xrayBtn.setAttribute('aria-pressed', String(xrayActive));
        document.documentElement.classList.toggle('is-xray', xrayActive);
      });
    }

    // 4. Global Studio World Clock & Scroll Readout
    const progressSpan = document.querySelector('.nav-readout .nav-progress span');
    const measureSpan = document.querySelector('.nav-readout .measure');
    let isUserScrolling = false;
    let scrollIdleTimer = null;

    function formatStudioWorldClock() {
      const now = new Date();
      function getCity(tz, name) {
        try {
          const s = now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
          return name + ' ' + s;
        } catch(e) {
          return name;
        }
      }
      return [
        getCity('America/New_York', 'NYC'),
        getCity('Europe/London', 'LON'),
        getCity('Asia/Dubai', 'DXB'),
        getCity('Asia/Kolkata', 'BLR'),
        getCity('Asia/Tokyo', 'TYO')
      ].join(' · ');
    }

    if (measureSpan) {
      measureSpan.textContent = formatStudioWorldClock();
      setInterval(() => {
        if (!isUserScrolling && measureSpan) {
          measureSpan.textContent = formatStudioWorldClock();
        }
      }, 1000);
    }

    if (progressSpan) {
      function onScroll() {
        isUserScrolling = true;
        clearTimeout(scrollIdleTimer);
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        progressSpan.style.width = pct.toFixed(1) + '%';
        if (measureSpan) {
          measureSpan.textContent = Math.round(scrollTop) + ' px · ' + Math.round(pct) + '%';
        }
        scrollIdleTimer = setTimeout(() => {
          isUserScrolling = false;
          if (measureSpan) {
            measureSpan.textContent = formatStudioWorldClock();
          }
        }, 1600);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // 4b. International Currency Engine & Real-Time Switcher
    const CURRENCIES = {
      USD: { symbol: '$', flag: '🇺🇸', code: 'USD', name: 'US Dollar',
             b1: 'up to $2,500', b2: '$2,500 to $9,000', b3: '$9,000 to $25,000', b4: 'over $25,000',
             p1000: '$1,200', p4900: '$5,500', p500: '$600', p50: '$60' },
      EUR: { symbol: '€', flag: '🇪🇺', code: 'EUR', name: 'Euro',
             b1: 'up to €2,000', b2: '€2,000 to €8,000', b3: '€8,000 to €20,000', b4: 'over €20,000',
             p1000: '1.000 €', p4900: '4.900 €', p500: '500 €', p50: '50 €' },
      GBP: { symbol: '£', flag: '🇬🇧', code: 'GBP', name: 'British Pound',
             b1: 'up to £1,800', b2: '£1,800 to £7,000', b3: '£7,000 to £18,000', b4: 'over £18,000',
             p1000: '£890', p4900: '£4,300', p500: '£450', p50: '£45' },
      INR: { symbol: '₹', flag: '🇮🇳', code: 'INR', name: 'Indian Rupee',
             b1: 'up to ₹2,00,000', b2: '₹2,00,000 to ₹7,50,000', b3: '₹7,50,000 to ₹20,00,000', b4: 'over ₹20,00,000',
             p1000: '₹99,000', p4900: '₹4,75,000', p500: '₹49,000', p50: '₹4,900' },
      AED: { symbol: 'AED', flag: '🇦🇪', code: 'AED', name: 'UAE Dirham',
             b1: 'up to AED 9,000', b2: 'AED 9,000 to AED 35,000', b3: 'AED 35,000 to AED 95,000', b4: 'over AED 95,000',
             p1000: 'AED 4,500', p4900: 'AED 20,000', p500: 'AED 2,250', p50: 'AED 220' },
      SGD: { symbol: 'S$', flag: '🇸🇬', code: 'SGD', name: 'Singapore Dollar',
             b1: 'up to S$3,300', b2: 'S$3,300 to S$12,000', b3: 'S$12,000 to S$33,000', b4: 'over S$33,000',
             p1000: 'S$1,600', p4900: 'S$7,400', p500: 'S$800', p50: 'S$80' },
      CHF: { symbol: 'CHF', flag: '🇨🇭', code: 'CHF', name: 'Swiss Franc',
             b1: 'up to CHF 2,000', b2: 'CHF 2,000 to CHF 8,000', b3: 'CHF 8,000 to CHF 20,000', b4: 'over CHF 20,000',
             p1000: 'CHF 980', p4900: 'CHF 4,750', p500: 'CHF 490', p50: 'CHF 50' },
      CAD: { symbol: 'CA$', flag: '🇨🇦', code: 'CAD', name: 'Canadian Dollar',
             b1: 'up to CA$3,500', b2: 'CA$3,500 to CA$12,500', b3: 'CA$12,500 to CA$33,000', b4: 'over CA$33,000',
             p1000: 'CA$1,650', p4900: 'CA$7,500', p500: 'CA$820', p50: 'CA$80' },
      AUD: { symbol: 'AU$', flag: '🇦🇺', code: 'AUD', name: 'Australian Dollar',
             b1: 'up to AU$3,800', b2: 'AU$3,800 to AU$14,000', b3: 'AU$14,000 to AU$36,000', b4: 'over AU$36,000',
             p1000: 'AU$1,850', p4900: 'AU$8,400', p500: 'AU$920', p50: 'AU$90' },
      JPY: { symbol: '¥', flag: '🇯🇵', code: 'JPY', name: 'Japanese Yen',
             b1: 'up to ¥350,000', b2: '¥350,000 to ¥1,400,000', b3: '¥1,400,000 to ¥3,500,000', b4: 'over ¥3,500,000',
             p1000: '¥180,000', p4900: '¥850,000', p500: '¥90,000', p50: '¥9,000' }
    };

    function detectInitialCurrency() {
      try {
        const stored = localStorage.getItem('webcloud_currency');
        if (stored && CURRENCIES[stored]) return stored;
        const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
        if (tz.includes('calcutta') || tz.includes('kolkata') || tz.includes('india')) return 'INR';
        if (tz.includes('dubai') || tz.includes('uae')) return 'AED';
        if (tz.includes('london') || tz.includes('britain')) return 'GBP';
        if (tz.includes('singapore')) return 'SGD';
        if (tz.includes('zurich')) return 'CHF';
        if (tz.includes('tokyo')) return 'JPY';
        if (tz.includes('sydney') || tz.includes('melbourne')) return 'AUD';
        if (tz.includes('toronto') || tz.includes('vancouver')) return 'CAD';
        if (tz.includes('berlin') || tz.includes('vienna') || tz.includes('paris') || tz.includes('europe')) return 'EUR';
        return 'USD';
      } catch(e) {
        return 'USD';
      }
    }

    let activeCurrency = detectInitialCurrency();

    // Inject Currency Dropdown styles
    if (!document.getElementById('wc-currency-style')) {
      const st = document.createElement('style');
      st.id = 'wc-currency-style';
      st.textContent = `
        #wc-currency-wrap { position: relative; display: inline-flex; align-items: center; }
        #wc-currency-btn {
          display: inline-flex; align-items: center; gap: 0.35rem; padding: 0 0.75rem; height: 2.75rem;
          border-radius: 9999px; font-size: 0.75rem; letter-spacing: 0.02em; cursor: pointer;
          background: transparent; border: none; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #wc-currency-btn:hover { background: rgba(125, 125, 125, 0.12); }
        .wc-curr-dropdown {
          position: absolute; top: calc(100% + 0.5rem); right: 0; min-width: 220px; max-height: 400px;
          overflow-y: auto; border-radius: 14px; padding: 0.4rem;
          background: rgba(22, 22, 24, 0.96); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 20px 48px rgba(0,0,0,0.45);
          opacity: 0; transform: translateY(8px) scale(0.96); pointer-events: none;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1000;
        }
        .wc-curr-dropdown.is-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .wc-curr-option {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          padding: 0.55rem 0.75rem; border-radius: 8px; font-size: 0.8125rem;
          color: #f2efe9; background: transparent; border: none; cursor: pointer;
          transition: background 0.15s ease; text-align: left;
        }
        .wc-curr-option:hover { background: rgba(255, 255, 255, 0.08); }
        .wc-curr-option.is-active { background: rgba(255, 62, 62, 0.18); color: #ff4d4d; font-weight: 600; }
        html:not(.dark) .wc-curr-dropdown {
          background: rgba(255, 255, 255, 0.98); border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 20px 48px rgba(0,0,0,0.14);
        }
        html:not(.dark) .wc-curr-option { color: #0f0f11; }
        html:not(.dark) .wc-curr-option:hover { background: rgba(0, 0, 0, 0.06); }
        html:not(.dark) .wc-curr-option.is-active { background: rgba(255, 62, 62, 0.12); color: #d92424; }
      `;
      document.head.appendChild(st);
    }

    function applyCurrency(code) {
      if (!CURRENCIES[code]) return;
      activeCurrency = code;
      try { localStorage.setItem('webcloud_currency', code); } catch(e) {}
      window.__webcloud_currency = code;

      const c = CURRENCIES[code];

      // 1. Update button text in header
      const btn = document.getElementById('wc-currency-btn');
      if (btn) {
        btn.innerHTML = `<span class="curr-flag">${c.flag}</span> <span class="font-mono font-medium">${c.code}</span> <span class="text-accent font-semibold">${c.symbol}</span> <svg class="w-2.5 h-2.5 opacity-60 ml-0.5" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>`;
      }

      // 2. Update active states in dropdown
      document.querySelectorAll('.wc-curr-option').forEach(opt => {
        opt.classList.toggle('is-active', opt.dataset.currency === code);
      });

      // 3. Update all services price tags on page
      document.querySelectorAll('dd.display-4, .display-4').forEach(dd => {
        const txt = (dd.textContent || '').trim();
        if (txt.includes('1,000') || txt.includes('1.000') || dd.dataset.basePrice === '1000') {
          dd.dataset.basePrice = '1000';
          dd.innerHTML = (txt.startsWith('ab') ? 'ab ' : 'from ') + c.p1000;
        } else if (txt.includes('4,900') || txt.includes('4.900') || dd.dataset.basePrice === '4900') {
          dd.dataset.basePrice = '4900';
          dd.innerHTML = (txt.startsWith('ab') ? 'ab ' : 'from ') + c.p4900;
        } else if (txt.includes('500') || dd.dataset.basePrice === '500') {
          dd.dataset.basePrice = '500';
          dd.innerHTML = (txt.startsWith('ab') ? 'ab ' : 'from ') + c.p500;
        } else if (txt.includes('50') && !txt.includes('500') && !txt.includes('4,900') || dd.dataset.basePrice === '50') {
          dd.dataset.basePrice = '50';
          dd.innerHTML = (txt.startsWith('ab') ? 'ab ' : 'from ') + c.p50;
        }
      });

      // 4. Update Start Project Form Budget Chips
      const bForm = document.querySelector('.brief-build');
      if (bForm) {
        bForm.querySelectorAll('input[name="budget"]').forEach(input => {
          const val = input.value;
          if (c[val]) {
            const label = input.closest('label');
            if (label) {
              label.innerHTML = '';
              label.appendChild(input);
              label.appendChild(document.createTextNode(c[val]));
            }
          }
        });
        if (typeof window.__webcloud_updateDraft === 'function') {
          window.__webcloud_updateDraft();
        }
      }

      // 5. Update footer currency radio/buttons if present
      document.querySelectorAll('input[name="wc-currency"]').forEach(r => {
        if (r.value === code) r.checked = true;
      });
    }

    // Inject Currency selector into header
    function setupHeaderCurrencyPill() {
      const navPills = document.querySelectorAll('header .nav-pill');
      if (navPills.length < 2) return;
      const rightPill = navPills[1];
      if (document.getElementById('wc-currency-wrap')) return;

      const wrap = document.createElement('div');
      wrap.id = 'wc-currency-wrap';
      wrap.className = 'inline-block will-change-transform';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'wc-currency-btn';
      btn.className = 'nav-item gap-1 text-ink';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('title', 'Switch display currency');

      const dropdown = document.createElement('div');
      dropdown.id = 'wc-currency-dropdown';
      dropdown.className = 'wc-curr-dropdown';
      dropdown.setAttribute('role', 'menu');

      Object.keys(CURRENCIES).forEach(code => {
        const item = CURRENCIES[code];
        const opt = document.createElement('button');
        opt.type = 'button';
        opt.className = 'wc-curr-option' + (code === activeCurrency ? ' is-active' : '');
        opt.dataset.currency = code;
        opt.innerHTML = `<span><span class="mr-2">${item.flag}</span>${item.code} <span class="opacity-60 text-xs">(${item.symbol})</span></span><span class="text-xs opacity-50">${item.name}</span>`;
        opt.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          applyCurrency(code);
          dropdown.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        });
        dropdown.appendChild(opt);
      });

      let isOpen = false;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!wrap.contains(e.target) && isOpen) {
          isOpen = false;
          dropdown.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      wrap.appendChild(btn);
      wrap.appendChild(dropdown);

      const startBtn = rightPill.querySelector('a[href*="start-project"]');
      if (startBtn && startBtn.parentElement) {
        rightPill.insertBefore(wrap, startBtn.parentElement);
      } else {
        rightPill.insertBefore(wrap, rightPill.lastElementChild);
      }

      applyCurrency(activeCurrency);
    }
    setupHeaderCurrencyPill();

    // 5. Theme Selector
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      try { localStorage.setItem('theme', theme); } catch(e) {}
    }

    if (themeRadios.length > 0) {
      const saved = localStorage.getItem('theme') || 'dark';
      themeRadios.forEach(radio => {
        if (radio.value === saved) radio.checked = true;
        radio.addEventListener('change', () => {
          if (radio.checked) applyTheme(radio.value);
        });
      });
    }


    // 6. Interactive Accordion Expanders
    document.querySelectorAll('button[class*="items-center justify-between"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('div, li, section');
        const content = parent ? parent.querySelector('[class*="accordion-content"], [class*="overflow-hidden"]') : null;
        const isExp = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExp));
        if (content && content !== parent) {
          content.style.maxHeight = isExp ? '0px' : '600px';
        }
      });
    });

    // 7. Interactive Start Project Live Draft Engine
    const form = document.querySelector('.brief-build');
    if (form) {
      // Force is-go state
      form.classList.add('is-go');

      // Ensure reveal elements are visible
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('is-in');
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = 'none';
      });

      const messageArea = form.querySelector('#f-message');
      const companyInput = form.querySelector('#f-company');
      const siteInput = form.querySelector('#f-existingSite');
      const wordsSpan = form.querySelector('.measure .text-ink.tabular-nums');
      const browserUrl = form.querySelector('.frame-url');
      const countValues = form.querySelectorAll('.build-count-value');
      const budgetScales = form.querySelectorAll('dl > div:nth-child(1) .bd-runner');
      const timingScales = form.querySelectorAll('dl > div:nth-child(2) .bd-runner');
      const budgetLabels = form.querySelectorAll('dl > div:nth-child(1) dt span.text-ink');
      const timingLabels = form.querySelectorAll('dl > div:nth-child(2) dt span.text-ink');

      function getActiveBudgetMap() {
        const c = CURRENCIES[activeCurrency] || CURRENCIES.USD;
        return {
          'b1': { pct: 20, text: c.b1 },
          'b2': { pct: 40, text: c.b2 },
          'b3': { pct: 60, text: c.b3 },
          'b4': { pct: 85, text: c.b4 },
          'open': { pct: 100, text: 'Open' }
        };
      }

      const timelineMap = {
        'asap': { pct: 100, text: 'As soon as possible' },
        'quarter': { pct: 70, text: 'In the next three months' },
        'year': { pct: 40, text: 'This year' },
        'flex': { pct: 15, text: 'Flexible' }
      };

      function updateDraft() {
        let score = 0;
        const total = 5;

        // Name & Email
        const nameVal = (form.querySelector('#f-name')?.value || '').trim();
        const emailVal = (form.querySelector('#f-email')?.value || '').trim();
        if (nameVal) score += 0.5;
        if (emailVal) score += 0.5;

        // Company / URL
        const compVal = (companyInput?.value || '').trim();
        const siteVal = (siteInput?.value || '').trim();
        if (browserUrl) {
          if (compVal) {
            browserUrl.innerHTML = '<span class="frame-url-dot"></span>' + compVal.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
          } else if (siteVal) {
            browserUrl.innerHTML = '<span class="frame-url-dot"></span>' + siteVal.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          } else {
            browserUrl.innerHTML = '<span class="frame-url-dot"></span>your-company.com';
          }
        }
        if (compVal || siteVal) score += 0.5;

        // Words
        const msgText = (messageArea?.value || '').trim();
        const words = msgText ? msgText.split(/\s+/).filter(Boolean).length : 0;
        if (wordsSpan) wordsSpan.textContent = words;
        if (words >= 10) score += 1;
        else if (words > 0) score += 0.5;

        // Services
        const checkedChips = form.querySelectorAll('input[name="projectType"]:checked');
        if (checkedChips.length > 0) score += 1;

        // Budget & Timing
        const checkedBudget = form.querySelector('input[name="budget"]:checked');
        const bMap = getActiveBudgetMap();
        if (checkedBudget && bMap[checkedBudget.value]) {
          const bInfo = bMap[checkedBudget.value];
          budgetScales.forEach(s => { s.style.left = bInfo.pct + '%'; s.style.opacity = '1'; });
          budgetLabels.forEach(l => { l.textContent = bInfo.text; });
          score += 0.75;
        }

        const checkedTimeline = form.querySelector('input[name="timeline"]:checked');
        if (checkedTimeline && timelineMap[checkedTimeline.value]) {
          const tInfo = timelineMap[checkedTimeline.value];
          timingScales.forEach(s => { s.style.left = tInfo.pct + '%'; s.style.opacity = '1'; });
          timingLabels.forEach(l => { l.textContent = tInfo.text; });
          score += 0.75;
        }
      }
      window.__webcloud_updateDraft = updateDraft;

        const pct = Math.min(100, Math.round((score / total) * 100));
        countValues.forEach(el => {
          const pad = String(pct).padStart(3, '0');
          el.innerHTML = pad + '<span class="build-count-unit">%</span>';
        });

        // Trigger SVG dash animation
        form.querySelectorAll('.bd-draw').forEach(path => {
          path.style.strokeDashoffset = (1 - (pct / 100)) + 'px';
        });
      }

      form.addEventListener('input', updateDraft);
      form.addEventListener('change', updateDraft);
      updateDraft();
    }

    // 8. Dismiss Preloader
    const preloader = document.getElementById('preloader') || document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
    }

    // 8b. Journal Prose & Media Visibility Guard (Only on journal pages)
    if (window.location.pathname.includes('/journal/')) {
      document.querySelectorAll('.prose').forEach(function(el) {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
      document.querySelectorAll('.measure-frame, [data-reveal="clip"] > *').forEach(function(el) {
        el.style.clipPath = 'none';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
      document.querySelectorAll('.parallax-img, main img').forEach(function(el) {
        el.style.clipPath = 'none';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
      });
    }

    // 9. Kinetic Typography Wobbly Engine
    function initKineticWobble() {
      const headings = document.querySelectorAll('.display-1, .display-2, .display-3, .kinetic, .kinetic-wobble-target');
      headings.forEach(heading => {
        if (!heading.dataset.wobbleInit) {
          heading.dataset.wobbleInit = 'true';
          const chars = heading.querySelectorAll('.kinetic-char');
          if (chars.length === 0) return;

          heading.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            chars.forEach((ch, idx) => {
              const chRect = ch.getBoundingClientRect();
              const chX = chRect.left + chRect.width / 2;
              const chY = chRect.top + chRect.height / 2;
              const dist = Math.hypot(mouseX - chX, mouseY - chY);

              if (dist < 130) {
                const factor = 1 - (dist / 130);
                const yOffset = Math.sin((Date.now() / 120) + idx * 0.4) * 4 * factor;
                const rot = Math.cos((Date.now() / 120) + idx * 0.4) * 3.5 * factor;
                const weight = Math.round(500 + factor * 350);
                ch.style.display = 'inline-block';
                ch.style.transform = `translateY(${yOffset.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
                ch.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${100 + Math.round(factor * 25)}`;
                ch.style.color = factor > 0.65 ? 'var(--accent, #e5ff00)' : '';
              } else {
                ch.style.transform = '';
                ch.style.fontVariationSettings = '';
                ch.style.color = '';
              }
            });
          });

          heading.addEventListener('mouseleave', () => {
            chars.forEach(ch => {
              ch.style.transform = '';
              ch.style.fontVariationSettings = '';
              ch.style.color = '';
            });
          });
        }
      });
    }
    initKineticWobble();
    setTimeout(initKineticWobble, 1000);
    setTimeout(initKineticWobble, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebCloudUI);
  } else {
    initWebCloudUI();
  }
})();
