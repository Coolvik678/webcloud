const fs = require('fs');

// 1. Update webcloud-engine.js
let engine = fs.readFileSync('c:/Artificial_Intelligence_Local/metic_clone/webcloud-engine.js', 'utf8');

// Replace PROJECTS with WebCloud 3D Flagship Experience as the MAIN one (Item 0)
const OLD_PROJECTS = `  var PROJECTS = [
    {
      title: 'Sobha Privy Collection',
      category: 'Luxury Real Estate · Dubai',
      lead: 'Ultra-luxury real estate showcase engineered for high-net-worth client acquisition with immersive architectural layouts.',
      tags: ['Luxury Real Estate', 'Architecture', 'Dubai Flagship'],
      href: 'https://sobha-privy-collection.com/',
      img: 'https://sobha-privy-collection.com/assets/manifest/og.png'
    },
    {
      title: 'The Nest Sanctuary',
      category: 'Modern Workspace · Warsaw',
      lead: 'Modern architectural co-working and club sanctuary with seamless membership booking and interactive floorplans.',
      tags: ['Brand Identity', 'Modern Architecture', 'Warsaw'],
      href: 'https://thenest.pl/en',
      img: 'https://thenest.pl/images/the-nest-building.webp'
    },
    {
      title: '21Oaks Residences',
      category: 'Student Living & Housing · USC',
      lead: 'Modern student living community with bespoke digital experience, virtual tour routing, and rapid leasing portal.',
      tags: ['Student Living', 'USC Housing', 'Leasing Engine'],
      href: 'https://21oaks.org/',
      img: 'https://cdn.prod.website-files.com/69f216b8ea891f70c9adbd5c/69fd2fc3af58206abec1d68d_Home.avif'
    },
    {
      title: 'Dr. Chavhan Dental Clinic',
      category: 'Healthcare & Clinical Aesthetics',
      lead: 'Specialist dental clinic platform with high-converting patient appointment booking and clinical treatment showcases.',
      tags: ['Clinical Healthcare', 'Appointment Engine', 'Aesthetic Branding'],
      href: 'https://drchavhanmultispecialitydentalclinic.com/',
      img: '/img/studio-werkbank.jpg'
    }
  ];`;

const NEW_PROJECTS = `  var PROJECTS = [
    {
      title: 'WebCloud 3D Flagship Experience',
      category: '3D WebGL · Experience 2026',
      lead: 'An immersive interactive 3D web experience built to showcase next-generation digital craftsmanship and fluid WebGL performance.',
      tags: ['3D WebGL', 'Creative Direction', 'Flagship Experience'],
      href: 'https://webcloud-3d-flagship.vercel.app/',
      img: '/api/media/file/webcloud-3d-flagship.png'
    },
    {
      title: 'Sobha Privy Collection',
      category: 'Luxury Real Estate · Dubai',
      lead: 'Ultra-luxury real estate showcase engineered for high-net-worth client acquisition with immersive architectural layouts.',
      tags: ['Luxury Real Estate', 'Architecture', 'Dubai Flagship'],
      href: 'https://sobha-privy-collection.com/',
      img: 'https://sobha-privy-collection.com/assets/manifest/og.png'
    },
    {
      title: 'The Nest Sanctuary',
      category: 'Modern Workspace · Warsaw',
      lead: 'Modern architectural co-working and club sanctuary with seamless membership booking and interactive floorplans.',
      tags: ['Brand Identity', 'Modern Architecture', 'Warsaw'],
      href: 'https://thenest.pl/en',
      img: 'https://thenest.pl/images/the-nest-building.webp'
    },
    {
      title: 'Dr. Chavhan Dental Clinic',
      category: 'Healthcare & Clinical Aesthetics',
      lead: 'Specialist dental clinic platform with high-converting patient appointment booking and clinical treatment showcases.',
      tags: ['Clinical Healthcare', 'Appointment Engine', 'Aesthetic Branding'],
      href: 'https://drchavhanmultispecialitydentalclinic.com/',
      img: '/img/studio-werkbank.jpg'
    }
  ];`;

engine = engine.replace(OLD_PROJECTS, NEW_PROJECTS);

// Fix the buggy YouTube/socials replacement that wiped the journal card
const BUGGY_SOCIAL = `    // Remove YouTube from footer and socials, replace with WhatsApp
    document.querySelectorAll('footer a, nav a, ul a').forEach(function(a) {
      if (a.textContent.trim().toLowerCase() === 'youtube' || a.href.indexOf('youtube') !== -1) {
        a.textContent = 'WhatsApp';
        a.href = WA_URL + '?text=' + encodeURIComponent('Hello WebCloud!');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });`;

