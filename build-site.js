const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

/* ============================== SITE CONSTANTS ============================== */
const SITE = {
  name: 'Rolstoeltaxi Spoed',
  parentBrand: 'Rolstoeltaxi Holland',
  domain: 'https://www.rolstoeltaxispoed.nl',
  phoneDisplay: '06 2876 1078',
  phoneTel: '+31628761078',
  whatsapp: '31628761078',
  web3formsKey: '', // vul hier de Web3Forms access key in om e-mail te koppelen
  email: 'info@rolstoeltaxispoed.nl',
  gtmId: 'GTM-PJ92NFWQ', // Google Tag Manager (regelt GA4 + Google Ads conversietracking)
};

const SERVICES = require('./content/services.js');
const CITIES = [
  ...require('./content/cities-amsterdam.js'),
  ...require('./content/cities-noord.js'),
  ...require('./content/cities-zuid.js'),
  ...require('./content/cities-rest.js'),
];
const cityPath = c => c.path || `/rolstoeltaxi-${c.slug}`;
const cityBySlug = slug => CITIES.find(c => c.slug === slug);
const TOP_CITIES = ['amsterdam', 'schiphol', 'amstelveen', 'haarlem', 'hoofddorp', 'zaandam', 'leiden', 'den-haag', 'rotterdam', 'utrecht', 'alkmaar', 'zandvoort'];

/* ============================== SHARED SHELL ============================== */

const CSS = fs.readFileSync(path.join(ROOT, 'shared.css.txt'), 'utf8');

function breadcrumbLd(items) {
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    ${items.map((it, i) => `{"@type":"ListItem","position":${i + 1},"name":${JSON.stringify(it.label)}${it.url ? `,"item":${JSON.stringify(it.url)}` : ''}}`).join(',\n    ')}
  ]
}
</script>`;
}

function breadcrumbNav(items) {
  return `<div class="breadcrumb reveal" role="navigation" aria-label="Kruimelpad">
  ${items.map((it, i) => it.href
      ? `<a href="${it.href}">${it.label}</a><span class="crumb-sep">/</span>`
      : `<span aria-current="page">${it.label}</span>`
    ).join('\n  ')}
</div>`;
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).trim() + '…';
}

function svgCheck() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
}

function logoMark(prefix) {
  return `<img src="/img/logo-rolstoeltaxi-spoed-nobg.png" alt="${SITE.name}" width="118" height="46">`;
}

const ICONS = {
  bolt: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>`,
  clock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  checkCircle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3L16 10"/></svg>`,
  badge: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.6 1.5L18 3l.6 3.4L21 9l-1.5 2.6L21 15l-2.4 2.6L18 21l-3.4-.5L12 22l-2.6-1.5L6 21l-.6-3.4L3 15l1.5-2.6L3 9l2.4-2.6L6 3l3.4.5L12 2z"/><path d="M9 12l2 2 4-4"/></svg>`,
  mapPin: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  phoneCall: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 005 5L14 12l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3z"/></svg>`,
  wheelchair: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="17" cy="18" r="3.5"/><circle cx="8" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M8 8v5l3 2 3 6M8 13h6l3-6"/></svg>`,
  plane: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3L3 10.5l7 2.5m0 0l2.5 7L21 3M10 13l6.5-6.5"/></svg>`,
  medical: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>`,
  van: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="15" height="10" rx="1"/><path d="M17 16v-5l3-3h1a2 2 0 012 2v6"/><path d="M2 16h20"/><circle cx="7" cy="18" r="1.8"/><circle cx="18.5" cy="18" r="1.8"/></svg>`,
  calendarCheck: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8.5 15l2 2 4-4"/></svg>`,
  whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.8 14.2c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>`,
  play: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14.5 14.5 0 010 18"/><path d="M12 3a14.5 14.5 0 000 18"/></svg>`,
  heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.35-9.5-8.8C.86 8.2 2.1 4.8 5.3 4.1c2-.44 3.9.4 5 2.1a1 1 0 001.4 0c1.1-1.7 3-2.54 5-2.1 3.2.7 4.44 4.1 2.8 7.1C19 15.65 12 20 12 20z"/></svg>`,
};

function videoEmbed(videoId, title) {
  return `<div class="video-embed" data-video-id="${videoId}" role="button" tabindex="0" aria-label="Video afspelen: ${title}">
  <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${title}" loading="lazy">
  <span class="play-btn" aria-hidden="true">${ICONS.play}</span>
</div>`;
}

function marqueeBand(en) {
  const items = en
    ? ['Emergency transport', 'Hospital transport', 'Wheelchair transport', 'Airport transport', 'Mobility scooter transport', 'Call now', '24/7 available']
    : ['Spoedvervoer', 'Ziekenhuisvervoer', 'Rolstoelvervoer', 'Luchthavenvervoer', 'Scootmobiel vervoer', 'Bel direct', '24/7 bereikbaar'];
  const spans = items.map(t => `<span>${t}</span>`).join('');
  return `<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    ${spans}${spans}
  </div>
</div>`;
}

function callBanner(en) {
  return `<section class="call-banner">
  <div class="wrap">
    <span class="lbl">${ICONS.phoneCall} ${en ? 'Call now, schedule a driver right away:' : 'Bel nu, direct een chauffeur inplannen:'}</span>
    <div class="call-banner-video">${videoEmbed('FZnAOHJuVqk', en ? 'Instruction film: securing a wheelchair in the vehicle' : 'Instructiefilm: rolstoel vastzetten in de rolstoelbus')}</div>
    <a href="tel:${SITE.phoneTel}" class="num">${SITE.phoneDisplay}</a>
  </div>
</section>`;
}

function altPathFor(canonicalPath, locale) {
  if (locale === 'en') return canonicalPath.replace(/^en\/?/, '');
  return canonicalPath ? `en/${canonicalPath}` : 'en';
}

function head({ title, description, canonicalPath, prefix, extraLd, locale = 'nl' }) {
  const altPath = altPathFor(canonicalPath, locale);
  const nlHref = `${SITE.domain}/${locale === 'en' ? altPath : canonicalPath}`;
  const enHref = `${SITE.domain}/${locale === 'en' ? canonicalPath : altPath}`;
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE.domain}/${canonicalPath}">
<link rel="alternate" hreflang="nl" href="${nlHref}">
<link rel="alternate" hreflang="en" href="${enHref}">
<link rel="alternate" hreflang="x-default" href="${nlHref}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'nl_NL'}">
<meta property="og:url" content="${SITE.domain}/${canonicalPath}">
<meta property="og:image" content="${SITE.domain}/img/logo-rolstoeltaxi-spoed-nobg.png">
<link rel="icon" type="image/png" href="${prefix}img/logo-icoon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted'
});
</script>
${extraLd || ''}
<style>
${CSS}
</style>
</head>`;
}

function nav(prefix, locale = 'nl', altHref = '/') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const svcLinks = SERVICES.map(s => `<li><a href="${base}/diensten/${s.slug}">${(en ? s.en : s).nav}</a></li>`).join('');
  const cityLinks = TOP_CITIES.map(slug => { const c = cityBySlug(slug); return `<li><a href="${base}${cityPath(c)}">${en ? (c.en.name || c.name) : c.name}</a></li>`; }).join('');
  const t = {
    diensten: en ? 'Services' : 'Diensten',
    locaties: en ? 'Locations' : 'Locaties',
    alleDiensten: en ? 'All services' : 'Alle diensten',
    alleLocaties: en ? `All ${CITIES.length} locations` : `Alle ${CITIES.length} locaties`,
    spoedNu: en ? 'Emergency now' : 'Spoed nu',
    tarieven: en ? 'Rates' : 'Tarieven',
    overOns: en ? 'About us' : 'Over ons',
    belDirect: en ? 'Call now' : 'Bel direct',
    contact: en ? 'Contact' : 'Contact',
    menuOpen: en ? 'Open menu' : 'Menu openen',
    menuClose: en ? 'Close menu' : 'Menu sluiten',
    langLabel: en ? 'Bekijk in het Nederlands' : 'View in English',
    langShort: en ? 'NL' : 'EN',
  };
  return `<nav id="nav">
  <div class="wrap nav-inner">
    <a href="${base}/" class="logo">${logoMark(prefix)}</a>
    <ul class="nav-links">
      <li class="has-dd"><a href="${base}/diensten">${t.diensten} <span class="caret">▾</span></a>
        <div class="dd"><ul>${svcLinks}<li class="dd-all"><a href="${base}/diensten">${t.alleDiensten}</a></li></ul></div></li>
      <li class="has-dd"><a href="${base}/locaties">${t.locaties} <span class="caret">▾</span></a>
        <div class="dd dd-wide"><ul>${cityLinks}<li class="dd-all"><a href="${base}/locaties">${t.alleLocaties}</a></li></ul></div></li>
      <li><a href="${base}/diensten/spoedvervoer-rolstoeltaxi" class="nav-spoed"><span class="nav-spoed-dot"></span>${t.spoedNu}</a></li>
      <li><a href="${base}/tarieven">${t.tarieven}</a></li>
      <li><a href="${base}/over-ons">${t.overOns}</a></li>
      <li><a href="${altHref}" class="lang-switch" aria-label="${t.langLabel}">${ICONS.globe}${t.langShort}</a></li>
      <li><a href="tel:${SITE.phoneTel}" class="btn btn-nav">${t.belDirect}</a></li>
    </ul>
    <div class="nav-mobile-actions">
      <a href="${altHref}" class="lang-switch lang-switch-mobile" aria-label="${t.langLabel}">${ICONS.globe}${t.langShort}</a>
      <button class="hamburger" id="hamburger" aria-label="${t.menuOpen}" aria-expanded="false">☰</button>
    </div>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigatiemenu">
  <button class="mobile-close" id="mobileClose" aria-label="${t.menuClose}">✕</button>
  <a href="${base}/diensten">${t.diensten}</a>
  <a href="${base}/locaties">${t.locaties}</a>
  <a href="${base}/diensten/spoedvervoer-rolstoeltaxi" class="nav-spoed"><span class="nav-spoed-dot"></span>${t.spoedNu}</a>
  <a href="${base}/tarieven">${t.tarieven}</a>
  <a href="${base}/over-ons">${t.overOns}</a>
  <a href="${base}/contact">${t.contact}</a>
  <a href="${altHref}" class="lang-switch"><span aria-hidden="true">${ICONS.globe}</span>${t.langLabel}</a>
  <a href="tel:${SITE.phoneTel}" class="btn">${t.belDirect}</a>
</div>`;
}

function footer(prefix, locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const serviceLinks = SERVICES.map(s => `<li><a href="${base}/diensten/${s.slug}">${(en ? s.en : s).nav}</a></li>`).join('\n          ');
  const cityLinks = TOP_CITIES.map(slug => { const c = cityBySlug(slug); return `<li><a href="${base}${cityPath(c)}">${en ? (c.en.name || c.name) : c.name}</a></li>`; }).join('\n          ');
  const t = en ? {
    tagline: `The emergency branch of ${SITE.parentBrand}: wheelchair transport in the Netherlands, reachable 24 hours a day for rides that can't wait.`,
    diensten: 'Services', locaties: 'Locations', alleLocaties: 'All locations', contact: 'Contact',
    onderdeelVan: `Part of ${SITE.parentBrand}`, overOns: 'About us', reserveren: 'Book now', tarieven: 'Rates',
    faq: 'FAQ', privacy: 'Privacy policy',
  } : {
    tagline: `De spoedtak van ${SITE.parentBrand}: rolstoelvervoer in Nederland, 24 uur per dag bereikbaar voor ritten die niet kunnen wachten.`,
    diensten: 'Diensten', locaties: 'Locaties', alleLocaties: 'Alle locaties', contact: 'Contact',
    onderdeelVan: `Onderdeel van ${SITE.parentBrand}`, overOns: 'Over ons', reserveren: 'Direct reserveren', tarieven: 'Tarieven',
    faq: 'Veelgestelde vragen', privacy: 'Privacyverklaring',
  };
  return `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-logo-row">${logoMark(prefix)}</div>
        <p>${t.tagline}</p>
      </div>
      <div>
        <h4>${t.diensten}</h4>
        <ul>
          ${serviceLinks}
        </ul>
      </div>
      <div>
        <h4>${t.locaties}</h4>
        <ul class="foot-areas">
          ${cityLinks}
          <li><a href="${base}/locaties"><b>${t.alleLocaties}</b></a></li>
        </ul>
      </div>
      <div>
        <h4>${t.contact}</h4>
        <ul>
          <li><a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${t.onderdeelVan}</li>
          <li style="margin-top:10px"><a href="${base}/over-ons">${t.overOns}</a></li>
          <li><a href="${base}/contact">${t.reserveren}</a></li>
          <li><a href="${base}/tarieven">${t.tarieven}</a></li>
          <li><a href="${base}/veelgestelde-vragen">${t.faq}</a></li>
          <li><a href="${base}/privacyverklaring">${t.privacy}</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 ${SITE.name}</span>
    </div>
  </div>
</footer>`;
}

function stickyCta({ hideBook, locale = 'nl' } = {}) {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<div class="cta-dock" id="ctaDock">
  <a href="tel:${SITE.phoneTel}" class="dock-call" data-cta="dock">${ICONS.phoneCall}<span><small>${en ? 'Call now' : 'Bel direct'}</small><b>${SITE.phoneDisplay}</b></span></a>
  <a href="https://wa.me/${SITE.whatsapp}" class="dock-wa" aria-label="${en ? 'WhatsApp us' : 'WhatsApp ons'}">${ICONS.whatsapp}</a>
  ${hideBook ? '' : `<a href="${base}/contact#formulier" class="dock-book">${en ? 'Book' : 'Reserveren'}</a>`}
</div>`;
}

function cookieBanner(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const heading = en ? 'We use cookies' : 'Wij gebruiken cookies';
  const text = en
    ? `Necessary cookies keep this site working. We only place analytics and advertising cookies (Google Analytics, Google Ads) with your consent. Read more in our <a href="${base}/privacyverklaring">privacy policy</a>.`
    : `Noodzakelijke cookies zorgen dat deze site werkt. Analytische en advertentiecookies (Google Analytics, Google Ads) plaatsen we alleen met uw toestemming. Meer weten? Lees onze <a href="${base}/privacyverklaring">privacyverklaring</a>.`;
  return `<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="${en ? 'Cookie notice' : 'Cookiemelding'}">
  <h2>${heading}</h2>
  <p>${text}</p>
  <div class="cb-actions">
    <button type="button" class="btn btn-ghost" id="cookieDecline">${en ? 'Necessary only' : 'Alleen noodzakelijk'}</button>
    <button type="button" class="btn btn-yellow" id="cookieAccept">${en ? 'Accept' : 'Akkoord'}</button>
  </div>
</div>
<script>
(function () {
  var KEY = 'rtsConsentV1';
  var GTM_ID = '${SITE.gtmId}';
  var banner = document.getElementById('cookieBanner');
  var acceptBtn = document.getElementById('cookieAccept');
  var declineBtn = document.getElementById('cookieDecline');
  if (!banner || !acceptBtn || !declineBtn) return;

  var gtmLoaded = false;
  function loadGTM() {
    if (gtmLoaded || !GTM_ID) return;
    gtmLoaded = true;
    dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}

  if (stored && stored.granted) {
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    loadGTM();
  } else if (!stored) {
    setTimeout(function () { banner.classList.add('show'); document.body.classList.add('cc-open'); }, 800);
  }

  function choose(granted) {
    banner.classList.remove('show');
    document.body.classList.remove('cc-open');
    try { localStorage.setItem(KEY, JSON.stringify({ granted: granted, ts: new Date().toISOString() })); } catch (e) {}
    if (granted) {
      gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
      loadGTM();
    }
  }
  acceptBtn.addEventListener('click', function () { choose(true); });
  declineBtn.addEventListener('click', function () { choose(false); });
})();
</script>`;
}

function scripts({ skipSticky, skipFaq, useScrollThreshold } = {}) {
  return `<script>
// nav scroll state
const nav = document.getElementById('nav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);
}, {passive:true});

// mobile menu
const menu = document.getElementById('mobileMenu');
const burger = document.getElementById('hamburger');
const closeBtn = document.getElementById('mobileClose');
const toggleMenu = open => {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
  menuOpen = open;
  if (typeof updateSticky === 'function') updateSticky();
};
burger.addEventListener('click', () => toggleMenu(true));
closeBtn.addEventListener('click', () => toggleMenu(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
let menuOpen = false;
${skipFaq ? '' : `
// faq accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open);
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  });
});`}
// video embeds (laden pas na klik, geen YouTube-cookies vooraf)
document.querySelectorAll('.video-embed').forEach(el => {
  function load() {
    const id = el.dataset.videoId;
    el.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + el.getAttribute('aria-label') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }
  el.addEventListener('click', load);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } });
});

