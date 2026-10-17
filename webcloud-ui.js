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

    // 4. Scroll Readout Progress
    const progressSpan = document.querySelector('.nav-readout .nav-progress span');
    const measureSpan = document.querySelector('.nav-readout .measure');
    if (progressSpan) {
      function onScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        progressSpan.style.width = pct.toFixed(1) + '%';
        if (measureSpan) {
          measureSpan.textContent = Math.round(scrollTop) + ' px';
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

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

      const budgetMap = {
        'b1': { pct: 20, text: 'up to €2,000' },
        'b2': { pct: 40, text: '€2,000 to €8,000' },
        'b3': { pct: 60, text: '€8,000 to €20,000' },
        'b4': { pct: 85, text: 'over €20,000' },
        'open': { pct: 100, text: 'Open' }
      };

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
        if (checkedBudget && budgetMap[checkedBudget.value]) {
          const bInfo = budgetMap[checkedBudget.value];
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