const CLEAN_SOCIAL = `    // Remove YouTube from footer socials only, replace with WhatsApp
    document.querySelectorAll('footer a').forEach(function(a) {
      if (a.textContent.trim().toLowerCase() === 'youtube' || a.href.indexOf('youtube') !== -1) {
        a.textContent = 'WhatsApp';
        a.href = WA_URL + '?text=' + encodeURIComponent('Hello WebCloud!');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });`;

engine = engine.replace(BUGGY_SOCIAL, CLEAN_SOCIAL);

// Enhance Journal section handling so Card 1 is never wiped
const OLD_JOURNAL_BLOCK = `    // Journal Section: Neutralize links so they do not navigate to blank pages
    document.querySelectorAll('section[aria-labelledby="journal-titel"] a, a[href*="/journal"]').forEach(function(a) {
      if (a.getAttribute('href') && a.getAttribute('href').indexOf('/journal') !== -1) {
        a.style.cursor = 'default';
        a.setAttribute('data-journal-card', 'true');
      }
      if (a.textContent.indexOf('YouTube') !== -1 || a.href.indexOf('youtube') !== -1) {
        var h3 = a.querySelector('h3');
        if (h3) h3.textContent = 'Why Conversion Beats Pure Decoration';
        var p = a.querySelector('p:not(.measure)');
        if (p) p.textContent = 'Why aesthetic design without conversion architecture is just expensive digital art. How WebCloud engineers for measurable ROI.';
      }
    });`;

const NEW_JOURNAL_BLOCK = `    // Journal Section: Neutralize links and keep full card structure
    document.querySelectorAll('section[aria-labelledby="journal-titel"] a, a[href*="/journal"]').forEach(function(a) {
      a.style.cursor = 'default';
      a.setAttribute('data-journal-card', 'true');
    });

    var journalCards = document.querySelectorAll('section[aria-labelledby="journal-titel"] li');
    if (journalCards.length > 0) {
      var card1 = journalCards[0];
      var cat1 = card1.querySelector('p.measure, p[data-cx="type"]');
      if (cat1) cat1.textContent = 'Insight   2026';
      var h3_1 = card1.querySelector('h3');
      if (h3_1) h3_1.textContent = 'Why Conversion Beats Pure Decoration';
      var p1 = card1.querySelector('p:not(.measure):not([data-cx="type"])');
      if (p1 && p1.childNodes && p1.childNodes[0]) {
        p1.childNodes[0].nodeValue = 'Why aesthetic design without conversion architecture is just expensive digital art. How WebCloud engineers for measurable ROI.';
      }
    }`;

engine = engine.replace(OLD_JOURNAL_BLOCK, NEW_JOURNAL_BLOCK);

fs.writeFileSync('c:/Artificial_Intelligence_Local/metic_clone/webcloud-engine.js', engine, 'utf8');
console.log('webcloud-engine.js updated successfully!');

// 2. Also update en/index.html & index.html static markup
function patchHomeStatic(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace Card 1 href with WebCloud 3D Flagship Experience
  html = html.replace('href="https://sobha-privy-collection.com/"', 'href="https://webcloud-3d-flagship.vercel.app/"');
  // Card 2 with Sobha Privy
  html = html.replace('href="https://thenest.pl/en"', 'href="https://sobha-privy-collection.com/"');
  // Card 3 with The Nest
  html = html.replace('href="https://21oaks.org/"', 'href="https://thenest.pl/en"');

  // Replace titles on cards
  html = html.replace('Dimbach Veterinary Practice', 'Sobha Privy Collection');
  html = html.replace('Veterinary care with heart, on a phone too.', 'Ultra-luxury real estate showcase engineered for high-net-worth client acquisition.');

  html = html.replace('Manuel Mayrhofer, portfolio', 'The Nest Sanctuary');
  html = html.replace('A CV that compiles itself first.', 'Modern architectural co-working and club sanctuary with seamless booking.');

  // First card
  html = html.replace('GORW Table Tennis', 'WebCloud 3D Flagship Experience');

  // Journal card 1 static text
  html = html.replace('New on YouTube: This is metic.', 'Why Conversion Beats Pure Decoration');
  html = html.replace('metic. is now on YouTube. The trailer shows what I do in under a minute and a half. Built like a website: from code, frame by frame.', 'Why aesthetic design without conversion architecture is just expensive digital art. How WebCloud engineers platforms for measurable ROI.');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Patched static home: ' + filePath);
}

patchHomeStatic('c:/Artificial_Intelligence_Local/metic_clone/en/index.html');
patchHomeStatic('c:/Artificial_Intelligence_Local/metic_clone/index.html');