// scroll reveals
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ambient particles (dark sections)
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('canvas.particles').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const section = canvas.closest('section,header');
    let w, h, drops, running = false, raf;
    const DENSITY = 9000;
    function resize() {
      w = canvas.width = section.offsetWidth;
      h = canvas.height = section.offsetHeight;
      const count = Math.max(14, Math.min(46, Math.round((w * h) / DENSITY)));
      drops = Array.from({ length: count }, makeDrop);
    }
    function makeDrop(existing) {
      return {
        x: Math.random() * w,
        y: existing ? h + Math.random() * 40 : Math.random() * h,
        r: 1 + Math.random() * 2.2,
        speed: 0.25 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 0.3,
        alpha: 0.12 + Math.random() * 0.22,
      };
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#bcd4ff';
      for (const d of drops) {
        d.y -= d.speed;
        d.x += d.drift;
        if (d.y < -10) Object.assign(d, makeDrop(true), { y: h + 10 });
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(tick);
    }
    function start() { if (running) return; running = true; raf = requestAnimationFrame(tick); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    resize();
    addEventListener('resize', resize, {passive:true});
    new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, {threshold:0}).observe(section);
  });
}
</script>`;
}

function page({ title, description, canonicalPath, prefix, extraLd, bodyHtml, skipSticky, skipFaq, stickyLabel, useScrollThreshold, locale = 'nl' }) {
  const altHref = '/' + altPathFor(canonicalPath, locale);
  const isContact = canonicalPath === 'contact' || canonicalPath === 'en/contact';
  return `<!DOCTYPE html>
<html lang="${locale === 'en' ? 'en' : 'nl'}">
${head({ title, description, canonicalPath, prefix, extraLd, locale })}
<body>

${nav(prefix, locale, altHref)}

${bodyHtml}

${footer(prefix, locale)}

${stickyCta({ hideBook: isContact, locale })}

${cookieBanner(locale)}

${scripts({ skipSticky, skipFaq, useScrollThreshold })}
</body>
</html>
`;
}

/* ============================== SERVICE PAGE BODY ============================== */

function serviceLd(svc, locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const d = en ? svc.en : svc;
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "${d.h1}",
  "provider": { "@type": "TaxiService", "name": "${SITE.name}", "telephone": "${SITE.phoneTel}" },
  "areaServed": "${en ? 'Netherlands' : 'Nederland'}",
  "url": "${SITE.domain}${base}/diensten/${svc.slug}"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${d.faqs.map(f => `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`).join(',\n    ')}
  ]
}
</script>
${breadcrumbLd([
  { label: 'Home', url: `${SITE.domain}${base}/` },
  { label: en ? 'Services' : 'Diensten', url: `${SITE.domain}${base}/#diensten` },
  { label: d.nav },
])}`;
}

function buildServiceBody(svc, locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const d = en ? svc.en : svc;
  return `<!-- PAGE HERO -->
<header class="page-hero has-photo" style="background-image:url('/img/${svc.hero || svc.images[0].src}');background-position:${svc.heroPosition || 'center'}">
  <div class="wrap">
    <div class="hero-box reveal">
      ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Services' : 'Diensten', href: `${base}/#diensten` }, { label: d.nav }])}
      <span class="eyebrow">${d.eyebrow}</span>
      <h1>${d.h1}</h1>
      <p class="lead">${d.lead}</p>
      <div class="hero-cta hero-cta-main">
        <a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${en ? 'Call now' : 'Bel direct'}</a>
        <a href="${base}/contact" class="btn btn-ghost">${en ? 'Book now' : 'Plan nu'}</a>
      </div>
    </div>
  </div>
</header>

<!-- OVER DEZE DIENST -->
<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Background' : 'Achtergrond'}</span>
      <h2>${d.about.title}</h2>
    </div>
    <div class="about-info-grid">
      <div class="reveal reveal-d1">
        ${d.about.paragraphs.map(par => `<p>${par}</p>`).join('\n        ')}
      </div>
      <div class="signals-card reveal reveal-d2">
        <h4>${en ? 'Sound familiar?' : 'Herkent u dit?'}</h4>
        <ul class="signals-list">
          ${d.about.signals.map(s => `<li>${s}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- MARQUEE + CALL BANNER -->
${marqueeBand(en)}
${callBanner(en)}

<!-- UITGEBREID -->
<section>
  <div class="wrap">
    <div class="split" style="align-items:start;margin-top:0">
      <div class="long reveal">
        ${(d.sections || []).map(sec => `<h2>${sec.title}</h2>${sec.paragraphs.map(par => `<p>${par}</p>`).join('')}`).join('')}
      </div>
      <div class="reveal reveal-d1" style="display:grid;gap:18px">
        ${svc.images.map(img => `<figure class="photo-card landscape"><img src="/img/${img.src}" alt="${en ? (img.altEn || img.alt) : img.alt}" width="1000" height="750" loading="lazy"></figure>`).join('')}
      </div>
    </div>
  </div>
</section>

${d.instapSteps ? `<!-- INSTAPPROCEDURE -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Safety' : 'Veiligheid'}</span>
      <h2>${en ? 'How boarding' : 'Zo gaat het'} <span class="serif-i">${en ? 'works' : 'instappen'}</span></h2>
      <p>${en ? 'Step by step, always the same way, so the wheelchair and belt are secure before we drive off.' : 'Stap voor stap, altijd op dezelfde manier, zodat de rolstoel en de gordel goed vastzitten voordat we wegrijden.'}</p>
    </div>
    <div class="split" style="margin-top:8px;align-items:start">
      <div class="steps-stack">
        ${d.instapSteps.map((s, i) => `<div class="step-row reveal reveal-d${i % 4}">
          <div class="big">0${i + 1}</div>
          <div><h3>${s}</h3></div>
        </div>`).join('\n        ')}
      </div>
      <div class="reveal reveal-d1">${videoEmbed('FZnAOHJuVqk', en ? 'Instruction film: securing a wheelchair in the vehicle' : 'Instructiefilm: rolstoel vastzetten in de rolstoelbus')}</div>
    </div>
  </div>
</section>` : ''}

<!-- WAT U KRIJGT -->
<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'What you get' : 'Wat u krijgt'}</span>
      <h2>${en ? 'Clearly' : 'Duidelijk'} <span class="serif-i">${en ? 'arranged' : 'geregeld'}</span></h2>
    </div>
    <div class="grid-4">
      ${d.deliverables.map((it, i) => `<div class="card reveal reveal-d${i % 4}">
        <span class="num">0${i + 1}</span>
        <h3>${it.t}</h3>
        <p>${it.d}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- PRIJS -->
<section style="padding:64px 0">
  <div class="wrap">
    <div class="price-box reveal">
      <div>
        <span class="eyebrow">${en ? 'Price indication' : 'Prijsindicatie'}</span>
        <h3>${d.priceText}</h3>
      </div>
      <p>${d.priceNote}</p>
    </div>
  </div>
</section>

<!-- WERKWIJZE -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'How it works' : 'Werkwijze'}</span>
      <h2>${en ? "Here's how" : 'Zo pakken we'} <span class="serif-i">${en ? 'we handle it' : 'het aan'}</span></h2>
    </div>
    <div class="steps">
      ${d.steps.map((s, i) => `<div class="step reveal reveal-d${i}">
        <div class="big">${i + 1}.</div>
        <h3>${s.t}</h3>
        <p>${s.d}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- BESCHIKBAAR IN -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Locations' : 'Locaties'}</span>
      <h2>${d.nav} <span class="serif-i">${en ? 'near you' : 'in de buurt'}</span></h2>
      <p>${en ? "We drive throughout the Netherlands. These are the places we visit most often." : 'We rijden in Nederland. Dit zijn de plaatsen waar we het vaakst komen.'}</p>
    </div>
    <div class="area-list reveal">
      ${TOP_CITIES.map(slug => { const c = cityBySlug(slug); return `<a href="${base}${cityPath(c)}">${c.name}</a>`; }).join('\n      ')}
      <a href="${base}/locaties"><b>${en ? 'All locations' : 'Alle locaties'}</b></a>
    </div>
  </div>
</section>

<!-- GERELATEERDE DIENSTEN -->
<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Also useful' : 'Ook interessant'}</span>
      <h2>${en ? 'Related' : 'Gerelateerde'} <span class="serif-i">${en ? 'services' : 'diensten'}</span></h2>
    </div>
    <div class="related-grid">
      ${svc.related.map(slug => {
        const rel = SERVICES.find(s => s.slug === slug);
        const relD = en ? rel.en : rel;
        return `<a href="${base}/diensten/${rel.slug}" class="related-card reveal">
        <span>${relD.nav}</span><span class="arrow">→</span>
      </a>`;
      }).join('\n      ')}
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Frequently asked questions' : 'Veelgestelde vragen'}</span>
      <h2>${en ? 'Good to' : 'Goed om te'} <span class="serif-i">${en ? 'know' : 'weten'}</span></h2>
    </div>
    <div class="faq-list">
      ${d.faqs.map(f => `<div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">${f.q}</button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get help right away' : 'Direct geholpen worden'}</span>
    <h2 class="reveal reveal-d1">${d.h1}? <span class="serif-i">${en ? 'Feel free to call.' : 'Bel gerust.'}</span></h2>
    <p class="reveal reveal-d2">${en ? "Call now for an emergency, or book a ride online for later." : 'Bel direct voor spoed, of plan online een rit voor later.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent)">${en ? 'book a ride online' : 'plan online een rit'}</a> · ${en ? 'also reachable via WhatsApp' : 'ook per WhatsApp bereikbaar'}</p>
  </div>
</section>`;
}

/* ============================== LOCATION PAGES ============================== */

function cityLd(c, locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const d = en ? c.en : c;
  const url = `${SITE.domain}${base}${cityPath(c)}`;
  const name = en ? (c.en.name || c.name) : c.name;
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "${SITE.name}",
  "serviceType": ${JSON.stringify(c.isService ? name : `${en ? 'Wheelchair taxi' : 'Rolstoeltaxi'} ${name}`)},
  "telephone": "${SITE.phoneTel}",
  "image": "${SITE.domain}/img/logo-icoon.png",
  "areaServed": ${c.isService ? '"Amsterdam"' : JSON.stringify({ '@type': 'City', name: c.name })},
  "url": "${url}",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${d.faqs.map(f => `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`).join(',\n    ')}
  ]
}
</script>
${breadcrumbLd([
  { label: 'Home', url: `${SITE.domain}${base}/` },
  { label: en ? 'Locations' : 'Locaties', url: `${SITE.domain}${base}/locaties` },
  { label: name },
])}`;
}

function buildCityBody(c, locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const d = en ? c.en : c;
  const name = en ? (c.en.name || c.name) : c.name;
  const loc = en ? `in ${name}` : (c.in || `in ${c.name}`);
  const introHead = c.isService ? `${name}, <span class="serif-i">${en ? 'arranged simply' : 'zo geregeld'}</span>`
    : c.distant ? `${en ? 'Rides to and from' : 'Ritten naar en vanuit'} <span class="serif-i">${name}</span>`
    : `${en ? 'Wheelchair transport' : 'Rolstoelvervoer'} <span class="serif-i">${loc}</span>`;
  const h1 = c.isService ? `${name} <span class="serif-i">${en ? 'with emergency service' : 'met spoedservice'}</span>` : `${en ? 'Wheelchair taxi' : 'Rolstoeltaxi'} ${name} <span class="serif-i">${en ? 'with emergency service' : 'met spoedservice'}</span>`;
  const eyebrow = c.isService ? `${en ? 'Hospital transport' : 'Ziekenhuisvervoer'} · Amsterdam` : `${en ? 'Wheelchair taxi' : 'Rolstoeltaxi'} · ${name}`;
  const nearby = c.nearby.map(cityBySlug).filter(Boolean);
  const photoClass = c.portrait ? 'portrait' : 'landscape';
  const photo2 = c.photo2 || (c.region === 'Amsterdam en omgeving' ? { src: 'spoedrit-amsterdam-centraal.jpg', alt: 'Rolstoelbus met uitgeklapte laadklep in de stad', altEn: 'Wheelchair-accessible vehicle with the ramp deployed in the city' } : { src: 'rolstoelbus-zijkant.jpg', alt: 'Rolstoelbus, zijaanzicht, met ruime zijruiten', altEn: 'Wheelchair-accessible vehicle, side view, with large windows' });
  return `<!-- PAGE HERO -->
<header class="page-hero has-photo" style="background-image:url('/img/${c.photo.src}');background-position:${c.photo.pos || 'center'}">
  <div class="wrap">
    <div class="hero-box reveal">
      ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Locations' : 'Locaties', href: `${base}/locaties` }, { label: name }])}
      <span class="eyebrow">${eyebrow}</span>
      <h1>${h1}</h1>
      <div class="proof"><span><b>24/7</b> ${en ? 'available' : 'bereikbaar'}</span><span><b>10+</b> ${en ? 'years experience' : 'jaar ervaring'}</span><span><b>5000+</b> ${en ? 'rides' : 'ritten'}</span></div>
      <div class="hero-cta hero-cta-main">
        <a href="tel:${SITE.phoneTel}" class="btn btn-yellow" data-cta="primary">${en ? 'Call now' : 'Bel direct'}</a>
        <a href="${base}/contact" class="btn btn-ghost">${en ? 'Book now' : 'Plan nu'}</a>
      </div>
      <p class="lead">${d.lead}</p>
    </div>
  </div>
</header>

<!-- INTRO -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${c.isService ? (en ? 'Hospital transport' : 'Ziekenhuisvervoer') : (en ? 'Wheelchair transport' : 'Rolstoelvervoer')}</span>
      <h2>${introHead}</h2>
    </div>
    <div class="split">
      <div class="reveal">
        ${d.intro.map(par => `<p>${par}</p>`).join('\n        ')}
        <p><a href="${base}/diensten/spoedvervoer-rolstoeltaxi" style="color:var(--accent);font-weight:700">${en ? 'More about emergency transport →' : 'Meer over spoedvervoer →'}</a></p>
      </div>
      <figure class="photo-card ${photoClass} reveal reveal-d1">
        <img src="/img/${c.photo.src}" alt="${en ? (c.photo.altEn || c.photo.alt) : c.photo.alt}" width="${c.portrait ? 900 : 1000}" height="${c.portrait ? 1200 : 750}" loading="lazy" style="object-position:${c.photo.pos || 'center'}">
      </figure>
    </div>
  </div>
</section>

<!-- MARQUEE + CALL BANNER -->
${marqueeBand(en)}
${callBanner(en)}

<!-- PLEKKEN -->
<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${c.isService ? (en ? 'How we help' : 'Waarmee wij helpen') : (en ? 'Places and neighbourhoods' : 'Plekken en wijken')}</span>
      <h2>${c.isService ? `${en ? 'From appointment to' : 'Van afspraak tot'} <span class="serif-i">${en ? 'discharge' : 'ontslag'}</span>` : `${en ? 'Where we pick you up and' : 'Waar wij u ophalen en'} <span class="serif-i">${en ? 'drop you off' : 'afzetten'}</span>`}</h2>
    </div>
    <div class="grid-3">
      ${d.plekken.map((pl, i) => `<div class="spot reveal reveal-d${i % 3}"><h3>${pl.t}</h3><p>${pl.d}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- RITTEN -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Frequently requested rides' : 'Veelgevraagde ritten'}</span>
      <h2>${c.isService ? `${en ? 'Rides we drive' : 'Ritten die wij'} <span class="serif-i">${en ? 'often' : 'vaak rijden'}</span>` : c.distant ? `${en ? 'To and from' : 'Vanaf en naar'} <span class="serif-i">${name}</span>` : `${en ? 'Rides' : 'Ritten'} <span class="serif-i">${loc}</span>`}</h2>
    </div>
    <ul class="trip-list">
      ${d.ritten.map((r, i) => `<li class="reveal reveal-d${i % 2}"><span class="ar">→</span><div><b>${r.t}</b><span>${r.d}</span></div></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- SPOED -->
<section class="spoed-band night band-line" style="position:relative;overflow:hidden">
  <canvas class="particles"></canvas>
  <div class="wrap" style="position:relative;z-index:1">
    <span class="eyebrow reveal">${en ? 'Emergency' : 'Spoed'}</span>
    <h2 class="reveal reveal-d1">${en ? 'Emergency' : 'Spoed'} ${c.isService ? (en ? 'hospital transport' : 'ziekenhuisvervoer') : loc}? <span class="serif-i">${en ? 'Call now.' : 'Bel direct.'}</span></h2>
    <p class="reveal reveal-d2">${d.spoed}</p>
    <div class="reveal reveal-d3"><a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a></div>
  </div>
</section>

<!-- BEREIKBAARHEID -->
<section>
  <div class="wrap">
    <div class="split">
      <figure class="photo-card landscape reveal">
        <img src="/img/${photo2.src}" alt="${en ? (photo2.altEn || photo2.alt) : photo2.alt}" width="1000" height="750" loading="lazy">
      </figure>
      <div class="reveal reveal-d1">
        <span class="eyebrow">${en ? 'Pickup and accessibility' : 'Ophalen en bereikbaarheid'}</span>
        <h2 style="font-size:clamp(26px,3.4vw,38px);margin-bottom:18px">${c.isService ? (en ? 'At the right entrance' : 'Bij de juiste ingang') : `${en ? 'How it works' : 'Zo werkt het'} ${loc}`}</h2>
        <p>${d.bereik}</p>
        <p>${en ? 'Our vehicles have an electric ramp and fixed anchor points. A companion or family member is welcome to ride along.' : 'Onze bussen hebben een elektrische laadklep en vaste bevestigingspunten. Een begeleider of familielid rijdt gewoon mee.'}</p>
      </div>
    </div>
  </div>
</section>

<!-- DIENSTEN -->
<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Services' : 'Diensten'}</span>
      <h2>${en ? 'Our services' : 'Onze diensten'} <span class="serif-i">${c.isService ? 'in Amsterdam' : loc}</span></h2>
      <p>${en ? `All ${SITE.name} services are available ${c.isService ? 'in Amsterdam' : c.distant ? `for rides to and from ${name}` : loc}.` : `Alle diensten van Rolstoeltaxi Spoed zijn ${c.isService ? 'in Amsterdam' : c.distant ? `voor ritten naar en vanuit ${c.name}` : loc} beschikbaar.`}</p>
    </div>
    <div class="grid-4">
      ${SERVICES.map((sv, i) => { const svd = en ? sv.en : sv; return `<a href="${base}/diensten/${sv.slug}" class="card reveal reveal-d${i % 4}"><h3>${svd.nav}</h3><p>${truncate(svd.lead, 80)}</p></a>`; }).join('\n      ')}
    </div>
  </div>
</section>

<!-- STAPPEN -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'How it works' : 'Zo werkt het'}</span>
      <h2>${en ? 'Arranged in' : 'In'} ${en ? '' : 'drie stappen '}<span class="serif-i">${en ? 'three steps' : 'geregeld'}</span></h2>
    </div>
    <div class="steps">
      ${en ? `<div class="step reveal"><div class="big">1.</div><h3>Call or message us</h3><p>Tell us where to pick you up, where you're going, and whether any equipment is coming along.</p></div>
      <div class="step reveal reveal-d1"><div class="big">2.</div><h3>We schedule the vehicle</h3><p>You'll hear the arrival time and the price right away, before we set off.</p></div>
      <div class="step reveal reveal-d2"><div class="big">3.</div><h3>Safely transported</h3><p>The driver helps with boarding and getting off, and secures the wheelchair.</p></div>`
      : `<div class="step reveal"><div class="big">1.</div><h3>Bel of app ons</h3><p>Vertel waar u wordt opgehaald, waar u naartoe moet en of er hulpmiddelen mee gaan.</p></div>
      <div class="step reveal reveal-d1"><div class="big">2.</div><h3>Wij plannen de bus in</h3><p>U hoort direct de aankomsttijd en de prijs, voordat we vertrekken.</p></div>
      <div class="step reveal reveal-d2"><div class="big">3.</div><h3>Veilig vervoerd</h3><p>De chauffeur helpt bij het in- en uitstappen en zet de rolstoel vast.</p></div>`}
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq" class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Frequently asked questions' : 'Veelgestelde vragen'}</span>
      <h2>${en ? 'Questions about' : 'Vragen over'} ${c.isService ? (en ? 'hospital transport in Amsterdam' : 'ziekenhuisvervoer in Amsterdam') : `${en ? 'wheelchair taxi' : 'rolstoeltaxi'} <span class="serif-i">${name}</span>`}</h2>
    </div>
    <div class="faq-list">
      ${d.faqs.map(f => `<div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">${f.q}</button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- IN DE BUURT -->
<section style="padding:64px 0">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Also active nearby' : 'Ook actief in de buurt'}</span>
      <h2>${en ? 'Wheelchair taxi' : 'Rolstoeltaxi'} <span class="serif-i">${en ? 'in the area' : 'in de omgeving'}</span></h2>
    </div>
    <div class="area-list reveal">
      ${nearby.map(n => `<a href="${base}${cityPath(n)}">${n.name}</a>`).join('\n      ')}
      <a href="${base}/locaties"><b>${en ? 'All locations' : 'Alle locaties'}</b></a>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get help right away' : 'Direct geholpen worden'}</span>
    <h2 class="reveal reveal-d1">${c.isService ? (en ? 'Hospital transport' : 'Ziekenhuisvervoer') : `${en ? 'Wheelchair taxi' : 'Rolstoeltaxi'} ${name}`}? <span class="serif-i">${en ? 'Feel free to call.' : 'Bel gerust.'}</span></h2>
    <p class="reveal reveal-d2">${en ? "Call now for an emergency, or book a ride online for later. You'll hear the price beforehand." : 'Bel direct voor spoed, of plan online een rit voor later. U hoort de prijs vooraf.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a> · ${en ? 'also via' : 'ook per'} <a href="https://wa.me/${SITE.whatsapp}" style="color:var(--accent-2)">WhatsApp</a></p>
  </div>
</section>`;
}

/* ============================== HUB PAGES ============================== */

function buildDienstenHub(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<header class="page-hero has-photo" style="background-image:url('/img/rolstoelbus-torenhof.jpg');background-position:center 60%">
  <div class="wrap">
    <div class="hero-box reveal">
      ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Services' : 'Diensten' }])}
      <span class="eyebrow">${en ? 'Services' : 'Diensten'}</span>
      <h1>${en ? 'All services from' : 'Alle diensten van'} <span class="serif-i">${SITE.name}</span></h1>
      <div class="proof"><span><b>24/7</b> ${en ? 'available' : 'bereikbaar'}</span><span><b>10+</b> ${en ? 'years experience' : 'jaar ervaring'}</span><span><b>${SERVICES.length}</b> ${en ? 'services' : 'diensten'}</span></div>
      <div class="hero-cta hero-cta-main">
        <a href="tel:${SITE.phoneTel}" class="btn btn-yellow" data-cta="primary">${en ? 'Call now' : 'Bel direct'}</a>
        <a href="${base}/contact" class="btn btn-ghost">${en ? 'Book now' : 'Plan nu'}</a>
      </div>
      <p class="lead">${en ? 'From emergency transport to funeral transport: one phone number, the same vehicles and the same drivers for every ride.' : 'Van spoedvervoer tot uitvaartvervoer: één telefoonnummer, dezelfde bussen en dezelfde chauffeurs voor elke rit.'}</p>
    </div>
  </div>
</header>

<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Choose your service' : 'Kies uw dienst'}</span>
      <h2>${en ? 'Wheelchair transport for' : 'Rolstoelvervoer voor'} <span class="serif-i">${en ? 'every occasion' : 'elke gelegenheid'}</span></h2>
      <p>${en ? 'Every ride is driven with a wheelchair-accessible vehicle with an electric ramp and an experienced driver. Choose the service that best fits your ride, or call and we\'ll think it through with you.' : 'Alle ritten worden gereden met een rolstoelbus met elektrische laadklep en een ervaren chauffeur. Kies de dienst die het best bij uw rit past, of bel en wij denken mee.'}</p>
    </div>
    <div class="grid-4">
      ${SERVICES.map((s, i) => { const d = en ? s.en : s; return `<a href="${base}/diensten/${s.slug}" class="card reveal reveal-d${i % 4}">
        <span class="icon-badge${s.icon === 'wheelchair' ? ' is-logo' : ''}">${s.icon === 'wheelchair' ? '<img src="/img/logo-icoon.png" alt="" width="26" height="25" aria-hidden="true">' : ICONS[s.icon]}</span>
        <h3>${d.h1}</h3>
        <p>${truncate(d.lead, 110)}</p>
      </a>`; }).join('\n      ')}
    </div>
  </div>
</section>

<section class="band-2">
  <div class="wrap long reveal">
    <h2>${en ? 'One partner for emergency and planned transport' : 'Eén partij voor spoed en gepland vervoer'}</h2>
    <p>${en ? `${SITE.name} is the emergency branch of ${SITE.parentBrand}. That means you can turn to the same partner for every situation: a last-minute emergency ride, a regular ride to day care, a flight from Schiphol, or a farewell you want to attend. The vehicle, the driver and the way of working are always the same: calm, careful, with the price agreed beforehand.` : 'Rolstoeltaxi Spoed is de spoedtak van Rolstoeltaxi Holland. Dat betekent dat u voor elke situatie bij dezelfde partij terechtkunt: een spoedrit op het laatste moment, een vaste rit naar dagbesteding, een vlucht vanaf Schiphol of een afscheid dat u wilt bijwonen. De bus, de chauffeur en de manier van werken zijn steeds hetzelfde: rustig, zorgvuldig en met de prijs vooraf.'}</p>
    <p>${en ? `Want to know where we drive? Take a look at the ` : 'Wilt u weten in welke plaatsen we rijden? Bekijk dan de '}<a href="${base}/locaties" style="color:var(--accent)">${en ? 'overview page with all locations' : 'overzichtspagina met alle locaties'}</a>${en ? `, or read the ` : ', of lees eerst de '}<a href="${base}/tarieven" style="color:var(--accent)">${en ? 'rates page' : 'tarievenpagina'}</a>${en ? ' first for how the price is built up.' : ' voor de opbouw van de prijs.'}</p>
  </div>
</section>

<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get help right away' : 'Direct geholpen worden'}</span>
    <h2 class="reveal reveal-d1">${en ? 'Not sure which service?' : 'Niet zeker welke dienst?'} <span class="serif-i">${en ? 'Feel free to call.' : 'Bel gerust.'}</span></h2>
    <p class="reveal reveal-d2">${en ? "We're happy to think it through with you and name the price beforehand." : 'We denken graag met u mee en noemen de prijs vooraf.'}</p>
    <div class="reveal reveal-d3"><a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a></div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a></p>
  </div>
</section>`;
}

const REGION_ORDER = [
  ['Amsterdam en omgeving', 'Amsterdam, Schiphol en de plaatsen rondom de hoofdstad.'],
  ['Kennemerland en Noord-Holland', 'Van de kust bij Zandvoort tot Alkmaar en de Zaanstreek.'],
  ['Zuid-Holland en Utrecht', 'De grote steden in het westen en midden van het land.'],
  ['Rest van Nederland', 'Ritten naar en vanuit de rest van Nederland.'],
];
const REGION_ORDER_EN = [
  'Amsterdam and surroundings, and the towns around the capital.',
  'Kennemerland and North Holland: from the coast at Zandvoort to Alkmaar and the Zaan region.',
  'South Holland and Utrecht: the major cities in the west and centre of the country.',
  'Rides to and from the rest of the Netherlands.',
];
const REGION_LABELS_EN = ['Amsterdam and surroundings', 'Kennemerland and North Holland', 'South Holland and Utrecht', 'Rest of the Netherlands'];

function buildLocatiesHub(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<header class="page-hero has-photo" style="background-image:url('/img/rolstoelbus-rai-amsterdam.jpg');background-position:center 45%">
  <div class="wrap">
    <div class="hero-box reveal">
      ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Locations' : 'Locaties' }])}
      <span class="eyebrow">${en ? 'Locations' : 'Locaties'}</span>
      <h1>${en ? 'Wheelchair taxi in' : 'Rolstoeltaxi in'} <span class="serif-i">${CITIES.length} ${en ? 'locations' : 'locaties'}</span></h1>
      <div class="proof"><span><b>24/7</b> ${en ? 'available' : 'bereikbaar'}</span><span><b>10+</b> ${en ? 'years experience' : 'jaar ervaring'}</span><span><b>5000+</b> ${en ? 'rides' : 'ritten'}</span></div>
      <div class="hero-cta hero-cta-main">
        <a href="tel:${SITE.phoneTel}" class="btn btn-yellow" data-cta="primary">${en ? 'Call now' : 'Bel direct'}</a>
        <a href="${base}/contact" class="btn btn-ghost">${en ? 'Book now' : 'Plan nu'}</a>
      </div>
      <p class="lead">${en ? "Choose your town and see where we pick you up, which rides we drive most often and how to arrange an emergency ride. Not on the list? Call us, we're happy to discuss the options." : 'Kies uw plaats en zie waar we u ophalen, welke ritten we vaak rijden en hoe u spoed regelt. Staat uw plaats er niet bij? Bel gerust, we bespreken de mogelijkheden.'}</p>
    </div>
  </div>
</header>

<section style="padding-top:60px">
  <div class="wrap">
    ${REGION_ORDER.map(([region, blurb], ri) => `<div class="hub-group">
      <h2 class="reveal">${en ? REGION_LABELS_EN[ri] : region}</h2>
      <p class="reveal">${en ? REGION_ORDER_EN[ri] : blurb}</p>
      <div class="grid-4">
        ${CITIES.filter(c => c.region === region).map((c, i) => { const cd = en ? c.en : c; const cname = en ? (c.en.name || c.name) : c.name; return `<a href="${base}${cityPath(c)}" class="card reveal reveal-d${i % 4}">
          <h3>${cname}</h3>
          <p>${truncate(cd.lead, 100)}</p>
        </a>`; }).join('\n        ')}
      </div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get help right away' : 'Direct geholpen worden'}</span>
    <h2 class="reveal reveal-d1">${en ? "Can't find your town?" : 'Uw plaats niet gevonden?'} <span class="serif-i">${en ? 'Feel free to call.' : 'Bel gerust.'}</span></h2>
    <p class="reveal reveal-d2">${en ? "We drive throughout the Netherlands and are happy to discuss the options for your ride. Also take a look at our " : 'We rijden in Nederland en bespreken graag de mogelijkheden voor uw rit. Bekijk ook onze '}<a href="${base}/diensten" style="color:var(--accent-2)">${en ? 'services' : 'diensten'}</a>.</p>
    <div class="reveal reveal-d3"><a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a></div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a></p>
  </div>
</section>`;
}

/* ============================== HOME PAGE ============================== */

function homeLd(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "${SITE.name}",
  "description": "${en ? `Emergency branch of ${SITE.parentBrand}: wheelchair transport in the Netherlands, reachable 24 hours a day for emergency rides, hospital transport and airport transport.` : `Spoedtak van ${SITE.parentBrand}: rolstoelvervoer in Nederland, 24 uur per dag bereikbaar voor spoedritten, ziekenhuisvervoer en luchthavenvervoer.`}",
  "url": "${SITE.domain}${base}/",
  "telephone": "${SITE.phoneTel}",
  "email": "${SITE.email}",
  "image": "${SITE.domain}/img/logo-icoon.png",
  "areaServed": "${en ? 'Netherlands' : 'Nederland'}",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${en ? `{"@type":"Question","name":"What is the difference between ${SITE.name} and regular wheelchair transport?","acceptedAnswer":{"@type":"Answer","text":"${SITE.name} focuses on rides that couldn't be planned in advance: an emergency admission, a last-minute appointment, or transport that needs to be arranged today. For pre-planned, recurring rides you can just call us as well."}},
    {"@type":"Question","name":"Is ${SITE.name} the same company as ${SITE.parentBrand}?","acceptedAnswer":{"@type":"Answer","text":"${SITE.name} is the emergency branch of ${SITE.parentBrand}: the same experienced drivers and the same wheelchair-accessible vehicles, specially set up to switch quickly."}},
    {"@type":"Question","name":"Do you also drive at night and on weekends?","acceptedAnswer":{"@type":"Answer","text":"Yes, we are reachable 24 hours a day, 7 days a week for emergency rides."}},
    {"@type":"Question","name":"In which regions does ${SITE.name} operate?","acceptedAnswer":{"@type":"Answer","text":"We drive throughout the Netherlands, with extra rides in and around Amsterdam, Rotterdam, The Hague, Utrecht, Amersfoort and Hilversum."}}`
    : `{"@type":"Question","name":"Wat is het verschil tussen Rolstoeltaxi Spoed en regulier rolstoelvervoer?","acceptedAnswer":{"@type":"Answer","text":"Rolstoeltaxi Spoed is gericht op ritten die niet vooraf gepland konden worden: een spoedopname, een last-minute afspraak of vervoer dat vandaag nog geregeld moet zijn. Voor vooraf geplande, terugkerende ritten kunt u ons ook gewoon bellen."}},
    {"@type":"Question","name":"Is Rolstoeltaxi Spoed hetzelfde bedrijf als Rolstoeltaxi Holland?","acceptedAnswer":{"@type":"Answer","text":"Rolstoeltaxi Spoed is de spoedtak van Rolstoeltaxi Holland: dezelfde ervaren chauffeurs en dezelfde rolstoelbussen, speciaal ingericht op snel schakelen."}},
    {"@type":"Question","name":"Rijden jullie ook 's nachts en in het weekend?","acceptedAnswer":{"@type":"Answer","text":"Ja, we zijn 24 uur per dag, 7 dagen per week bereikbaar voor spoedritten."}},
    {"@type":"Question","name":"In welke regio's rijdt Rolstoeltaxi Spoed?","acceptedAnswer":{"@type":"Answer","text":"We rijden in Nederland, met extra veel ritten in en rond Amsterdam, Rotterdam, Den Haag, Utrecht, Amersfoort en Hilversum."}}`}
  ]
}
</script>`;
}

function buildHomeBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<!-- HERO -->
<header class="hero night" id="homeHero" style="background-image:url('/img/spoedrit-amsterdam-centraal.jpg');background-position:center 55%">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <div class="hero-box reveal">
      <span class="live-badge"><span class="live-dot"></span>${en ? '24/7 emergency line available' : '24/7 spoedlijn bereikbaar'}</span>
      <h1 class="reveal-d1" style="margin-top:16px">${en ? 'Emergency wheelchair transport?' : 'Spoed rolstoelvervoer?'} <span class="serif-i">${en ? 'We come now.' : 'Wij komen nu.'}</span></h1>
      <p class="lead reveal-d2">${en ? "One phone call and a wheelchair-accessible vehicle is ready for you. Fast, safe and calm, throughout the Netherlands." : 'Eén telefoontje en er staat een rolstoelbus voor u klaar. Snel, veilig en rustig, in Nederland.'}</p>
      <div class="hero-cta-main reveal-d2">
        <a href="tel:${SITE.phoneTel}" class="btn btn-yellow">${ICONS.phoneCall}${en ? 'Call now' : 'Bel direct'}</a>
        <a href="${base}/contact" class="btn btn-ghost">${en ? 'Book now' : 'Plan nu'}</a>
      </div>
      <div class="trust reveal-d3">
        <span class="trust-item">${svgCheck()}<b>24/7</b> ${en ? 'available' : 'bereikbaar'}</span>
        <span class="trust-item">${svgCheck()}${en ? 'Active' : 'Actief'} <b>${en ? 'in the Netherlands' : 'in Nederland'}</b></span>
        <span class="trust-item">${svgCheck()}${en ? 'Part of' : 'Onderdeel van'} <b>${SITE.parentBrand}</b></span>
      </div>
    </div>
  </div>
</header>

<!-- STAT BAND -->
<section class="stat-band" style="padding:0">
  <div class="wrap" style="padding:0">
    <div class="stat-row reveal">
      <div class="stat-col"><div class="num">24/7</div><h3>${en ? 'Available' : 'Bereikbaar'}</h3><p>${en ? 'Also at night and on weekends for emergency rides.' : "Ook 's nachts en in het weekend voor spoedritten."}</p></div>
      <div class="stat-col"><div class="num">10+</div><h3>${en ? 'Years experience' : 'Jaar ervaring'}</h3><p>${en ? `Via ${SITE.parentBrand}, specialist in wheelchair transport.` : `Via ${SITE.parentBrand}, specialist in rolstoelvervoer.`}</p></div>
      <div class="stat-col"><div class="num">5000+</div><h3>${en ? 'Rides completed' : 'Uitgevoerde ritten'}</h3><p>${en ? `Under the ${SITE.parentBrand} flag.` : `Onder de vlag van ${SITE.parentBrand}.`}</p></div>
      <div class="stat-col"><div class="num">100%</div><h3>${en ? 'Door to door' : 'Deur tot deur'}</h3><p>${en ? 'Picked up at your front door, guided to the vehicle and brought right to your destination.' : 'Opgehaald bij uw voordeur, begeleid naar de bus en gebracht tot bij uw bestemming.'}</p></div>
    </div>
  </div>
</section>

<!-- MARQUEE -->
${marqueeBand(en)}

<!-- CALL BANNER -->
${callBanner(en)}

<!-- HOE STAPT U IN -->
<section class="instap-section">
  <div class="wrap">
    <div class="split" style="align-items:center">
      <div class="reveal">
        <span class="eyebrow">${en ? 'Safety' : 'Veiligheid'}</span>
        <h2>${en ? 'How does boarding' : 'Hoe stapt u'} <span class="serif-i">${en ? 'work?' : 'in?'}</span></h2>
        <p style="color:var(--ink-dim);margin:12px 0 18px;max-width:44ch">${en ? "Always the same steps, calm and at your own pace, until everything is secure." : 'Altijd dezelfde stappen, rustig en op uw tempo, tot alles vastzit.'}</p>
        <ul class="mini-steps instap-steps">
          ${en ? `<li><span class="n">1.</span><div><b>Wheelchair drives into the vehicle</b></div></li>
          <li><span class="n">2.</span><div><b>Wheelchair placed in the correct position</b></div></li>
          <li><span class="n">3.</span><div><b>Four straps attached to the wheelchair</b></div></li>
          <li><span class="n">4.</span><div><b>Straps secured and tightened to the floor</b></div></li>
          <li><span class="n">5.</span><div><b>Seatbelt fastened around the passenger</b></div></li>
          <li><span class="n">6.</span><div><b>Final check of wheelchair and belt</b></div></li>
          <li><span class="n">7.</span><div><b>Ready to depart</b></div></li>`
          : `<li><span class="n">1.</span><div><b>Rolstoel de bus in rijden</b></div></li>
          <li><span class="n">2.</span><div><b>Rolstoel op de juiste positie plaatsen</b></div></li>
          <li><span class="n">3.</span><div><b>Vier spanbanden aan de rolstoel bevestigen</b></div></li>
          <li><span class="n">4.</span><div><b>Spanbanden aan de vloer vastmaken en aantrekken</b></div></li>
          <li><span class="n">5.</span><div><b>Veiligheidsgordel om de passagier</b></div></li>
          <li><span class="n">6.</span><div><b>Eindcontrole van rolstoel en gordel</b></div></li>
          <li><span class="n">7.</span><div><b>Klaar voor vertrek</b></div></li>`}
        </ul>
      </div>
      <div class="reveal reveal-d1 instap-photos">
        <figure class="photo-card landscape"><img src="/img/instapklep-schiphol.jpg" alt="${en ? 'Wheelchair-accessible vehicle with the ramp deployed, ready for boarding' : 'Rolstoelbus met uitgeklapte laadklep, klaar om in te stappen'}" width="1000" height="750" loading="lazy"></figure>
        <figure class="photo-card landscape"><img src="/img/rolstoel-vastgezet-bus.jpg" alt="${en ? 'Wheelchair securely fastened inside the vehicle' : 'Rolstoel veilig vastgezet in de rolstoelbus'}" width="1000" height="750" loading="lazy"></figure>
        <div style="grid-column:1/-1">${videoEmbed('FZnAOHJuVqk', en ? 'Instruction film: securing a wheelchair in the vehicle' : 'Instructiefilm: rolstoel vastzetten in de rolstoelbus')}</div>
      </div>
    </div>
  </div>
</section>

<!-- HERKENBAAR (pain points) -->
<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Sound familiar?' : 'Herkenbaar?'}</span>
      <h2>${en ? 'You just want a vehicle' : 'U wilt gewoon dat er'} <span class="serif-i">${en ? 'right now' : 'nu'}</span>${en ? '' : ' een bus komt'}</h2>
    </div>
    <div class="pain-list">
      ${en ? `<div class="pain-item reveal">
        <div class="pain-emoji">😰</div>
        <div><h3>Discharged today, no transport arranged</h3><p>The hospital calls to say you can go home today, but the regular carrier can't come for three days.</p></div>
      </div>
      <div class="pain-item reveal reveal-d1">
        <div class="pain-emoji">📞</div>
        <div><h3>The regular wheelchair taxi is fully booked</h3><p>You call your usual carrier, but they can't make it on time. Meanwhile the clock keeps ticking.</p></div>
      </div>
      <div class="pain-item reveal reveal-d2">
        <div class="pain-emoji">✈️</div>
        <div><h3>Flight rebooked, transport has to shift too</h3><p>A changed departure time also means a different time for the ride to the airport.</p></div>
      </div>
      <div class="pain-item reveal reveal-d3">
        <div class="pain-emoji">🌙</div>
        <div><h3>Of course it happens in the evening or on a weekend</h3><p>Emergencies don't care about office hours. Neither do we.</p></div>
      </div>`
      : `<div class="pain-item reveal">
        <div class="pain-emoji">😰</div>
        <div><h3>Vandaag ontslagen, geen vervoer geregeld</h3><p>Het ziekenhuis belt dat u vandaag nog naar huis mag, maar de vaste vervoerder kan pas over drie dagen.</p></div>
      </div>
      <div class="pain-item reveal reveal-d1">
        <div class="pain-emoji">📞</div>
        <div><h3>De reguliere rolstoeltaxi zit vol</h3><p>U belt de vaste vervoerder, maar die kan niet op tijd komen. Ondertussen tikt de klok door.</p></div>
      </div>
      <div class="pain-item reveal reveal-d2">
        <div class="pain-emoji">✈️</div>
        <div><h3>Vlucht omgeboekt, vervoer moet mee schuiven</h3><p>Een gewijzigde vertrektijd betekent ook een ander tijdstip voor het vervoer naar de luchthaven.</p></div>
      </div>
      <div class="pain-item reveal reveal-d3">
        <div class="pain-emoji">🌙</div>
        <div><h3>Het gebeurt natuurlijk 's avonds of in het weekend</h3><p>Spoed houdt geen rekening met kantooruren. Wij ook niet.</p></div>
      </div>`}
    </div>
  </div>
</section>

<!-- STATEMENT BAND -->
<section class="statement night band-line">
  <div class="wrap">
    <p class="big reveal">${en ? 'Most carriers want you to plan at least a day ahead.' : 'De meeste vervoerders willen dat u minstens een dag vooruit plant.'} <span class="serif-i">${en ? "We're here for exactly the moment that isn't possible." : 'Wij zijn er juist voor het moment dat dat niet kan.'}</span></p>
  </div>
</section>

<!-- MARQUEE -->
${marqueeBand(en)}

<!-- ONZE BELOFTE -->
<section id="belofte">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Our promise' : 'Onze belofte'}</span>
      <h2>${en ? 'Emergency doesn\'t mean' : 'Spoed betekent niet dat het'} <span class="serif-i">${en ? 'rushed' : 'gehaast'}</span>${en ? '' : ' gaat'}</h2>
      <p>${en ? 'Emergency means we arrange a vehicle quickly. It never means the ride itself feels rushed.' : 'Spoed betekent dat we snel een bus regelen. Niet dat de rit zelf gehaast verloopt.'}</p>
    </div>
    <div class="review-grid">
      <div class="review reveal">
        <span class="icon">${ICONS.mapPin}</span>
        <h3>${en ? 'Door-to-door guidance' : 'Deur tot deur begeleiding'}</h3>
        <p>${en ? "We pick you up at your front door, guide you to the vehicle and bring you right to your destination. Not just the curb: all the way inside." : 'Wij halen u op bij de voordeur, begeleiden u naar de bus en brengen u tot bij uw bestemming. Niet tot de stoep: echt tot binnen.'}</p>
      </div>
      <div class="review reveal reveal-d1">
        <span class="icon">${ICONS.clock}</span>
        <h3>${en ? 'At your pace, never rushed' : 'Op uw tempo, nooit gehaast'}</h3>
        <p>${en ? 'Emergency means we act fast to arrange a vehicle. Once underway, the driver takes it calmly, at your pace, for a safe arrival.' : 'Spoed betekent dat we snel schakelen om een bus te regelen. Eenmaal onderweg rijdt en helpt de chauffeur rustig, op uw tempo, voor een veilige aankomst.'}</p>
      </div>
      <div class="review reveal reveal-d2">
        <span class="icon">${ICONS.heart}</span>
        <h3>${en ? 'Personal care on board' : 'Persoonlijke zorg aan boord'}</h3>
        <p>${en ? "Our drivers are trained in care transport and take the time for real attention, even during an emergency. That little bit extra that isn't a given." : 'Onze chauffeurs zijn getraind in zorgvervoer en nemen de tijd voor aandacht, ook als het spoed is. Net dat beetje extra dat niet vanzelfsprekend is.'}</p>
      </div>
    </div>
  </div>
</section>

<!-- DIENSTEN -->
<section id="diensten" class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Services' : 'Diensten'}</span>
      <h2>${en ? 'Wheelchair transport,' : 'Rolstoelvervoer,'} <span class="serif-i">${en ? 'emergency and planned' : 'spoed en gepland'}</span></h2>
      <p>${en ? `From an urgent hospital ride to a regular weekly appointment: ${SITE.name} arranges it, with the same vehicles and drivers.` : 'Van een acute ziekenhuisrit tot een vaste wekelijkse afspraak: Rolstoeltaxi Spoed regelt het, met dezelfde bussen en chauffeurs.'}</p>
    </div>
    <div class="grid-4">
      ${SERVICES.map((s, i) => { const d = en ? s.en : s; return `<a href="${base}/diensten/${s.slug}" class="card reveal reveal-d${i}">
        <span class="icon-badge${s.icon === 'wheelchair' ? ' is-logo' : ''}">${s.icon === 'wheelchair' ? '<img src="/img/logo-icoon.png" alt="" width="26" height="25" aria-hidden="true">' : ICONS[s.icon]}</span>
        <h3>${d.h1}</h3>
        <p>${truncate(d.lead, 65)}</p>
      </a>`; }).join('\n      ')}
    </div>
  </div>
</section>

<!-- WAAROM WIJ -->
<section id="waarom-wij">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Why us' : 'Waarom wij'}</span>
      <h2>${en ? 'Why people choose' : 'Waarom mensen voor'} <span class="serif-i">${SITE.name}</span>${en ? '' : ' kiezen'}</h2>
      <p>${en ? 'Everyone makes nice promises. This is what we do differently.' : 'Mooie beloftes maakt iedereen. Dit is wat wij anders doen.'}</p>
    </div>
    <div class="icon-list">
      <div class="icon-list-item reveal">
        <span class="icon-badge-solid">${ICONS.phoneCall}</span>
        <div><h3>${en ? 'Direct phone contact' : 'Direct telefonisch contact'}</h3><p>${en ? "No menu options or call centre: you speak straight away with someone who can schedule the ride." : 'Geen keuzemenu of callcenter: u spreekt meteen iemand die de rit kan inplannen.'}</p></div>
      </div>
      <div class="icon-list-item reveal reveal-d1">
        <span class="icon-badge-solid">${ICONS.clock}</span>
        <div><h3>24/7 ${en ? 'available' : 'bereikbaar'}</h3><p>${en ? "Emergencies don't care about office hours, and neither do we." : 'Spoed houdt geen rekening met kantooruren, en wij dus ook niet.'}</p></div>
      </div>
      <div class="icon-list-item reveal reveal-d2">
        <span class="icon-badge-solid">${ICONS.badge}</span>
        <div><h3>${en ? '10+ years of experience in wheelchair transport' : '10+ jaar ervaring in rolstoelvervoer'}</h3><p>${en ? `Via ${SITE.parentBrand} we build on extensive experience in safe care transport.` : `Via ${SITE.parentBrand} bouwen we voort op ruime ervaring in veilig zorgvervoer.`}</p></div>
      </div>
      <div class="icon-list-item reveal reveal-d3">
        <span class="icon-badge-solid">${ICONS.mapPin}</span>
        <div><h3>${en ? 'Active in the Netherlands' : 'Actief in Nederland'}</h3><p>${en ? 'From Amsterdam to Rotterdam and beyond: rides outside our own region are possible too.' : 'Van Amsterdam tot Rotterdam en daarbuiten: ook ritten buiten de eigen regio zijn mogelijk.'}</p></div>
      </div>
    </div>
  </div>
</section>

<!-- WERKWIJZE -->
<section id="werkwijze" class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'How it works' : 'Werkwijze'}</span>
      <h2>${en ? 'From phone call to ride,' : 'Van telefoontje tot rit,'} <span class="serif-i">${en ? 'in three steps' : 'in drie stappen'}</span></h2>
    </div>
    <div class="steps-stack">
      ${en ? `<div class="step-row reveal">
        <div class="big">01</div>
        <div><h3>Call or message the emergency line</h3><p>Briefly tell us the situation, the location and where you need to go.</p></div>
      </div>
      <div class="step-row reveal reveal-d1">
        <div class="big">02</div>
        <div><h3>We schedule a vehicle right away</h3><p>We find the nearest available vehicle and name the price beforehand.</p></div>
      </div>
      <div class="step-row reveal reveal-d2">
        <div class="big">03</div>
        <div><h3>Safely and calmly transported</h3><p>The driver helps with boarding and getting off, and secures everything safely.</p></div>
      </div>`
      : `<div class="step-row reveal">
        <div class="big">01</div>
        <div><h3>Bel of app de spoedlijn</h3><p>Vertel kort de situatie, de locatie en waar u naartoe moet.</p></div>
      </div>
      <div class="step-row reveal reveal-d1">
        <div class="big">02</div>
        <div><h3>Wij plannen direct een bus in</h3><p>We zoeken de dichtstbijzijnde beschikbare rolstoelbus en noemen de prijs vooraf.</p></div>
      </div>
      <div class="step-row reveal reveal-d2">
        <div class="big">03</div>
        <div><h3>Veilig en rustig vervoerd</h3><p>De chauffeur helpt bij het in- en uitstappen en zet alles veilig vast.</p></div>
      </div>`}
    </div>
  </div>
</section>

<!-- ONZE BUSSEN -->
<section id="ritten" style="padding-top:0">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'On the road' : 'Onderweg'}</span>
      <h2>${en ? 'Our vehicles' : 'Onze bussen'} <span class="serif-i">${en ? 'in action' : 'in actie'}</span></h2>
      <p>${en ? "Real rides, real places: from Amsterdam's canals to a nearby estate." : 'Echte ritten, echte plekken: van de Amsterdamse grachten tot een landgoed in de buurt.'}</p>
    </div>
    <div class="gallery">
      <figure class="photo-card tall reveal"><img src="/img/interieur-rolstoelbus.jpg" alt="${en ? 'Interior of the wheelchair-accessible vehicle with wheelchair space and ramp' : 'Interieur van de rolstoelbus met rolstoelplaats en laadklep'}" width="960" height="1280" loading="lazy"></figure>
      <figure class="photo-card reveal reveal-d1"><img src="/img/rolstoel-rood-instappen-schiphol.jpg" alt="${en ? 'Passenger in a red wheelchair boarding via the deployed ramp' : 'Passagier in een rode rolstoel stapt in via de uitgeklapte laadklep'}" width="1050" height="1400" loading="lazy"></figure>
      <figure class="photo-card reveal reveal-d2"><img src="/img/rolstoelbus-baksteen-laadklep.jpg" alt="${en ? 'Wheelchair-accessible vehicle with ramp in front of a red-brick building' : 'Rolstoelbus met laadklep voor een gebouw van rode baksteen'}" width="1280" height="960" loading="lazy"></figure>
      <figure class="photo-card reveal reveal-d1"><img src="/img/scootmobiel-blauw-overkapping.jpg" alt="${en ? 'Mobility scooter boarding via the deployed ramp, under a covered entrance' : 'Scootmobiel stapt in via de uitgeklapte laadklep, onder een overkapping'}" width="1050" height="1400" loading="lazy"></figure>
      <figure class="photo-card reveal reveal-d2"><img src="/img/rolstoelbus-laadklep-schiphol-vertrek.jpg" alt="${en ? 'Wheelchair-accessible vehicle with the ramp deployed at the departures curb' : 'Rolstoelbus met uitgeklapte laadklep bij vertrekhal'}" width="1280" height="960" loading="lazy"></figure>
      <figure class="photo-card reveal reveal-d1"><img src="/img/amsterdam-gracht-laadklep.jpg" alt="${en ? 'Wheelchair-accessible vehicle with ramp by an Amsterdam canal' : 'Rolstoelbus met laadklep bij een Amsterdamse gracht'}" width="1280" height="960" loading="lazy"></figure>
    </div>
  </div>
</section>

<!-- WERKGEBIED -->
<section id="werkgebied" class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Service area' : 'Werkgebied'}</span>
      <h2>${en ? 'We drive' : 'Wij rijden'} <span class="serif-i">${en ? 'throughout the Netherlands' : 'in Nederland'}</span></h2>
      <p>${en ? "With extra rides in and around the major cities. Not on the list? Call us, we're happy to discuss the options." : 'Met extra veel ritten in en rond de grote steden. Staat uw plaats er niet bij? Bel gerust, dan bespreken we de mogelijkheden.'}</p>
    </div>
    <div class="area-list reveal">
      ${CITIES.filter(c => !c.isService).map(c => `<a href="${base}${cityPath(c)}">${c.name}</a>`).join('\n      ')}
      <a href="${base}/locaties"><b>${en ? 'All locations' : 'Alle locaties'}</b></a>
    </div>
  </div>
</section>

<!-- MARQUEE -->
${marqueeBand(en)}

<!-- OVER ONS -->
<section id="over-ons">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-photo reveal" style="background:none;padding:0">
        <img src="/img/rolstoelbus-amsterdam-gracht-diagonaal.jpg" alt="${en ? `${SITE.name} wheelchair-accessible vehicle, ramp deployed, photographed diagonally from behind` : 'Rolstoelbus van Rolstoeltaxi Spoed, met uitgeklapte laadklep, diagonaal van achteren gefotografeerd'}" width="1600" height="1200" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">
      </div>
      <div class="about-copy">
        <span class="eyebrow reveal">${en ? 'Who we are' : 'Wie zijn wij'}</span>
        <h2 class="reveal reveal-d1">${en ? 'The emergency branch of' : 'De spoedtak van'} <span class="serif-i">${SITE.parentBrand}</span></h2>
        <p class="reveal reveal-d2">${en ? `${SITE.name} was set up by ${SITE.parentBrand}, a specialist in wheelchair transport in the Netherlands. The same experienced drivers and the same fully equipped vehicles, but specially arranged for rides that couldn't wait.` : `Rolstoeltaxi Spoed is opgezet door ${SITE.parentBrand}, specialist in rolstoelvervoer in Nederland. Dezelfde ervaren chauffeurs en dezelfde volledig uitgeruste rolstoelbussen, maar dan speciaal ingericht op ritten die niet konden wachten.`}</p>
        <p class="reveal reveal-d2">${en ? "From an urgent hospital ride to a rebooked flight: we switch quickly, without giving up on safety or comfort." : 'Van een acute ziekenhuisrit tot een omgeboekte vlucht: we schakelen snel, zonder in te leveren op veiligheid of comfort.'}</p>
        <ul class="usp-list reveal reveal-d3">
          <li><div><b>${en ? '10+ years experience' : '10+ jaar ervaring'}</b><span>${en ? `Via ${SITE.parentBrand} in safe and professional wheelchair transport.` : `Via ${SITE.parentBrand} in veilig en professioneel rolstoelvervoer.`}</span></div></li>
          <li><div><b>24/7 ${en ? 'available' : 'bereikbaar'}</b><span>${en ? "Emergencies don't care about office hours." : 'Spoed houdt geen rekening met kantooruren.'}</span></div></li>
          <li><div><b>${en ? 'Active in the Netherlands' : 'Actief in Nederland'}</b><span>${en ? 'Rides outside our own region are possible too.' : 'Ook ritten buiten de eigen regio zijn mogelijk.'}</span></div></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- EERLIJK VERHAAL -->
<section id="vertrouwen" class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Honest story' : 'Eerlijk verhaal'}</span>
      <h2>${en ? 'New as an' : 'Nieuw als'} <span class="serif-i">${en ? 'emergency brand' : 'spoedmerk'}</span>${en ? ', not new to the trade' : ', niet nieuw in het vak'}</h2>
      <p>${en ? `${SITE.name} is a new name. The experience behind it isn't.` : 'Rolstoeltaxi Spoed is een nieuwe naam. De ervaring erachter niet.'}</p>
    </div>
    <div class="review-grid">
      <div class="review reveal">
        <span class="icon">${ICONS.badge}</span>
        <h3>${en ? 'Part of' : 'Onderdeel van'} ${SITE.parentBrand}</h3>
        <p>${en ? 'The same drivers, the same vehicles, the same experience. Only faster to reach for emergencies.' : 'Dezelfde chauffeurs, dezelfde rolstoelbussen, dezelfde ervaring. Alleen sneller te bereiken bij spoed.'}</p>
      </div>
      <div class="review reveal reveal-d1">
        <span class="icon">${ICONS.checkCircle}</span>
        <h3>${en ? 'Price always named beforehand' : 'Prijs altijd vooraf genoemd'}</h3>
        <p>${en ? "Even for an emergency ride, you hear the price on the phone before we set off." : 'Ook bij een spoedrit hoort u de prijs aan de telefoon, voordat we onderweg zijn.'}</p>
      </div>
      <div class="review reveal reveal-d2">
        <span class="icon">${ICONS.mapPin}</span>
        <h3>${en ? 'Reference on request' : 'Referentie op aanvraag'}</h3>
        <p>${en ? `Would you rather first speak to someone at ${SITE.parentBrand} who's been helped before? Feel free to ask.` : `Liever eerst iemand van ${SITE.parentBrand} spreken die eerder geholpen is? Vraag er gerust naar.`}</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Frequently asked questions' : 'Veelgestelde vragen'}</span>
      <h2>${en ? 'Good to' : 'Goed om te'} <span class="serif-i">${en ? 'know' : 'weten'}</span></h2>
    </div>
    <div class="faq-list">
      ${en ? `<div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">What is the difference between ${SITE.name} and regular wheelchair transport?</button>
        <div class="faq-a"><p>${SITE.name} focuses on rides that couldn't be planned in advance: an emergency admission, a last-minute appointment, or transport that needs to be arranged today. For pre-planned, recurring rides you can just call us as well.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">Is ${SITE.name} the same company as ${SITE.parentBrand}?</button>
        <div class="faq-a"><p>${SITE.name} is the emergency branch of ${SITE.parentBrand}: the same experienced drivers and the same wheelchair-accessible vehicles, specially set up to switch quickly.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">Do you also drive at night and on weekends?</button>
        <div class="faq-a"><p>Yes, we are reachable 24 hours a day, 7 days a week for emergency rides.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">In which regions does ${SITE.name} operate?</button>
        <div class="faq-a"><p>We drive throughout the Netherlands, with extra rides in and around Amsterdam, Rotterdam, The Hague, Utrecht, Amersfoort and Hilversum. Also see our <a href="${base}/veelgestelde-vragen" style="color:var(--accent)">full FAQ page</a>.</p></div>
      </div>`
      : `<div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">Wat is het verschil tussen Rolstoeltaxi Spoed en regulier rolstoelvervoer?</button>
        <div class="faq-a"><p>Rolstoeltaxi Spoed is gericht op ritten die niet vooraf gepland konden worden: een spoedopname, een last-minute afspraak of vervoer dat vandaag nog geregeld moet zijn. Voor vooraf geplande, terugkerende ritten kunt u ons ook gewoon bellen.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">Is Rolstoeltaxi Spoed hetzelfde bedrijf als Rolstoeltaxi Holland?</button>
        <div class="faq-a"><p>Rolstoeltaxi Spoed is de spoedtak van Rolstoeltaxi Holland: dezelfde ervaren chauffeurs en dezelfde rolstoelbussen, speciaal ingericht op snel schakelen.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">Rijden jullie ook 's nachts en in het weekend?</button>
        <div class="faq-a"><p>Ja, we zijn 24 uur per dag, 7 dagen per week bereikbaar voor spoedritten.</p></div>
      </div>
      <div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">In welke regio's rijdt Rolstoeltaxi Spoed?</button>
        <div class="faq-a"><p>We rijden in Nederland, met extra veel ritten in en rond Amsterdam, Rotterdam, Den Haag, Utrecht, Amersfoort en Hilversum. Bekijk ook onze <a href="${base}/veelgestelde-vragen" style="color:var(--accent)">volledige FAQ-pagina</a>.</p></div>
      </div>`}
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get help right away' : 'Direct geholpen worden'}</span>
    <h2 class="reveal reveal-d1">${en ? 'Need emergency' : 'Spoedvervoer'} <span class="serif-i">${en ? 'transport?' : 'nodig?'}</span></h2>
    <p class="reveal reveal-d2">${en ? "Call now for an emergency, or book a ride online for later. You'll know where you stand beforehand." : 'Bel direct voor spoed, of plan online een rit voor later. U weet vooraf waar u aan toe bent.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a> · ${en ? 'also via' : 'ook per'} <a href="https://wa.me/${SITE.whatsapp}" style="color:var(--accent-2)">WhatsApp</a></p>
  </div>
</section>`;
}

/* ============================== CONTACT / BOOKING PAGE ============================== */

function contactLd(locale = 'nl') {
  const en = locale === 'en';
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TaxiService",
  "name": "${SITE.name}",
  "telephone": "${SITE.phoneTel}",
  "areaServed": "${en ? 'Netherlands' : 'Nederland'}"
}
</script>`;
}

function buildContactBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<!-- PAGE HERO -->
<header class="page-hero" style="padding-bottom:40px">
  <div class="wrap">
    ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: 'Contact' }])}
    <span class="eyebrow reveal">${en ? 'Book directly' : 'Direct reserveren'}</span>
    <h1 class="reveal reveal-d1">${en ? 'Plan your' : 'Plan uw'} <span class="serif-i">${en ? 'ride' : 'rit'}</span></h1>
    <p class="lead reveal reveal-d2">${en ? "For an emergency, it's best to call us directly. For a planned ride, fill in the form below and we'll contact you quickly to confirm the ride and the price." : 'Bij spoed belt u ons liever direct. Voor een geplande rit vult u hieronder het formulier in, dan nemen we snel contact op om de rit en de prijs te bevestigen.'}</p>
    <div class="hero-cta reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn btn-yellow" data-cta="primary">${en ? 'Emergency? Call' : 'Spoed? Bel'} ${SITE.phoneDisplay}</a>
    </div>
  </div>
</header>

<!-- BOOKING -->
<section class="booking" id="formulier">
  <div class="wrap">
    <div class="booking-grid">

      <!-- FORM -->
      <div class="form-card reveal">
        <form id="bookingForm" novalidate>
          <input type="checkbox" name="botcheck" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

          <fieldset class="fs">
            <legend><span class="fs-n">1</span> ${en ? 'Your details' : 'Uw gegevens'}</legend>
            <div class="form-row">
              <div class="field">
                <label for="naam">${en ? 'Name' : 'Naam'}</label>
                <input type="text" id="naam" name="Naam" placeholder="${en ? 'First and last name' : 'Voor- en achternaam'}" required autocomplete="name">
              </div>
              <div class="field">
                <label for="telefoon">${en ? 'Phone number' : 'Telefoonnummer'}</label>
                <input type="tel" id="telefoon" name="Telefoon" placeholder="06 12345678" required autocomplete="tel" inputmode="tel">
              </div>
            </div>
            <div class="field">
              <label for="email">${en ? 'Email address' : 'E-mailadres'} <span class="opt">${en ? '(for the confirmation, optional)' : '(voor de bevestiging, optioneel)'}</span></label>
              <input type="email" id="email" name="E-mail" placeholder="${en ? 'name@example.com' : 'naam@voorbeeld.nl'}" autocomplete="email">
            </div>
          </fieldset>

          <fieldset class="fs">
            <legend><span class="fs-n">2</span> ${en ? 'The ride' : 'De rit'}</legend>
            <div class="field">
              <label for="type">${en ? 'Type of ride' : 'Soort rit'}</label>
              <select id="type" name="Soort rit" required>
                <option value="" disabled selected>${en ? 'Make a choice' : 'Maak een keuze'}</option>
                <option>${en ? 'Emergency ride, as soon as possible' : 'Spoedrit, zo snel mogelijk'}</option>
                ${SERVICES.map(s => `<option>${(en ? s.en : s).nav}</option>`).join('\n                ')}
                <option>${en ? 'Something else' : 'Iets anders'}</option>
              </select>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="ophaal">${en ? 'Pickup address' : 'Ophaaladres'}</label>
                <input type="text" id="ophaal" name="Ophaaladres" placeholder="${en ? 'Street, number, city' : 'Straat, huisnummer, plaats'}" required autocomplete="street-address">
              </div>
              <div class="field">
                <label for="bestemming">${en ? 'Destination' : 'Bestemming'}</label>
                <input type="text" id="bestemming" name="Bestemming" placeholder="${en ? 'Address or facility, city' : 'Adres of instelling, plaats'}" required>
              </div>
            </div>

            <div class="field">
              <span class="lbl">${en ? 'When does the ride need to take place?' : 'Wanneer moet de rit plaatsvinden?'}</span>
              <div class="seg" role="radiogroup" aria-label="${en ? 'When' : 'Wanneer'}">
                <label class="seg-opt"><input type="radio" name="Moment" value="Zo snel mogelijk (spoed)" checked><span><b>${en ? 'As soon as possible' : 'Zo snel mogelijk'}</b><small>${en ? 'Emergency, schedule right away' : 'Spoed, direct inplannen'}</small></span></label>
                <label class="seg-opt"><input type="radio" name="Moment" value="Op een afgesproken moment"><span><b>${en ? 'At an agreed time' : 'Op een afgesproken moment'}</b><small>${en ? 'Choose date and time' : 'Kies datum en tijd'}</small></span></label>
              </div>
            </div>
            <div class="form-row when" id="whenRow" hidden>
              <div class="field">
                <label for="datum">${en ? 'Date' : 'Datum'}</label>
                <input type="date" id="datum" name="Datum">
              </div>
              <div class="field">
                <label for="tijd">${en ? 'Pickup time' : 'Ophaaltijd'}</label>
                <input type="time" id="tijd" name="Ophaaltijd">
              </div>
            </div>

            <label class="check"><input type="checkbox" id="terugrit" name="Terugrit gewenst" value="Ja"><span>${en ? 'I also want to schedule a' : 'Ik wil ook een'} <b>${en ? 'return ride' : 'terugrit'}</b>${en ? '' : ' inplannen'}</span></label>
            <div class="field" id="terugRow" hidden>
              <label for="terugtijd">${en ? 'Preferred time for the return ride' : 'Gewenste tijd terugrit'} <span class="opt">${en ? '(approximate)' : '(bij benadering)'}</span></label>
              <input type="text" id="terugtijd" name="Tijd terugrit" placeholder="${en ? 'E.g. 3:30 PM, or after the appointment' : 'Bijv. 15:30, of na de afspraak'}">
            </div>
          </fieldset>

          <fieldset class="fs">
            <legend><span class="fs-n">3</span> ${en ? 'Passenger and equipment' : 'Reiziger en hulpmiddel'}</legend>
            <div class="form-row">
              <div class="field">
                <label for="hulpmiddel">${en ? 'Mobility equipment' : 'Hulpmiddel'}</label>
                <select id="hulpmiddel" name="Hulpmiddel" required>
                  <option value="" disabled selected>${en ? 'Make a choice' : 'Maak een keuze'}</option>
                  <option>${en ? 'Manual wheelchair' : 'Handbewogen rolstoel'}</option>
                  <option>${en ? 'Electric wheelchair' : 'Elektrische rolstoel'}</option>
                  <option>${en ? 'Mobility scooter' : 'Scootmobiel'}</option>
                  <option>${en ? 'Folding wheelchair' : 'Opvouwbare rolstoel'}</option>
                  <option>${en ? 'None, just a companion' : 'Geen, alleen een begeleider'}</option>
                  <option>${en ? 'Not sure' : 'Weet ik niet zeker'}</option>
                </select>
              </div>
              <div class="field">
                <label for="personen">${en ? 'Number of passengers' : 'Aantal reizigers'}</label>
                <select id="personen" name="Aantal reizigers">
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>${en ? '5 or more' : '5 of meer'}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label for="bericht">${en ? 'Note' : 'Opmerking'} <span class="opt">${en ? '(optional)' : '(optioneel)'}</span></label>
              <textarea id="bericht" name="Opmerking" placeholder="${en ? 'E.g. luggage, IV or oxygen, stairs or a step at the door, contact person.' : 'Bijv. bagage, infuus of zuurstof, trap of drempel bij de deur, contactpersoon.'}"></textarea>
            </div>
          </fieldset>

          <label class="check consent"><input type="checkbox" id="akkoord" required><span>${en ? 'I agree to the' : 'Ik ga akkoord met de'} <a href="${base}/privacyverklaring" target="_blank" rel="noopener">${en ? 'privacy policy' : 'privacyverklaring'}</a>. ${en ? 'My details are only used to contact me about this ride.' : 'Mijn gegevens worden alleen gebruikt om contact op te nemen over deze rit.'}</span></label>

          <button type="submit" class="btn btn-yellow btn-full" id="submitBtn">${en ? 'Send request' : 'Aanvraag versturen'}</button>
          <p class="form-note">${en ? "For emergencies we respond as fast as possible. In a hurry? It's best to call directly:" : 'Bij spoed reageren we zo snel mogelijk. Heeft u haast? Bel liever direct:'} <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a>.</p>
          <p class="form-error" id="formError" role="alert" hidden></p>
        </form>

        <div class="form-success" id="formSuccess" role="status" hidden>
          <div class="ok-badge">${svgCheck()}</div>
          <h3>${en ? 'Thank you, your request has been' : 'Bedankt, uw aanvraag is'} <span class="serif-i">${en ? 'received' : 'ontvangen'}</span></h3>
          <p>${en ? "We'll contact you as soon as possible to confirm the ride and the price. In a hurry? Call directly:" : 'We nemen zo snel mogelijk contact met u op om de rit en de prijs te bevestigen. Heeft u haast, bel dan direct:'}</p>
          <p><a class="btn btn-yellow" href="tel:${SITE.phoneTel}">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a></p>
          <p class="demo-note" id="demoNote" hidden>${en ? "Demo mode: no email address is linked to this form yet, so this request wasn't actually sent." : 'Demo-modus: er is nog geen e-mailadres gekoppeld aan dit formulier, dus deze aanvraag is niet echt verstuurd.'}</p>
        </div>
      </div>

      <!-- SIDEBAR -->
      <aside>
        <div class="aside-card reveal reveal-d1">
          <h3>${en ? 'How it' : 'Hoe het'} <span class="serif-i">${en ? 'works' : 'werkt'}</span></h3>
          <ul class="mini-steps">
            <li><span class="n">1.</span><div><b>${en ? 'You fill in the form' : 'U vult het formulier in'}</b><span>${en ? 'Takes less than two minutes.' : 'Duurt nog geen twee minuten.'}</span></div></li>
            <li><span class="n">2.</span><div><b>${en ? 'We confirm the ride' : 'Wij bevestigen de rit'}</b><span>${en ? 'Including price, before you book for real.' : 'Inclusief prijs, voordat u definitief boekt.'}</span></div></li>
            <li><span class="n">3.</span><div><b>${en ? 'Safely transported' : 'Veilig vervoerd'}</b><span>${en ? 'The driver is ready on time.' : 'De chauffeur staat op tijd klaar.'}</span></div></li>
          </ul>
        </div>
        <div class="aside-card reveal reveal-d2">
          <p class="aside-alt">${en ? "Emergency? It's best to call directly:" : 'Spoed? Bel liever direct:'}<br><a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a><br>${en ? '24/7 available throughout the Netherlands.' : '24/7 bereikbaar in Nederland.'}</p>
        </div>
        <div class="aside-card reveal reveal-d3">
          <p class="aside-alt">${en ? 'Prefer to message?' : 'Liever appen?'}<br><a href="https://wa.me/${SITE.whatsapp}">${ICONS.whatsapp} WhatsApp ${en ? 'us' : 'ons'}</a></p>
        </div>
        <div class="aside-card reveal reveal-d3">
          <p class="aside-alt">${en ? 'Want to know more first?' : 'Eerst meer weten?'}<br><a href="${base}/diensten">${en ? 'View our services' : 'Bekijk onze diensten'}</a><br><a href="${base}/locaties">${en ? 'View all locations' : 'Bekijk alle locaties'}</a></p>
        </div>
      </aside>

    </div>
  </div>
</section>

<script>
(function () {
  var KEY = ${JSON.stringify(SITE.web3formsKey || '')};
  var form = document.getElementById('bookingForm');
  if (!form) return;
  var whenRow = document.getElementById('whenRow');
  var datum = document.getElementById('datum');
  var tijd = document.getElementById('tijd');
  var terug = document.getElementById('terugrit');
  var terugRow = document.getElementById('terugRow');
  var btn = document.getElementById('submitBtn');
  var err = document.getElementById('formError');
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  datum.min = today.toISOString().slice(0, 10);

  function syncWhen() {
    var planned = form.querySelector('input[name="Moment"]:checked').value.indexOf('afgesproken') > -1;
    whenRow.hidden = !planned;
    datum.required = planned; tijd.required = planned;
    if (!planned) { datum.value = ''; tijd.value = ''; }
  }
  form.querySelectorAll('input[name="Moment"]').forEach(function (r) { r.addEventListener('change', syncWhen); });
  terug.addEventListener('change', function () { terugRow.hidden = !terug.checked; });
  syncWhen();

  var q = new URLSearchParams(location.search);
  if (q.get('rit') === 'spoed') document.getElementById('type').selectedIndex = 1;

  function showError(msg) { err.textContent = msg; err.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    if (form.botcheck.checked) return;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      form.reportValidity();
      return;
    }
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'botcheck' && v !== '') data[k] = v; });
    var payload = Object.assign({
      access_key: KEY,
      subject: 'Nieuwe ritaanvraag: ' + (data['Soort rit'] || 'rit') + ' (' + (data['Moment'] || '') + ')',
      from_name: '${SITE.name} website'
    }, data);
    if (data['E-mail']) payload.replyto = data['E-mail'];
    btn.disabled = true; var label = btn.textContent; btn.textContent = '${en ? 'Sending...' : 'Bezig met versturen...'}';

    function done(demo) {
      location.href = '${base}/bedankt' + (demo ? '?demo=1' : '');
    }

    if (!KEY) {
      setTimeout(function () { console.info('${en ? 'Demo: request not sent' : 'Demo: aanvraag niet verstuurd'}', data); done(true); }, 700);
      return;
    }
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.success) done(false); else throw new Error((j && j.message) || 'error');
    }).catch(function () {
      btn.disabled = false; btn.textContent = label;
      showError('${en ? `Sending failed. Please try again or call directly: ${SITE.phoneDisplay}.` : `Versturen is niet gelukt. Probeer het opnieuw of bel direct naar ${SITE.phoneDisplay}.`}');
    });
  });
})();
</script>`;
}

/* ============================== OVER ONS PAGE ============================== */

function buildOverOnsBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<!-- PAGE HERO -->
<header class="page-hero has-photo" style="background-image:url('img/rolstoelbus-voorkant.jpg')">
  <div class="wrap">
    <div class="hero-box reveal">
      ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'About us' : 'Over ons' }])}
      <span class="eyebrow">${en ? 'About us' : 'Over ons'}</span>
      <h1>${en ? 'The emergency branch of' : 'De spoedtak van'} <span class="serif-i">${SITE.parentBrand}</span></h1>
      <p class="lead">${en ? `The same experience and the same vehicles as ${SITE.parentBrand}, specially arranged for rides that couldn't wait.` : `Dezelfde ervaring en dezelfde bussen als ${SITE.parentBrand}, speciaal ingericht op ritten die niet konden wachten.`}</p>
    </div>
  </div>
</header>

<section style="padding-top:20px">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-photo reveal" style="background:none;padding:0">
        <img src="/img/rolstoelbus-zijkant.jpg" alt="${en ? `${SITE.name} wheelchair-accessible vehicle, side view` : 'Rolstoelbus van Rolstoeltaxi Spoed, zijaanzicht'}" width="1600" height="1200" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">
      </div>
      <div class="about-copy">
        <span class="eyebrow reveal">${en ? 'The story' : 'Het verhaal'}</span>
        <h2 class="reveal reveal-d1">${en ? 'Born from a simple' : 'Ontstaan uit een simpele'} <span class="serif-i">${en ? 'need' : 'behoefte'}</span></h2>
        <p class="reveal reveal-d2">${en ? `${SITE.parentBrand} has been transporting people in wheelchairs for more than 10 years, throughout the Netherlands, from hospital rides to day care and private appointments. Along the way, we kept hearing the same question: can transport also come when it really can't wait a few days?` : `${SITE.parentBrand} vervoert al meer dan 10 jaar mensen in een rolstoel, in Nederland, van ziekenhuisritten tot dagbesteding en privéafspraken. Daarbij merkten we telkens dezelfde vraag: kan er ook vervoer komen als het echt niet meer een paar dagen kan wachten?`}</p>
        <p class="reveal reveal-d2">${en ? `${SITE.name} is the answer: the same drivers, the same fully equipped vehicles, but organised around switching quickly instead of planning days ahead.` : 'Rolstoeltaxi Spoed is het antwoord daarop: dezelfde chauffeurs, dezelfde volledig uitgeruste rolstoelbussen, maar dan georganiseerd rond snel schakelen in plaats van dagen vooruit plannen.'}</p>
        <ul class="usp-list reveal reveal-d3">
          <li><div><b>${en ? 'Experienced drivers' : 'Ervaren chauffeurs'}</b><span>${en ? 'Trained in care transport, calm and respectful.' : 'Getraind in zorgvervoer, rustig en respectvol.'}</span></div></li>
          <li><div><b>${en ? 'Own fleet' : 'Eigen wagenpark'}</b><span>${en ? 'Wheelchair-accessible vehicles with an electric ramp, suitable for wheelchairs and mobility scooters.' : 'Rolstoelbussen met elektrische laadklep, geschikt voor rolstoel én scootmobiel.'}</span></div></li>
          <li><div><b>${en ? 'Directly reachable' : 'Direct bereikbaar'}</b><span>${en ? "Call and a ride is scheduled for you right away." : 'Bel en er wordt meteen een rit voor u ingepland.'}</span></div></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="band-2">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Service area' : 'Werkgebied'}</span>
      <h2>${en ? 'We drive' : 'Wij rijden'} <span class="serif-i">${en ? 'throughout the Netherlands' : 'in Nederland'}</span></h2>
    </div>
    <div class="area-list reveal">
      ${TOP_CITIES.map(slug => { const c = cityBySlug(slug); return `<a href="${base}${cityPath(c)}">${c.name}</a>`; }).join('\n      ')}
      <a href="${base}/locaties"><b>${en ? 'All locations' : 'Alle locaties'}</b></a>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Get in touch' : 'Maak kennis'}</span>
    <h2 class="reveal reveal-d1">${en ? 'Give us a' : 'Even'} <span class="serif-i">${en ? 'call?' : 'bellen?'}</span></h2>
    <p class="reveal reveal-d2">${en ? 'Call now for an emergency, or book a ride online for later.' : 'Bel direct voor spoed, of plan online een rit voor later.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent)">${en ? 'book a ride online' : 'plan online een rit'}</a></p>
  </div>
</section>`;
}

/* ============================== TARIEVEN PAGE ============================== */

function buildTarievenBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<!-- PAGE HERO -->
<header class="page-hero" style="padding-bottom:40px">
  <div class="wrap">
    ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Rates' : 'Tarieven' }])}
    <span class="eyebrow reveal">${en ? 'Transparent' : 'Transparant'}</span>
    <h1 class="reveal reveal-d1">${en ? 'Our' : 'Onze'} <span class="serif-i">${en ? 'rates' : 'tarieven'}</span></h1>
    <p class="lead reveal reveal-d2">${en ? "Even for an emergency: you always hear the price on the phone beforehand. No surprises afterwards." : 'Ook bij spoed geldt: u hoort de prijs altijd vooraf aan de telefoon. Geen verrassingen achteraf.'}</p>
  </div>
</header>

<section style="padding-top:0">
  <div class="wrap">
    <div class="grid-4">
      <div class="card reveal">
        <span class="icon-badge">${ICONS.mapPin}</span>
        <h3>${en ? 'Distance & time' : 'Afstand &amp; tijdstip'}</h3>
        <p>${en ? 'The price of the ride is based on the distance to the destination and the time of the ride.' : 'De ritprijs is opgebouwd uit de afstand tot de bestemming en het tijdstip van de rit.'}</p>
      </div>
      <div class="card reveal reveal-d1">
        <span class="icon-badge">${ICONS.bolt}</span>
        <h3>${en ? 'Emergency surcharge' : 'Spoedtoeslag'}</h3>
        <p>${en ? 'A surcharge applies for rides scheduled at very short notice, compared to rides planned in advance.' : 'Voor ritten die op zeer korte termijn worden ingepland geldt een toeslag ten opzichte van vooraf geplande ritten.'}</p>
      </div>
      <div class="card reveal reveal-d2">
        <span class="icon-badge">${ICONS.checkCircle}</span>
        <h3>${en ? 'Named beforehand' : 'Vooraf genoemd'}</h3>
        <p>${en ? "You hear the price on the phone before we set off, even for an emergency." : 'U hoort de prijs aan de telefoon voordat we vertrekken, ook bij spoed.'}</p>
      </div>
      <div class="card reveal reveal-d3">
        <span class="icon-badge">${ICONS.calendarCheck}</span>
        <h3>${en ? 'Planned rides are cheaper' : 'Geplande ritten voordeliger'}</h3>
        <p>${en ? 'Already know the date well in advance? That is often cheaper than an emergency ride.' : 'Weet u de datum al ruim van tevoren? Dan is dat vaak voordeliger dan een spoedrit.'}</p>
      </div>
    </div>
    <p class="reveal" style="margin-top:26px;color:var(--ink-dim);max-width:70ch">${en ? "A companion who rides along and the waiting time during an appointment or ceremony are never charged: that's included in the ride for free." : 'Een begeleider die meereist en de wachttijd tijdens een afspraak of plechtigheid brengen we niet in rekening: dat zit bij ons gratis bij de rit in.'}</p>
  </div>
</section>

<section class="band-2" style="padding:64px 0">
  <div class="wrap">
    <div class="price-box reveal">
      <div>
        <span class="eyebrow">${en ? 'Ask for a quote' : 'Vraag naar een prijsopgave'}</span>
        <h3>${en ? 'Call for an exact price tailored to you' : 'Bel voor een exacte prijs op maat'}</h3>
      </div>
      <p>${en ? "Every ride is different: distance, time, and whether it's an emergency or a planned ride. Call or message us with the details, and we'll name a realistic price right away, before you book." : 'Elke rit is anders: afstand, tijdstip, en of het om spoed of een geplande rit gaat. Bel of app ons met de details, dan noemen we direct een reële prijs, voordat u boekt.'}</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">${en ? 'Reimbursement' : 'Vergoeding'}</span>
      <h2>${en ? 'Is the ride' : 'Wordt de rit'} <span class="serif-i">${en ? 'reimbursed?' : 'vergoed?'}</span></h2>
    </div>
    <div class="about-info-grid">
      <div class="reveal reveal-d1">
        <p>${en ? "Some health insurers reimburse wheelchair transport, fully or partly, from the basic or supplementary policy, usually when there's a medical necessity. With a personal budget (pgb) from the Wmo you can also choose your own carrier, such as " + SITE.name + ". The regular, collective Wmo transport (the regional taxi) is a separate system where you can't freely choose your own carrier." : `Sommige zorgverzekeraars vergoeden rolstoelvervoer geheel of gedeeltelijk vanuit de basis- of aanvullende verzekering, meestal bij medische noodzaak. Ook via een persoonsgebonden budget (pgb) vanuit de Wmo kunt u zelf een vervoerder kiezen, zoals Rolstoeltaxi Spoed. Het gewone, collectieve Wmo-vervoer (de regiotaxi) is een apart systeem waar u niet vrij een eigen vervoerder bij kiest.`}</p>
        <p>${en ? "To be sure, contact your health insurer, municipality or care facility beforehand to ask what is reimbursed in your case. We provide an invoice on request, which you can submit yourself." : 'Neem voor de zekerheid vooraf contact op met uw zorgverzekeraar, gemeente of zorginstelling om na te vragen wat in uw geval vergoed wordt. Wij verstrekken desgevraagd een factuur die u zelf kunt indienen.'}</p>
      </div>
      <div class="signals-card reveal reveal-d2">
        <h4>${en ? 'Worth asking about' : 'Handig om na te vragen'}</h4>
        <ul class="signals-list">
          <li>${en ? 'Whether wheelchair transport is covered by your supplementary health insurance' : 'Of rolstoelvervoer onder uw aanvullende zorgverzekering valt'}</li>
          <li>${en ? 'Whether a pgb from the Wmo lets you choose your own carrier' : 'Of u met een pgb vanuit de Wmo zelf een vervoerder mag kiezen'}</li>
          <li>${en ? 'Whether your care facility reimburses or arranges transport itself' : 'Of uw zorginstelling vervoer vergoedt of zelf regelt'}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Tailored price' : 'Prijs op maat'}</span>
    <h2 class="reveal reveal-d1">${en ? 'What does your' : 'Wat kost uw'} <span class="serif-i">${en ? 'ride cost?' : 'rit?'}</span></h2>
    <p class="reveal reveal-d2">${en ? "Call or message us, and you'll hear a realistic price indication right away." : 'Bel of app ons, dan hoort u direct een reële prijsindicatie.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a></p>
  </div>
</section>`;
}

/* ============================== FAQ PAGE ============================== */

const FAQS_FULL = [
  { q: 'Wat is het verschil tussen Rolstoeltaxi Spoed en regulier rolstoelvervoer?', a: 'Rolstoeltaxi Spoed is gericht op ritten die niet vooraf gepland konden worden: een spoedopname, een last-minute afspraak of vervoer dat vandaag nog geregeld moet zijn. Voor vooraf geplande, terugkerende ritten kunt u ons ook gewoon bellen, zie onze pagina over rolstoelvervoer.' },
  { q: 'Hoe snel kan een rolstoelbus bij mij zijn?', a: 'Dat hangt af van waar u zich bevindt en welke bus het dichtstbij beschikbaar is. Aan de telefoon geven we altijd een realistische inschatting van de aankomsttijd.' },
  { q: 'Is Rolstoeltaxi Spoed hetzelfde bedrijf als Rolstoeltaxi Holland?', a: 'Rolstoeltaxi Spoed is de spoedtak van Rolstoeltaxi Holland: dezelfde ervaren chauffeurs en dezelfde rolstoelbussen, speciaal ingericht op snel schakelen bij spoed.' },
  { q: 'Rijden jullie ook \'s nachts en in het weekend?', a: 'Ja, we zijn 24 uur per dag, 7 dagen per week bereikbaar voor spoedritten, ook \'s nachts en in het weekend.' },
  { q: 'Kan mijn begeleider mee in de bus?', a: 'Ja, een familielid of begeleider kan gewoon meerijden. Geef dit door bij het boeken, dan houden we daar rekening mee.' },
  { q: 'Betaal ik voor een begeleider of voor wachttijd?', a: 'Nee. Een begeleider die meereist en de wachttijd tijdens uw afspraak of plechtigheid brengen we niet in rekening.' },
  { q: 'Wat kost een spoedrit?', a: 'De prijs is afhankelijk van afstand en tijdstip, en bij spoed geldt een toeslag ten opzichte van vooraf geplande ritten. U hoort de prijs altijd vooraf aan de telefoon. Bekijk ook onze tarievenpagina.' },
  { q: 'Vergoedt mijn zorgverzekeraar of gemeente de rit?', a: 'Dat verschilt per situatie. Uw zorgverzekeraar vergoedt soms rolstoelvervoer bij medische noodzaak. Heeft u een pgb vanuit de Wmo, dan kunt u daarmee zelf een vervoerder kiezen. Het gewone collectieve Wmo-vervoer (de regiotaxi) is een ander systeem. Vraag dit vooraf na bij uw zorgverzekeraar, gemeente of zorginstelling. Wij verstrekken desgevraagd een factuur die u zelf kunt indienen.' },
  { q: 'Kan er ook een scootmobiel mee in plaats van een rolstoel?', a: 'Ja, de elektrische laadklep is geschikt voor zowel een rolstoel als een scootmobiel.' },
  { q: 'In welke regio\'s rijdt Rolstoeltaxi Spoed?', a: 'We rijden in Nederland, met extra veel ritten in en rond Amsterdam, Rotterdam, Den Haag, Utrecht, Amersfoort en Hilversum. Staat uw plaats er niet bij? Bel gerust, we bespreken de mogelijkheden.' },
  { q: 'Hoe reserveer ik een rit?', a: 'Bij spoed belt of appt u ons het liefst direct. Voor een geplande rit kunt u ook het contactformulier invullen, dan nemen we snel contact op om de rit en de prijs te bevestigen.' },
];

const FAQS_FULL_EN = [
  { q: `What is the difference between ${SITE.name} and regular wheelchair transport?`, a: `${SITE.name} focuses on rides that couldn't be planned in advance: an emergency admission, a last-minute appointment, or transport that needs to be arranged today. For pre-planned, recurring rides you can just call us as well, see our wheelchair transport page.` },
  { q: 'How quickly can a wheelchair-accessible vehicle reach me?', a: 'That depends on where you are and which vehicle is available nearest to you. On the phone we always give a realistic estimate of the arrival time.' },
  { q: `Is ${SITE.name} the same company as ${SITE.parentBrand}?`, a: `${SITE.name} is the emergency branch of ${SITE.parentBrand}: the same experienced drivers and the same wheelchair-accessible vehicles, specially set up to switch quickly during an emergency.` },
  { q: 'Do you also drive at night and on weekends?', a: 'Yes, we are reachable 24 hours a day, 7 days a week for emergency rides, including at night and on weekends.' },
  { q: 'Can my companion come along in the vehicle?', a: 'Yes, a family member or companion can simply ride along. Let us know when booking, and we\'ll take it into account.' },
  { q: 'Do I pay for a companion or for waiting time?', a: "No. A companion who rides along and the waiting time during your appointment or ceremony are never charged." },
  { q: 'What does an emergency ride cost?', a: 'The price depends on distance and time, and a surcharge applies for emergencies compared to pre-planned rides. You always hear the price beforehand on the phone. Also see our rates page.' },
  { q: 'Does my health insurer or municipality reimburse the ride?', a: 'That varies per situation. Your health insurer sometimes reimburses wheelchair transport when medically necessary. With a pgb from the Wmo you can choose your own carrier. The regular collective Wmo transport (the regional taxi) is a different system. Please check this beforehand with your health insurer, municipality or care facility. We provide an invoice on request, which you can submit yourself.' },
  { q: 'Can a mobility scooter come along instead of a wheelchair?', a: 'Yes, the electric ramp is suitable for both a wheelchair and a mobility scooter.' },
  { q: `In which regions does ${SITE.name} operate?`, a: "We drive throughout the Netherlands, with extra rides in and around Amsterdam, Rotterdam, The Hague, Utrecht, Amersfoort and Hilversum. Not on the list? Call us, we're happy to discuss the options." },
  { q: 'How do I book a ride?', a: "For an emergency, it's best to call or message us directly. For a planned ride you can also fill in the contact form, and we'll get in touch quickly to confirm the ride and the price." },
];

function faqLd(locale = 'nl') {
  const list = locale === 'en' ? FAQS_FULL_EN : FAQS_FULL;
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${list.map(f => `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`).join(',\n    ')}
  ]
}
</script>`;
}

function buildFaqBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const list = en ? FAQS_FULL_EN : FAQS_FULL;
  return `<!-- PAGE HERO -->
<header class="page-hero" style="padding-bottom:20px">
  <div class="wrap">
    ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Frequently asked questions' : 'Veelgestelde vragen' }])}
    <span class="eyebrow reveal">${en ? 'Frequently asked questions' : 'Veelgestelde vragen'}</span>
    <h1 class="reveal reveal-d1">${en ? 'Everything you want to' : 'Alles wat u wilt'} <span class="serif-i">${en ? 'know' : 'weten'}</span></h1>
    <p class="lead reveal reveal-d2">${en ? "Don't see your question? Feel free to call or message us, we're happy to help." : 'Staat uw vraag er niet bij? Bel of app ons gerust, we denken graag mee.'}</p>
  </div>
</header>

<section style="padding-top:0">
  <div class="wrap">
    <div class="faq-list" style="max-width:820px">
      ${list.map(f => `<div class="faq-item reveal">
        <button class="faq-q" aria-expanded="false">${f.q}</button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- CTA -->
<section id="contact" class="cta-final night">
  <canvas class="particles"></canvas>
  <div class="wrap">
    <span class="eyebrow reveal">${en ? 'Another question?' : 'Nog een vraag?'}</span>
    <h2 class="reveal reveal-d1">${en ? 'Feel free to call,' : 'Bel gerust,'} <span class="serif-i">${en ? "we're happy to help" : 'we denken mee'}</span></h2>
    <p class="reveal reveal-d2">${en ? "Don't need a standard answer? On the phone we look at your specific situation." : 'Geen standaardantwoord nodig? Aan de telefoon kijken we naar uw specifieke situatie.'}</p>
    <div class="reveal reveal-d3">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
    </div>
    <p class="cta-sub reveal reveal-d3">${en ? 'Or' : 'Of'} <a href="${base}/contact" style="color:var(--accent-2)">${en ? 'book a ride online' : 'plan online een rit'}</a></p>
  </div>
</section>`;
}

/* ============================== PRIVACY PAGE ============================== */

function buildPrivacyBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<!-- PAGE HERO -->
<header class="page-hero" style="padding-bottom:20px">
  <div class="wrap">
    ${breadcrumbNav([{ label: 'Home', href: `${base}/` }, { label: en ? 'Privacy policy' : 'Privacyverklaring' }])}
    <span class="eyebrow reveal">${en ? 'Legal' : 'Juridisch'}</span>
    <h1 class="reveal reveal-d1">${en ? 'Privacy' : 'Privacy'}<span class="serif-i">${en ? ' policy' : 'verklaring'}</span></h1>
    <p class="lead reveal reveal-d2">${en ? `Last updated: 2026. ${SITE.name} handles your personal data with care.` : `Laatst bijgewerkt: 2026. ${SITE.name} gaat zorgvuldig om met uw persoonsgegevens.`}</p>
  </div>
</header>

<section style="padding-top:20px">
  <div class="wrap prose reveal">
    ${en ? `<h2>Who we are</h2>
    <p>${SITE.name}, part of ${SITE.parentBrand}, is responsible for processing personal data as described in this privacy policy. Questions? Contact us via <a href="mailto:${SITE.email}" style="color:var(--accent)">${SITE.email}</a>.</p>

    <h2>What data we process</h2>
    <ul>
      <li>Name, phone number and (if provided) email address</li>
      <li>Pickup and destination address needed to schedule a ride</li>
      <li>Messages you send us via the contact form, phone or WhatsApp</li>
    </ul>

    <h2>Why we process this data</h2>
    <p>We use your data exclusively to contact you about your request, to schedule a ride, and to carry out and invoice the agreed ride. We never sell your data to third parties.</p>

    <h2>Retention period</h2>
    <p>We do not keep your data longer than necessary for the purposes for which it was collected, unless a longer retention period is legally required, for example for tax record-keeping obligations.</p>

    <h2>Sharing with third parties</h2>
    <p>We only share your data with third parties when necessary to carry out our services, such as the party that technically processes our contact form, or when legally required.</p>

    <h2>Your rights</h2>
    <p>You have the right to view, correct or have your data deleted. Contact us via <a href="mailto:${SITE.email}" style="color:var(--accent)">${SITE.email}</a>.</p>

    <h2>Questions about your ride?</h2>
    <p>For questions about transport, rates or reimbursement, see our <a href="${base}/veelgestelde-vragen" style="color:var(--accent)">frequently asked questions page</a> or use the <a href="${base}/contact" style="color:var(--accent)">contact form</a>.</p>

    <h2>Cookies</h2>
    <p>This website uses necessary cookies to work properly, for example to remember your cookie choice. We only place analytics cookies (Google Analytics) and advertising cookies (Google Ads, via Google Tag Manager) after you give consent via the cookie banner. You can accept or decline this at any time; nothing is tracked before you choose "Accept". Some pages also include an instruction video from YouTube, which only loads once you click the play button yourself; from that moment on, YouTube may place cookies according to its own privacy policy.</p>`
    : `<h2>Wie zijn wij</h2>
    <p>${SITE.name}, onderdeel van ${SITE.parentBrand}, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring. Vragen? Neem contact op via <a href="mailto:${SITE.email}" style="color:var(--accent)">${SITE.email}</a>.</p>

    <h2>Welke gegevens verwerken wij</h2>
    <ul>
      <li>Naam, telefoonnummer en (indien opgegeven) e-mailadres</li>
      <li>Ophaal- en bestemmingsadres die nodig zijn om een rit in te plannen</li>
      <li>Berichten die u ons stuurt via het contactformulier, telefoon of WhatsApp</li>
    </ul>

    <h2>Waarom verwerken wij deze gegevens</h2>
    <p>Wij gebruiken uw gegevens uitsluitend om contact met u op te nemen over uw aanvraag, een rit in te plannen en de overeengekomen rit uit te voeren en te factureren. Wij verkopen uw gegevens nooit aan derden.</p>

    <h2>Bewaartermijn</h2>
    <p>Wij bewaren uw gegevens niet langer dan noodzakelijk voor de doelen waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk verplicht is, bijvoorbeeld voor de fiscale bewaarplicht.</p>

    <h2>Delen met derden</h2>
    <p>Wij delen uw gegevens alleen met derden als dat nodig is voor de uitvoering van onze dienstverlening, zoals de partij die ons contactformulier technisch verwerkt, of wanneer dit wettelijk verplicht is.</p>

    <h2>Uw rechten</h2>
    <p>U heeft het recht om uw gegevens in te zien, te corrigeren of te laten verwijderen. Neem hiervoor contact op via <a href="mailto:${SITE.email}" style="color:var(--accent)">${SITE.email}</a>.</p>

    <h2>Vragen over uw rit?</h2>
    <p>Voor vragen over vervoer, tarieven of vergoeding kunt u terecht op onze <a href="${base}/veelgestelde-vragen" style="color:var(--accent)">pagina met veelgestelde vragen</a> of via het <a href="${base}/contact" style="color:var(--accent)">contactformulier</a>.</p>

    <h2>Cookies</h2>
    <p>Deze website gebruikt noodzakelijke cookies om goed te werken, bijvoorbeeld om uw cookiekeuze te onthouden. Analytische cookies (Google Analytics) en advertentiecookies (Google Ads, via Google Tag Manager) plaatsen wij alleen nadat u hiervoor toestemming geeft via de cookiebanner. U kunt dit op elk moment accepteren of weigeren; er wordt niets gemeten voordat u op "Akkoord" klikt. Op enkele pagina's staat ook een instructievideo van YouTube. Deze wordt pas geladen als u zelf op de afspeelknop klikt; vanaf dat moment kan YouTube cookies plaatsen volgens hun eigen privacybeleid.</p>`}
  </div>
</section>`;
}

/* ============================== BEDANKT PAGE ============================== */

function buildBedanktBody(locale = 'nl') {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  return `<header class="page-hero" style="min-height:60vh;display:flex;align-items:center">
  <div class="wrap" style="text-align:center;max-width:640px">
    <span class="eyebrow reveal">${en ? 'Request received' : 'Aanvraag ontvangen'}</span>
    <h1 class="reveal reveal-d1">${en ? 'Thank you,' : 'Bedankt,'} <span class="serif-i">${en ? "we'll be in touch" : 'we nemen contact op'}</span></h1>
    <p class="lead reveal reveal-d2" style="margin-left:auto;margin-right:auto">${en ? "We'll respond as soon as possible to confirm the ride and the price. In a hurry? Feel free to call directly." : 'We reageren zo snel mogelijk om de rit en de prijs te bevestigen. Heeft u haast? Bel gerust direct.'}</p>
    <div class="hero-cta reveal reveal-d3" style="justify-content:center">
      <a href="tel:${SITE.phoneTel}" class="btn">${en ? 'Call' : 'Bel'} ${SITE.phoneDisplay}</a>
      <a href="${base}/" class="btn btn-ghost">${en ? 'Back to the homepage' : 'Terug naar de homepage'}</a>
    </div>
    <p class="demo-note" id="demoNote" hidden style="max-width:52ch;margin:18px auto 0">${en ? "Demo mode: no email address is linked to the form yet, so this request wasn't actually sent." : 'Demo-modus: er is nog geen e-mailadres gekoppeld aan het formulier, dus deze aanvraag is niet echt verstuurd.'}</p>
    <script>if (location.search.indexOf('demo=1') > -1) document.getElementById('demoNote').hidden = false;</script>
    <p class="cta-sub reveal reveal-d3" style="margin-top:18px">${en ? 'In the meantime: take a look at our' : 'Ondertussen: bekijk onze'} <a href="${base}/diensten" style="color:var(--accent)">${en ? 'services' : 'diensten'}</a> ${en ? 'or the' : 'of de'} <a href="${base}/locaties" style="color:var(--accent)">${en ? 'locations we drive to' : 'locaties waar we rijden'}</a>.</p>
  </div>
</header>`;
}

function withBrand(t) {
  const full = `${t} | ${SITE.name}`;
  return full.length <= 68 ? full : t;
}

/* ============================== WRITE FILES ============================== */

const EN_TITLES = {
  home: 'Rolstoeltaxi Spoed | Wheelchair transport in the Netherlands, call now',
  homeDesc: 'Need urgent wheelchair transport in the Netherlands? Rolstoeltaxi Spoed responds 24/7 with a fully equipped wheelchair-accessible vehicle. No emailing, just call directly.',
  diensten: 'Services: wheelchair transport and emergency transport | Rolstoeltaxi Spoed',
  dienstenDesc: 'All services from Rolstoeltaxi Spoed: emergency transport, wheelchair transport, hospital transport, Schiphol transport, event transport and more. 24/7 available, call now.',
  locaties: (n) => `Locations: wheelchair taxi in ${n} places | Rolstoeltaxi Spoed`,
  locatiesDesc: 'Rolstoeltaxi Spoed drives in Amsterdam, Schiphol, Haarlem, Leiden, Utrecht, Rotterdam and more. Choose your location and call now for emergency wheelchair transport.',
  contact: 'Book directly | Rolstoeltaxi Spoed',
  contactDesc: '24/7 available in the Netherlands, with a wheelchair-accessible vehicle, electric ramp and the price named beforehand.',
  overOns: 'About us | Rolstoeltaxi Spoed, emergency branch of Rolstoeltaxi Holland',
  overOnsDesc: 'Meet Rolstoeltaxi Spoed: the emergency branch of Rolstoeltaxi Holland. The same experienced drivers, set up to switch quickly during an emergency.',
  tarieven: 'Rates | Rolstoeltaxi Spoed',
  tarievenDesc: 'How is the price of a ride with Rolstoeltaxi Spoed built up? Transparent and always named beforehand, even for emergencies. Call for a tailored price.',
  faq: 'Frequently asked questions | Rolstoeltaxi Spoed',
  faqDesc: 'Answers to the most common questions about emergency transport, rates, reimbursement and booking with Rolstoeltaxi Spoed. Not on the list? Feel free to call.',
  privacy: 'Privacy policy | Rolstoeltaxi Spoed',
  privacyDesc: 'Read how Rolstoeltaxi Spoed handles your personal data: what data we process, why, how long we keep it and what rights you have.',
  bedankt: 'Thank you for your request | Rolstoeltaxi Spoed',
  bedanktDesc: "Your request has been received. Rolstoeltaxi Spoed will contact you as soon as possible to confirm the ride and the price. In a hurry? Feel free to call directly.",
};

function writeAllPages(locale) {
  const en = locale === 'en';
  const root = en ? path.join(ROOT, 'en') : ROOT;
  const base = en ? '/en' : '';
  fs.mkdirSync(path.join(root, 'diensten'), { recursive: true });

  const homeHtml = page({
    title: en ? EN_TITLES.home : 'Rolstoeltaxi Spoed | Rolstoelvervoer in Nederland, bel direct',
    description: en ? EN_TITLES.homeDesc : 'Acuut rolstoelvervoer nodig in Nederland? Rolstoeltaxi Spoed rukt 24/7 uit met een volledig uitgeruste rolstoelbus. Niet mailen, gewoon direct bellen.',
    canonicalPath: en ? 'en' : '',
    prefix: '',
    extraLd: homeLd(locale),
    bodyHtml: buildHomeBody(locale),
    locale,
  });
  fs.writeFileSync(path.join(root, 'index.html'), homeHtml);

  for (const svc of SERVICES) {
    const d = en ? svc.en : svc;
    const html = page({
      title: withBrand(d.metaTitle),
      description: d.metaDescription,
      canonicalPath: en ? `en/diensten/${svc.slug}` : `diensten/${svc.slug}`,
      prefix: '../',
      extraLd: serviceLd(svc, locale),
      bodyHtml: buildServiceBody(svc, locale),
      useScrollThreshold: true,
      locale,
    });
    fs.writeFileSync(path.join(root, 'diensten', `${svc.slug}.html`), html);
  }

  if (!en) {
    // remove stale generated pages from earlier structures
    for (const old of ['spoed-ziekenhuisvervoer', 'luchthavenvervoer-spoed']) {
      try { fs.unlinkSync(path.join(root, 'diensten', `${old}.html`)); } catch (e) { /* not present */ }
    }
    for (const f of fs.readdirSync(root)) {
      if (/^rolstoeltaxi-.*\.html$/.test(f)) fs.unlinkSync(path.join(root, f));
    }
  }

  for (const c of CITIES) {
    const file = c.path ? c.path.slice(1) : `rolstoeltaxi-${c.slug}`;
    const name = en ? (c.en.name || c.name) : c.name;
    const html = page({
      title: c.isService
        ? `${name}: ${en ? 'wheelchair transport with emergency service' : 'rolstoelvervoer met spoedservice'}`
        : en ? `Wheelchair taxi ${name} near you: emergency transport 24/7` : `Rolstoeltaxi ${name} in de buurt: spoedvervoer 24/7`,
      description: en ? c.en.metaDescription : c.metaDescription,
      canonicalPath: en ? `en/${file}` : file,
      prefix: '',
      extraLd: cityLd(c, locale),
      bodyHtml: buildCityBody(c, locale),
      useScrollThreshold: true,
      locale,
    });
    fs.writeFileSync(path.join(root, `${file}.html`), html);
  }

  fs.writeFileSync(path.join(root, 'diensten.html'), page({
    title: en ? EN_TITLES.diensten : 'Diensten: rolstoelvervoer en spoedvervoer | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.dienstenDesc : 'Alle diensten van Rolstoeltaxi Spoed: spoedvervoer, rolstoelvervoer, ziekenhuisvervoer, Schipholvervoer, evenementvervoer en meer. 24/7 bereikbaar, bel direct.',
    canonicalPath: en ? 'en/diensten' : 'diensten',
    prefix: '',
    extraLd: breadcrumbLd([{ label: 'Home', url: `${SITE.domain}${base}/` }, { label: en ? 'Services' : 'Diensten' }]),
    bodyHtml: buildDienstenHub(locale),
    useScrollThreshold: true,
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'locaties.html'), page({
    title: en ? EN_TITLES.locaties(CITIES.length) : `Locaties: rolstoeltaxi in ${CITIES.length} plaatsen | Rolstoeltaxi Spoed`,
    description: en ? EN_TITLES.locatiesDesc : 'Rolstoeltaxi Spoed rijdt in Amsterdam, Schiphol, Haarlem, Leiden, Utrecht, Rotterdam en meer. Kies uw plaats en bel direct voor spoedvervoer met rolstoelbus.',
    canonicalPath: en ? 'en/locaties' : 'locaties',
    prefix: '',
    extraLd: breadcrumbLd([{ label: 'Home', url: `${SITE.domain}${base}/` }, { label: en ? 'Locations' : 'Locaties' }]),
    bodyHtml: buildLocatiesHub(locale),
    useScrollThreshold: true,
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'contact.html'), page({
    title: en ? EN_TITLES.contact : 'Direct reserveren | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.contactDesc : 'Plan online een rit met Rolstoeltaxi Spoed, of bel direct bij spoed. 24/7 bereikbaar in Nederland, met rolstoelbus, elektrische laadklep en prijs vooraf.',
    canonicalPath: en ? 'en/contact' : 'contact',
    prefix: '',
    extraLd: contactLd(locale),
    bodyHtml: buildContactBody(locale),
    skipSticky: true,
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'over-ons.html'), page({
    title: en ? EN_TITLES.overOns : 'Over ons | Rolstoeltaxi Spoed, spoedtak van Rolstoeltaxi Holland',
    description: en ? EN_TITLES.overOnsDesc : 'Maak kennis met Rolstoeltaxi Spoed: de spoedtak van Rolstoeltaxi Holland. Dezelfde ervaren chauffeurs, ingericht op snel schakelen bij spoed.',
    canonicalPath: en ? 'en/over-ons' : 'over-ons',
    prefix: '',
    extraLd: '',
    bodyHtml: buildOverOnsBody(locale),
    useScrollThreshold: true,
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'tarieven.html'), page({
    title: en ? EN_TITLES.tarieven : 'Tarieven | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.tarievenDesc : 'Hoe is de prijs van een rit bij Rolstoeltaxi Spoed opgebouwd? Transparant en altijd vooraf genoemd, ook bij spoed. Bel voor een prijs op maat.',
    canonicalPath: en ? 'en/tarieven' : 'tarieven',
    prefix: '',
    extraLd: '',
    bodyHtml: buildTarievenBody(locale),
    useScrollThreshold: true,
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'veelgestelde-vragen.html'), page({
    title: en ? EN_TITLES.faq : 'Veelgestelde vragen | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.faqDesc : 'Antwoord op de meest gestelde vragen over spoedvervoer, tarieven, vergoeding en reserveren bij Rolstoeltaxi Spoed. Staat uw vraag er niet bij? Bel gerust.',
    canonicalPath: en ? 'en/veelgestelde-vragen' : 'veelgestelde-vragen',
    prefix: '',
    extraLd: faqLd(locale),
    bodyHtml: buildFaqBody(locale),
    useScrollThreshold: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'privacyverklaring.html'), page({
    title: en ? EN_TITLES.privacy : 'Privacyverklaring | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.privacyDesc : 'Lees hoe Rolstoeltaxi Spoed omgaat met uw persoonsgegevens: welke gegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten u heeft.',
    canonicalPath: en ? 'en/privacyverklaring' : 'privacyverklaring',
    prefix: '',
    extraLd: '',
    bodyHtml: buildPrivacyBody(locale),
    skipFaq: true,
    locale,
  }));

  fs.writeFileSync(path.join(root, 'bedankt.html'), page({
    title: en ? EN_TITLES.bedankt : 'Bedankt voor uw aanvraag | Rolstoeltaxi Spoed',
    description: en ? EN_TITLES.bedanktDesc : 'Uw aanvraag is ontvangen. Rolstoeltaxi Spoed neemt zo snel mogelijk contact met u op om de rit en de prijs te bevestigen. Heeft u haast? Bel gerust direct.',
    canonicalPath: en ? 'en/bedankt' : 'bedankt',
    prefix: '',
    extraLd: '<meta name="robots" content="noindex, follow">',
    bodyHtml: buildBedanktBody(locale),
    skipSticky: true,
    skipFaq: true,
    locale,
  }));
}

writeAllPages('nl');
writeAllPages('en');

/* ============================== SITEMAP & ROBOTS ============================== */

const staticPages = ['', 'diensten', 'locaties', 'over-ons', 'tarieven', 'contact', 'veelgestelde-vragen', 'privacyverklaring'];
const urls = [
  ...staticPages.map(p => `${SITE.domain}/${p}`),
  ...SERVICES.map(s => `${SITE.domain}/diensten/${s.slug}`),
  ...CITIES.map(c => `${SITE.domain}${cityPath(c)}`),
  ...staticPages.map(p => `${SITE.domain}/en${p ? '/' + p : ''}`),
  ...SERVICES.map(s => `${SITE.domain}/en/diensten/${s.slug}`),
  ...CITIES.map(c => `${SITE.domain}/en${cityPath(c)}`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE.domain}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);

const totalPages = staticPages.length + SERVICES.length + CITIES.length + 1 /* bedankt */;
console.log(`Generated ${SERVICES.length} service pages and ${CITIES.length} location pages, in NL and EN.`);
console.log(`Total HTML pages: ${totalPages * 2} (${totalPages} per taal: ${staticPages.length} vaste pagina's, ${SERVICES.length} diensten, ${CITIES.length} locaties, 1 bedankt-pagina)`);
console.log(`sitemap.xml: ${urls.length} URLs (bedankt.html excluded on purpose)`);

module.exports = { SITE, SERVICES, page, head, nav, footer, stickyCta, scripts, svgCheck };
