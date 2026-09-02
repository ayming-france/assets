/* Ayming Slides - Unified JS */

// ===== Umami analytics (self-hosted on Vercel, privacy-friendly) =====
// Injected once here so every deck that loads the shared engine is tracked with
// zero per-deck markup. Pageviews are automatic; the deck's own custom events
// (slide views, PDF downloads, link clicks, ...) are bridged into Umami from the
// internal track() helper further down.
(function injectUmami() {
  try {
    if (window.__umamiInjected) return; window.__umamiInjected = true;
    // Allow-list: only the client-facing offer decks are tracked. Internal /
    // personal decks (marketing dashboards, lead prioritization, abo-dat, the
    // hub homepage, ...) also load this shared engine but are excluded. Add a
    // slug here when a new CLIENT deck goes live.
    // TRACKED-START (généré par sync_tracked.py)
    var TRACKED = [
      'accidents-tiers', 'accompagnement-controle-urssaf',
      'aides-apprentissage', 'collecte-et-traitement-des-arrets',
      'cotisations-atmp', 'declarer-un-accident-du-travail', 'duerp',
      'ecosystem-digital', 'gestion-des-atmp', 'maitrise-des-charges-sociales',
      'maitrise-des-ijss', 'offre-essentiel', 'pilotage-arrets-longue-duree',
      'questionnaires-de-maladie-professionnelle',
      'rattrapage-visites-medicales', 'recuperer-ij', 'remboursements-ijss',
      'veille-net-entreprises', 'visites-medicales'
    ];
    // TRACKED-END
    var slug = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
    if (TRACKED.indexOf(slug) < 0) return; // not a client deck -> no analytics
    // Audience role, computed here so it rides as a native Umami TAG on every hit
    // (including the gated pageview) -> filterable dashboard-wide via Filter > Tag.
    var role = (function () {
      try {
        var stored = localStorage.getItem('ay-role');
        if (stored === 'rep' || stored === 'client') return stored;
        var r = /[?&]pm=/.test(location.search) ? 'client' : 'rep';
        localStorage.setItem('ay-role', r); return r;
      } catch (e) { return 'rep'; }
    })();
    window.__AY_ROLE = role;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://umami-analytics-three-fawn.vercel.app/script.js';
    s.setAttribute('data-website-id', 'b3424f11-6037-4c00-a72e-97dfdd6377a5');
    s.setAttribute('data-tag', role);
    // Don't auto-send the pageview on load: gate it behind a human signal so
    // link-scanners (email/chat security bots that fetch the URL and leave in
    // <1s, from Dublin/Amsterdam datacenters) never create a session.
    s.setAttribute('data-auto-track', 'false');
    (document.head || document.documentElement).appendChild(s);
    // Fire ONE manual pageview on the first sign of a real human: an interaction
    // (key/pointer/wheel/touch) or ~4s of visible presence. A scanner does
    // neither. Custom events (slide_time, link_click, ...) also only fire on
    // interaction, so a scanner that fetches and leaves stays entirely untracked.
    var _pv = false, _sig = ['keydown', 'pointerdown', 'wheel', 'touchstart'];
    function _firePv() {
      if (_pv) return; _pv = true;
      _sig.forEach(function (ev) { window.removeEventListener(ev, _firePv, true); });
      (function go() {
        if (window.umami && window.umami.track) { try { window.umami.track(); } catch (e) {} }
        else setTimeout(go, 200);
      })();
    }
    _sig.forEach(function (ev) { window.addEventListener(ev, _firePv, true); });
    var _dw = 0, _iv = setInterval(function () {
      if (document.visibilityState === 'visible') _dw += 500;
      if (_pv || _dw >= 4000) { clearInterval(_iv); _firePv(); }
    }, 500);
  } catch (e) { /* never let analytics break the deck */ }
})();

/* ============================================================================
   Shared "Clients par secteur" slide — single source for every deck.
   A deck opts in with: <section class="slide" data-chapter="clients" data-shared="clients"></section>
   Edit CLIENTS_SLIDE below once here and all decks update. Guarded: never breaks decks.
   ========================================================================== */
const CLIENTS_SLIDE = {
  title: 'Plus de 2 500 clients nous font confiance',
  base: 'https://ayming-france.github.io/assets/imagery/clients/',
  // "file.ext" or "file.ext|cssClass" (lg-trim wide wordmarks, lg-boost compact emblems, lg-xl detailed)
  sectors: [
    ['Agroalimentaire', ['bonduelle.svg|lg-boost', 'andros.png', 'unilever.svg', 'lindt.svg', 'haribo.svg', 'arterris.svg', 'cooperl.png', 'terrena.png|lg-boost']],
    ['Distribution & Commerce', ['intermarche.svg', 'systeme-u.svg', 'leclerc.svg', 'casino.svg', 'sodexo.svg|lg-trim', 'accor.svg|lg-trim', 'loreal.svg|lg-trim', 'lvmh.svg|lg-trim', 'ikea.svg']],
    ['Industrie', ['seb.svg|lg-boost', 'engie.svg', 'edf.svg', 'legrand.svg', 'nexans.svg', 'arcelormittal.svg', 'knauf.svg', 'mersen.svg', 'hermes.svg']],
    ['BTP & Construction', ['vinci.svg', 'bouygues.svg', 'eiffage.svg', 'fayat.png', 'nge.svg', 'spie-batignolles.svg', 'otis.svg|lg-trim']],
    ['Transport & Logistique', ['transdev.svg', 'sncf.svg', 'cmacgm.svg', 'jacky-perrenot.png', 'gls.svg', 'airfrance-klm.svg|lg-trim']],
    ['Santé & Pharma', ['pierre-fabre.png', 'vivalto.png|lg-boost', 'baxter.svg|lg-trim', 'virbac.svg', 'delpharm.png', 'gsk.png', 'elsan.png']],
    ['Services & Finance', ['veolia.svg', 'suez.svg', 'credit-agricole.svg', 'credit-mutuel.svg', 'cdc.svg', 'laposte.svg', 'nicollin.png']],
    ['Technologies & Médias', ['thales.svg|lg-trim', 'orange.svg', 'solocal.svg', 'sqli.png']],
    ['Public & ESS', ['omnes.svg', 'upjv.png|lg-boost', 'oppbtp.png|lg-boost', 'aftral.svg', 'min-culture.png|lg-xl']]
  ]
};
(function renderSharedClients() {
  try {
    var ph = document.querySelector('section[data-shared="clients"]');
    if (!ph || ph.getAttribute('data-rendered')) return;
    var cards = CLIENTS_SLIDE.sectors.map(function (s) {
      var imgs = s[1].map(function (l) {
        var p = l.split('|'), file = p[0], cls = p[1] ? ' class="' + p[1] + '"' : '';
        return '<img src="' + CLIENTS_SLIDE.base + file + '" alt="' + file.replace(/\.[^.]+$/, '') + '"' + cls + '>';
      }).join('');
      return '<div class="client-sector"><h4>' + s[0] + '</h4><div class="client-logos">' + imgs + '</div></div>';
    }).join('');
    ph.innerHTML =
      '<div class="slide-inner"><h1 class="slide-title">' + CLIENTS_SLIDE.title + '</h1>' +
      '<div class="clients-grid">' + cards + '</div></div>' +
      '<div class="company-logo"><img src="https://ayming-france.github.io/assets/logos/ayming-logo.png" alt="Ayming"></div>';
    ph.setAttribute('data-rendered', '1');
  } catch (e) { if (window.console) console.warn('shared clients slide render failed', e); }
})();

/* ============================================================================
   Shared certification strip on every deck's cover. Renders the badges into the
   cover's .cover-right (over the photo, on a white gradient). Single source: edit
   CERT_BADGES once here. Guarded: never breaks a deck.
   ========================================================================== */
const CERT_BADGES = ['afaq-iso-9001', 'afaq-iso-27001', 'rse-iso-26000', 'opqcm', 'qualiopi', 'un-global-compact', 'ecovadis'];
(function renderCertStrip() {
  try {
    // Only client-facing sales decks opt in (marked <body data-audience="client">).
    // Internal decks that share the engine (e.g. performance-marketing, methode) stay clean.
    if (document.body.getAttribute('data-audience') !== 'client') return;
    var cr = document.querySelector('.slide.cover .cover-right');
    if (!cr || cr.querySelector('.cert-strip')) return;
    var base = 'https://ayming-france.github.io/assets/imagery/certifications/';
    var strip = document.createElement('div');
    strip.className = 'cert-strip';
    strip.innerHTML = CERT_BADGES.map(function (s) {
      return '<span class="cert-chip"><img src="' + base + s + '.png" alt="' + s + '"></span>';
    }).join('');
    cr.appendChild(strip);
  } catch (e) { if (window.console) console.warn('cert strip render failed', e); }
})();

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navItems = document.querySelectorAll('.nav-item');
const counter = document.querySelector('.slide-counter');
const totalSlides = slides.length;

// ===== Legacy logo repoint =====
// Older deck HTML hardcodes the Ayming nav logo as a wp-content URL on
// ayming.fr, outside our control. Repoint any such image to the copy hosted in
// this assets repo, before the brand banner reads the nav logo below, so a
// WordPress media cleanup can never blank the logo on a live deck.
(function repointLegacyLogo() {
  try {
    const LEGACY = '2025/07/Ayming.png';
    const HOSTED = 'https://ayming-france.github.io/assets/logos/ayming-logo.png';
    const imgs = document.querySelectorAll('img[src*="' + LEGACY + '"]');
    for (let i = 0; i < imgs.length; i++) imgs[i].src = HOSTED;
  } catch (e) { /* never let a logo swap break the deck */ }
})();

// ===== Brand banner =====
// Injected once on every deck (zero per-deck markup). Carries the Ayming logo
// (click = download popover), the confidentiality line, and the consolidated
// prev / counter / next / fullscreen controls. Hidden on the full-bleed cover.
const BANNER_H = 46; // keep in sync with --banner-h in slides.css
let brandBanner = null;
let bannerCounter = null;
(function injectBrandBanner() {
  try {
    const logoSrc = (document.querySelector('.nav-logo img, .company-logo img') || {}).src
      || 'https://ayming-france.github.io/assets/logos/ayming-logo.png';
    const svg = (inner) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      + 'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    const banner = document.createElement('div');
    banner.className = 'brand-banner';
    banner.innerHTML =
      '<div class="banner-logo"><img src="' + logoSrc + '" alt="Ayming"></div>'
      + '<div class="banner-divider"></div>'
      + '<div class="banner-confidential">CONFIDENTIEL · Document propriété exclusive d’Ayming</div>'
      + '<div class="banner-controls">'
      +   '<button class="banner-btn" data-act="prev" aria-label="Précédent">' + svg('<polyline points="15 18 9 12 15 6"/>') + '</button>'
      +   '<span class="banner-counter"></span>'
      +   '<button class="banner-btn" data-act="next" aria-label="Suivant">' + svg('<polyline points="9 18 15 12 9 6"/>') + '</button>'
      +   '<button class="banner-btn" data-act="tools" aria-label="Outils de présentation (T)" title="Outils de présentation (T)">' + svg('<path d="m9 11-6 6v3h3l6-6"/><path d="m15 5 4 4"/><path d="M13 3.5 20.5 11l-5 5L8 8.5z"/>') + '</button>'
      +   '<button class="banner-btn" data-act="fs" aria-label="Plein écran">' + svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>') + '</button>'
      + '</div>';
    document.body.appendChild(banner);
    brandBanner = banner;
    bannerCounter = banner.querySelector('.banner-counter');
    banner.querySelector('[data-act="prev"]').addEventListener('click', () => prevSlide());
    banner.querySelector('[data-act="next"]').addEventListener('click', () => nextSlide());
    banner.querySelector('[data-act="fs"]').addEventListener('click', () => toggleFullscreen());
    // Le bandeau vit dans une autre IIFE que la couche d'annotation : il annonce
    // l'intention, celle-ci l'ecoute.
    banner.querySelector('[data-act="tools"]').addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('ay-tools-toggle'));
    });
  } catch (e) { /* never let the banner break navigation */ }
})();

function updateSlide() {
  slides.forEach((s, i) => {
    s.classList.remove('active');
    if (i === currentSlide) s.classList.add('active');
  });

  // Highlight nav: find nav item with largest data-slide index <= currentSlide
  navItems.forEach(item => item.classList.remove('active'));
  let bestNav = null;
  let bestIdx = -1;
  navItems.forEach(item => {
    const ns = parseInt(item.dataset.slide, 10);
    if (!isNaN(ns) && ns <= currentSlide && ns > bestIdx) {
      bestIdx = ns;
      bestNav = item;
    }
  });
  if (bestNav) bestNav.classList.add('active');

  if (counter) counter.innerHTML = `<span class="current">${pmVisibleIndex()}</span>/${pmVisibleTotal()}`;

  // Brand banner: update counter, hide on the full-bleed cover slide
  if (bannerCounter) bannerCounter.textContent = `${pmVisibleIndex()}/${pmVisibleTotal()}`;
  if (brandBanner) brandBanner.classList.toggle('is-hidden', slides[currentSlide].classList.contains('cover'));

  // Counter animation (conditional: only if intro stat numbers exist)
  const introSlide = document.querySelector('.slide-introduction');
  if (introSlide && slides[currentSlide] === introSlide) {
    setTimeout(animateIntroCounters, 500);
  }

  // Scale the slide to fit the viewport; re-fit once entrance animations have
  // settled and when its images finish loading
  fitSlide();
  setTimeout(fitSlide, 250);
  setTimeout(fitSlide, 700);
  slides[currentSlide].querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', fitSlide, { once: true });
  });
}

// Auto-fit: scale a slide's content wrapper so it always fits the viewport on
// both axes (e.g. 1280x720), capped at each layout's design scale so larger
// screens stay unchanged. Measures the real geometry of the wrapper and its
// direct children, then scales around the wrapper's centre, handling the nav
// offset and any off-centre or oversized content. Cover and full-bleed slides
// have none of these wrappers and are left untouched.
// La navigation des chapitres tient dans la hauteur disponible plutot que de
// defiler : on resserre le rythme vertical jusqu'a ce que tout entre. Les
// valeurs sont posees en style inline plutot qu'en variable CSS, parce qu'un
// deck peut redefinir ces regles et gagner la cascade.
// Le dernier membre marque ce qui se resserre en douceur : on mange d'abord le
// blanc, on ne touche au corps du texte et aux pastilles que si c'est necessaire.
var NAV_FIT_SPECS = [
  ['.nav-header', 'marginBottom', 40, 12, false],
  ['.nav-logo', 'height', 32, 20, true],
  ['.nav-logo', 'marginBottom', 8, 2, false],
  ['.nav-section', 'marginBottom', 28, 8, false],
  ['.nav-section-title', 'marginBottom', 14, 4, false],
  ['.nav-item', 'paddingTop', 10, 3, false],
  ['.nav-item', 'paddingBottom', 10, 3, false],
  ['.nav-item', 'marginBottom', 6, 1, false],
  ['.nav-item', 'fontSize', 13, 11, true],
  ['.nav-item-number', 'width', 22, 17, true],
  ['.nav-item-number', 'height', 22, 17, true],
  ['.nav-item-number', 'marginRight', 12, 7, false]
];
function navApplyFit(nav, k) {
  var soft = 0.45 + 0.55 * k;
  nav.style.paddingTop = Math.max(12, 40 * k) + 'px';
  nav.style.paddingBottom = Math.max(12, 40 * k) + 'px';
  NAV_FIT_SPECS.forEach(function (spec) {
    var px = Math.max(spec[3], spec[2] * (spec[4] ? soft : k)) + 'px';
    nav.querySelectorAll(spec[0]).forEach(function (el) { el.style[spec[1]] = px; });
  });
}
function fitNav() {
  try {
    var nav = document.querySelector('.chapter-nav');
    if (!nav) return;
    var k = 1;
    navApplyFit(nav, k);
    // Les planchers rendent la hauteur non lineaire en k, donc une estimation
    // par le ratio ne converge pas seule : premiere passe au ratio pour aller
    // vite, puis on descend par paliers jusqu'a ce que ca rentre vraiment.
    for (var pass = 0; pass < 14; pass++) {
      var need = nav.scrollHeight, have = nav.clientHeight;
      if (need <= have + 1) return;
      k = Math.max(0.15, pass === 0 ? k * (have / need) * 0.97 : k * 0.93);
      navApplyFit(nav, k);
      if (k <= 0.15) break;
    }
  } catch (e) { /* la navigation ne doit jamais casser le deck */ }
}

function fitSlide() {
  try {
    const slide = slides[currentSlide];
    if (!slide) return;
    const wrap = slide.querySelector(':scope > .slide-inner, :scope > .value-detail-layout, :scope > .layout-split');
    if (!wrap) return;
    // Design scale baked into each layout's CSS — never enlarge past it
    let designScale = 1;
    if (wrap.classList.contains('slide-inner')) designScale = 1.2;
    else if (wrap.classList.contains('value-detail-layout')) designScale = 1.15;
    // Measure at natural size: wrapper box plus the extent of its direct children
    wrap.style.transform = 'scale(1)';
    const w = wrap.getBoundingClientRect();
    let minL = w.left, minT = w.top, maxR = w.right, maxB = w.bottom;
    for (const c of wrap.children) {
      const b = c.getBoundingClientRect();
      if (b.width || b.height) {
        if (b.left < minL) minL = b.left;
        if (b.top < minT) minT = b.top;
        if (b.right > maxR) maxR = b.right;
        if (b.bottom > maxB) maxB = b.bottom;
      }
    }
    // The wrapper scales around its own box centre (transform-origin: center)
    const ox = w.left + w.width / 2;
    const oy = w.top + w.height / 2;
    const M = 16; // keep this margin from each viewport edge
    // Reserve the brand banner's height at the bottom (cover has no banner)
    const bh = slide.classList.contains('cover') ? 0 : BANNER_H;
    const VW = window.innerWidth, VH = window.innerHeight;
    // Largest scale before a given content edge (offset d from origin) crosses
    // the [lo, hi] safe band, both measured relative to the scaling origin
    const cap = (d, lo, hi) => d < 0 ? lo / d : d > 0 ? hi / d : Infinity;
    let scale = Math.min(
      designScale,
      cap(minL - ox, M - ox, VW - M - ox),
      cap(maxR - ox, M - ox, VW - M - ox),
      cap(minT - oy, M - oy, VH - M - bh - oy),
      cap(maxB - oy, M - oy, VH - M - bh - oy)
    );
    if (!isFinite(scale) || scale <= 0) scale = designScale;
    wrap.style.transform = 'scale(' + scale + ')';
  } catch (e) { /* never let auto-fit break navigation */ }
}

// Une slide masquee depuis l'editeur (icone oeil) est sautee pendant la
// presentation, pas seulement dans l'export : le commercial la masque parce que
// le client ne doit pas la voir. L'etat vit sur le DOM (data-pm-hidden), pose
// par l'editeur, donc lisible ici sans dependre de sa portee.
function pmSlideHidden(i) { return !!(slides[i] && slides[i].dataset.pmHidden === '1'); }
function pmSeek(i, step) { while (i >= 0 && i < totalSlides && pmSlideHidden(i)) i += step; return (i >= 0 && i < totalSlides) ? i : -1; }
function pmVisibleTotal() { return Array.prototype.filter.call(slides, function (s) { return s.dataset.pmHidden !== '1'; }).length; }
function pmVisibleIndex() { var n = 0; for (var i = 0; i <= currentSlide && i < totalSlides; i++) { if (!pmSlideHidden(i)) n++; } return n || 1; }
function nextSlide() { const t = pmSeek(currentSlide + 1, 1); if (t !== -1) { currentSlide = t; updateSlide(); } }
function prevSlide() { const t = pmSeek(currentSlide - 1, -1); if (t !== -1) { currentSlide = t; updateSlide(); } }
function goToSlide(i) { if (i < 0 || i >= totalSlides) return; let t = pmSeek(i, 1); if (t === -1) t = pmSeek(i, -1); if (t !== -1) { currentSlide = t; updateSlide(); } }
function toggleFullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }

// Introduction slide counter animation
function animateIntroCounters() {
  const statNumbers = document.querySelectorAll('.slide-introduction.active .intro-stat-number');
  if (!statNumbers.length) return;
  statNumbers.forEach(el => {
    const text = el.textContent;
    const match = text.match(/(\d[\d\s]*)/);
    if (match) {
      const target = parseInt(match[1].replace(/\s/g, ''));
      const suffix = text.replace(match[1], '');
      animateCounter(el, target, suffix);
    }
  });
}

function animateCounter(element, target, suffix, duration = 800) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(target * progress);
    element.textContent = current.toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Confetti (conditional: only runs if canvas exists)
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#11a9e6','#0ab38c','#e8930c','#e63946','#fbbf24','#8b5cf6','#ffffff'];
  const pieces = [];
  for (let i = 0; i < 400; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 8,
      opacity: 1
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      if (p.opacity <= 0) return;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += p.rv;
      if (frame > 300) p.opacity -= 0.008;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (alive) requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// Easter eggs (conditional: only if elements with data-trigger-slide exist)
// HTML contract: <div id="easter-egg-xxx" data-trigger-slide="5" data-confetti="true">
const eggElements = document.querySelectorAll('[data-trigger-slide]');
const eggMap = {};
eggElements.forEach(el => { eggMap[el.dataset.triggerSlide] = el; });
function closeAllEggs() { eggElements.forEach(el => el.classList.remove('visible')); }
function anyEggOpen() { return Array.from(eggElements).some(el => el.classList.contains('visible')); }
eggElements.forEach(el => el.addEventListener('click', () => el.classList.remove('visible')));

function triggerEasterEgg() {
  // Match by data-slide (ecosystem) or data-chapter (offer decks)
  const ds = slides[currentSlide].dataset.slide || slides[currentSlide].dataset.chapter;
  const egg = eggMap[ds];
  if (!egg) return;
  if (egg.dataset.confetti) launchConfetti();
  egg.classList.toggle('visible');
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (anyEggOpen()) { closeAllEggs(); return; }
  switch(e.key) {
    case 'ArrowRight': case ' ': e.preventDefault(); nextSlide(); break;
    case 'ArrowLeft': prevSlide(); break;
    case 'f': case 'F': toggleFullscreen(); break;
    case 'e': case 'E': if (eggElements.length) triggerEasterEgg(); break;
    case 'p': case 'P': { const pp = document.querySelector('.pdf-popover'); if (pp) pp.classList.toggle('visible'); break; }
    case 'Home': goToSlide(0); break;
    case 'End': goToSlide(totalSlides - 1); break;
  }
});

// Discreet keyboard hint (top-right). Aids reps; hidden in fullscreen (during a
// live pitch, CSS) and excluded from exports (pmFilter). Deliberately does NOT
// advertise the secret 'E' editor, so prospects with the link can't discover it.
(function () {
  try {
    const hint = document.createElement('div');
    hint.className = 'deck-help';
    hint.innerHTML = '<span>&#8592; &#8594; naviguer</span><span>F plein écran</span><span>T outils</span><span>P exporter</span>';
    document.body.appendChild(hint);
  } catch (e) { /* never let the hint break the deck */ }
})();

// Nav clicks: data-slide values are always slide indices
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const idx = parseInt(item.dataset.slide, 10);
    if (!isNaN(idx)) goToSlide(idx);
  });
});

// Nav toggle click (touch support)
const navToggle = document.querySelector('.nav-toggle');
const chapterNav = document.querySelector('.chapter-nav');
if (navToggle && chapterNav) navToggle.addEventListener('click', () => chapterNav.classList.toggle('open'));

// Keyboard hint buttons (conditional)
const keyPrev = document.getElementById('key-prev');
const keyNext = document.getElementById('key-next');
const keyFs = document.getElementById('key-fullscreen');
if (keyPrev) keyPrev.addEventListener('click', prevSlide);
if (keyNext) keyNext.addEventListener('click', nextSlide);
if (keyFs) keyFs.addEventListener('click', toggleFullscreen);

// Links during a fullscreen presentation: a new tab opened from a fullscreen
// page stays hidden behind it, so a CTA looks dead. Drop the deck out of
// fullscreen on any link click; the native target="_blank" then opens and
// focuses the tab normally. No preventDefault, so nothing gets popup-blocked.
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]');
  if (a && document.fullscreenElement) { try { document.exitFullscreen(); } catch (x) {} }
}, false);

// Touch swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
});

// Re-fit on resize and once all assets (fonts, images) have loaded
let fitResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(fitResizeTimer);
  fitResizeTimer = setTimeout(function () { fitSlide(); fitNav(); }, 100);
});
window.addEventListener('load', function () { fitSlide(); fitNav(); });
// La navigation est deja dans le HTML, on peut la resserrer sans attendre les
// images : sinon le premier rendu montre une liste trop haute.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fitNav);
else fitNav();

// Init
updateSlide();

// Download popover: discreet affordance. If a deck.pdf and/or deck.pptx file
// exists alongside the deck's index.html, clicking the Ayming logo in the brand
// banner toggles a small download popover with one link per available format.
// Decks without either file are unaffected.
(function () {
  try {
    const logo = document.querySelector('.banner-logo');
    if (!logo || !window.fetch) return;
    const title = (document.title || 'presentation').replace(/[\\/:*?"<>|]/g, ' ').trim();
    const DL_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    // Single download/share point. Each format downloads the instant static deck
    // when unmodified, or a browser-captured personalized file when the rep has
    // edited (window.pm* exposed by the personalization editor). Plus a link to
    // share the personalized live version. No need to open the editor to download.
    const LINK_ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    const formats = [
      { file: 'deck.pdf', ext: 'pdf', label: 'Télécharger en PDF', fn: 'pmExportPdf' },
      { file: 'deck.pptx', ext: 'pptx', label: 'Télécharger en PowerPoint', fn: 'pmExportPptx' },
    ];
    Promise.all(
      formats.map(f => fetch(f.file, { method: 'HEAD' }).then(r => r.ok).catch(() => false))
    ).then(oks => {
      const pop = document.createElement('div');
      pop.className = 'pdf-popover';
      formats.forEach((f, i) => {
        const a = document.createElement('a');
        a.href = f.file; a.setAttribute('download', title + '.' + f.ext);
        a.innerHTML = DL_ICON + f.label;
        a.addEventListener('click', e => {
          const edited = window.pmHasEdits && window.pmHasEdits();
          if ((edited || !oks[i]) && window[f.fn]) { e.preventDefault(); window[f.fn](a); }
          // else: the native <a download> serves the instant static deck
          else pop.classList.remove('visible');
        });
        pop.appendChild(a);
      });
      const cl = document.createElement('a');
      cl.href = '#'; cl.innerHTML = LINK_ICON + 'Copier le lien';
      cl.addEventListener('click', e => { e.preventDefault(); if (window.pmCopyLink) window.pmCopyLink(); pop.classList.remove('visible'); });
      pop.appendChild(cl);
      document.body.appendChild(pop);
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', e => { e.stopPropagation(); pop.classList.toggle('visible'); });
      document.addEventListener('click', e => { if (!pop.contains(e.target)) pop.classList.remove('visible'); });
    }).catch(() => {});
  } catch (e) { /* never let the download affordance break navigation */ }
})();

/* ===== PERSONNALISATION EDITOR (appended) ===== */
/* Personnalisation editor (client-side). Hidden by default; press E to toggle. */
window.addEventListener('load', function () {
  try {
  window.dataLayer = window.dataLayer || [];
  // Audience role for analytics: default "rep" (Sales). A visitor becomes a
  // "client" if they arrived via a personalized "?pm=" share link. That sticks
  // for the browsing session (sessionStorage), so if a client then strips the
  // URL down to the hub they still count as a client, not a rep.
  // Reuse the role computed in injectUmami (drives the native tag). First touch
  // wins and is remembered: a browser marked "rep" stays a rep even on a ?pm= link.
  var AY_ROLE = window.__AY_ROLE || (function () {
    try {
      var stored = localStorage.getItem('ay-role');
      if (stored === 'rep' || stored === 'client') return stored;
      var role = /[?&]pm=/.test(location.search) ? 'client' : 'rep';
      localStorage.setItem('ay-role', role);
      return role;
    } catch (e) { return 'rep'; }
  })();
  // Optional COMPANY identity from the share link "?to=<company>". A company name
  // is a legal entity, NOT personal data, so it is allowed; an individual's name
  // is PII and must never be entered (the dialog asks for the entreprise only). It
  // rides in the payload via umami.identify + a recipient property, sticky per session.
  var AY_RECIPIENT = '';
  try {
    var _m = location.search.match(/[?&]to=([^&]+)/);
    AY_RECIPIENT = _m ? decodeURIComponent(_m[1]) : '';
    if (AY_RECIPIENT) sessionStorage.setItem('ay-to', AY_RECIPIENT);
    else AY_RECIPIENT = sessionStorage.getItem('ay-to') || '';
  } catch (e) {}
  // Rep identity: the commercial's own first name, remembered locally on their
  // browser so every event they trigger carries "who". A share link can also
  // carry "?by=<prénom>" so a client's later events are credited to the rep who
  // sent the link (attribution, not identification of the client).
  var AY_REP = '';
  try { AY_REP = localStorage.getItem('ay-rep') || ''; } catch (e) {}
  try {
    var _mb = location.search.match(/[?&]by=([^&]+)/);
    if (_mb) sessionStorage.setItem('ay-by', decodeURIComponent(_mb[1]));
  } catch (e) {}
  (function ayIdentify() {
    if (!AY_RECIPIENT) return;
    if (window.umami && window.umami.identify) { try { window.umami.identify(AY_RECIPIENT, { role: AY_ROLE }); } catch (e) {} }
    else setTimeout(ayIdentify, 300);
  })();
  function track(event, detail) {
    window.dataLayer.push(Object.assign({ event: event }, detail || {}));
    // Attribute the event to a rep: their own first name when they are logged
    // in as "rep", else the name of the rep who shared the "?by=" link with
    // this client.
    var repTag = '';
    if (AY_ROLE === 'rep' && AY_REP) repTag = AY_REP;
    else if (AY_ROLE === 'client') { try { repTag = sessionStorage.getItem('ay-by') || ''; } catch (e) {} }
    // Bridge every deck event into Umami, tagged with role + deck name (+ company + rep).
    try { if (window.umami && window.umami.track) window.umami.track(event, Object.assign({ role: AY_ROLE, deck: deckKey }, AY_RECIPIENT ? { recipient: AY_RECIPIENT } : {}, repTag ? { rep: repTag } : {}, detail || {})); } catch (e) { }
    var l = document.getElementById('pm-log');
    if (l) { var d = document.createElement('div'); d.className = 'pm-log-line'; d.innerHTML = '<span class="pm-dot"></span>'; d.appendChild(document.createTextNode(event + '  ' + JSON.stringify(detail || {}))); l.prepend(d); }
  }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'pm-toast'; t.textContent = msg; document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  }
  function confirmDialog(msg, onYes) {
    var ov = document.createElement('div'); ov.className = 'pm-ovl';
    ov.innerHTML = '<div class="pm-dlg"><div class="pm-dlg-msg"></div><div class="pm-dlg-btns"><button class="pm-dlg-cancel">Annuler</button><button class="pm-dlg-ok">Confirmer</button></div></div>';
    ov.querySelector('.pm-dlg-msg').textContent = msg; document.body.appendChild(ov);
    function close() { ov.remove(); }
    ov.querySelector('.pm-dlg-cancel').addEventListener('click', close);
    ov.querySelector('.pm-dlg-ok').addEventListener('click', function () { close(); onYes(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  }
  // Styled text-input dialog (replaces the native window.prompt for sharing).
  function promptDialog(msg, placeholder, okLabel, onConfirm) {
    var ov = document.createElement('div'); ov.className = 'pm-ovl';
    ov.innerHTML = '<div class="pm-dlg"><div class="pm-dlg-msg"></div><input class="pm-dlg-input" type="text"><div class="pm-dlg-btns"><button class="pm-dlg-cancel">Annuler</button><button class="pm-dlg-ok pm-dlg-go"></button></div></div>';
    ov.querySelector('.pm-dlg-msg').textContent = msg;
    var input = ov.querySelector('.pm-dlg-input'); input.placeholder = placeholder || '';
    ov.querySelector('.pm-dlg-go').textContent = okLabel || 'Confirmer';
    document.body.appendChild(ov);
    setTimeout(function () { input.focus(); }, 50);
    function close() { ov.remove(); }
    function go() { var v = input.value.trim(); close(); onConfirm(v); }
    ov.querySelector('.pm-dlg-cancel').addEventListener('click', close);
    ov.querySelector('.pm-dlg-go').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') go(); else if (e.key === 'Escape') close(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  }
  // One-time prompt asking the rep's first name, so every event they trigger
  // (and every client event on a link they later share) can be credited to
  // them. Cancelling just closes the dialog, it never blocks whatever the
  // rep was trying to do.
  function askRep(onDone) {
    var ov = document.createElement('div'); ov.className = 'pm-ovl';
    ov.innerHTML = '<div class="pm-dlg pm-share">'
      + '<div class="pm-dlg-title">Votre prénom</div>'
      + '<div class="pm-dlg-sub">Une seule fois : votre prénom permet de suivre l’usage des decks par commercial.</div>'
      + '<input class="pm-dlg-input" type="text" placeholder="Prénom">'
      + '<div class="pm-dlg-btns"><button class="pm-dlg-cancel">Annuler</button><button class="pm-dlg-go">Confirmer</button></div>'
      + '</div>';
    var input = ov.querySelector('.pm-dlg-input');
    document.body.appendChild(ov);
    setTimeout(function () { input.focus(); }, 50);
    // Every exit path continues to onDone: declining to give a name must never
    // block the action the rep was in the middle of (sharing, editing).
    function finish() { ov.remove(); if (onDone) onDone(); }
    function go() {
      var v = input.value.trim();
      if (v) {
        try { localStorage.setItem('ay-rep', v); } catch (e) {}
        AY_REP = v;
      }
      finish();
    }
    ov.querySelector('.pm-dlg-cancel').addEventListener('click', finish);
    ov.querySelector('.pm-dlg-go').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') go(); else if (e.key === 'Escape') finish(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) finish(); });
  }
  function ICO(p, s) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (s || 15) + '" height="' + (s || 15) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var ICON = {
    eye: ICO('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: ICO('<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>'),
    contrast: ICO('<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12z"/>', 14),
    type: ICO('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>', 14),
    layers: ICO('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 9.5-3.48 1.59a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84L17.92 9.5"/>', 14),
    download: ICO('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>', 14),
    save: ICO('<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>', 14),
    activity: ICO('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', 14),
    note: ICO('<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/><path d="M9 13h6"/><path d="M9 17h4"/>', 15),
    grip: ICO('<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>', 14)
  };

  var slides = document.querySelectorAll('.slide');
  var deckKey = location.pathname.replace(/\//g, '') || 'deck';
  function slideIndex(el) { var s = el.closest('.slide'); return s ? Array.prototype.indexOf.call(slides, s) + 1 : 0; }
  // Human-readable slide label for analytics: the slide's heading, else its
  // chapter, else "slide N". Lets Umami show which slide, not just a number.
  function slideTitle(s) {
    if (!s) return '';
    var t = s.querySelector('.slide-title, .value-detail-title, .section-title, .intro-title-band, .intro-title, h1, h2');
    var txt = t ? (t.textContent || '').replace(/\s+/g, ' ').trim() : '';
    return txt.slice(0, 60) || s.dataset.chapter || ('slide ' + (Array.prototype.indexOf.call(slides, s) + 1));
  }
  function fieldName(el) { var b = (el.className || el.tagName).toString().split(' ')[0].replace(/[^a-z0-9_-]/gi, '') || el.tagName.toLowerCase(); return b + '@s' + slideIndex(el); }
  // stable path (deck DOM is static across reloads): "slideIdx:child-child-..."
  function elPath(el) { var s = el.closest('.slide'); if (!s) return null; var si = Array.prototype.indexOf.call(slides, s), idx = [], n = el; while (n && n !== s) { idx.unshift(Array.prototype.indexOf.call(n.parentElement.children, n)); n = n.parentElement; } return si + ':' + idx.join('-'); }
  function resolve(key) { var pr = key.split(':'), s = slides[+pr[0]]; if (!s) return null; var n = s; if (pr[1]) pr[1].split('-').forEach(function (i) { n = n && n.children[+i]; }); return n; }
  function elName(el, key) { return el ? (el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')) : key; }

  var INLINE = { STRONG: 1, EM: 1, B: 1, I: 1, A: 1, SPAN: 1, BR: 1, SUP: 1, SUB: 1, SMALL: 1, U: 1, MARK: 1, ABBR: 1 };
  function isTextLeaf(el) {
    if (el.closest('#pm-panel') || !(el.innerText || '').trim() || /^(IMG|SVG|CANVAS|INPUT|BUTTON)$/.test(el.tagName)) return false;
    for (var i = 0; i < el.children.length; i++) { var c = el.children[i]; if (!INLINE[c.tagName] && (c.innerText || '').trim()) return false; }
    return true;
  }
  function editableEls() {
    var out = [];
    slides.forEach(function (s) { s.querySelectorAll('*').forEach(function (el) { if (isTextLeaf(el)) out.push(el); }); });
    return out.filter(function (el) { return !out.some(function (o) { return o !== el && o.contains(el); }); });
  }

  // ---- live state (auto-saved as draft; named saves are snapshots) ----
  function blank() { return { text: {}, masked: [], opacity: {}, slidesHidden: [] }; }
  var state = blank();
  function autosave() { try { localStorage.setItem('pm:draft:' + deckKey, JSON.stringify(state)); } catch (e) { } }
  function getSaves() { try { return JSON.parse(localStorage.getItem('pm:saves:' + deckKey) || '{}'); } catch (e) { return {}; } }
  function setSaves(o) { try { localStorage.setItem('pm:saves:' + deckKey, JSON.stringify(o)); } catch (e) { } }
  // UTF-8 safe base64 of the state -> a shareable "?pm=" link. The export
  // pipeline (and any viewer) replays it through applyState, so personalization
  // lives in the URL and is rendered headlessly without re-implementing it.
  function pmEncode(st) { return btoa(unescape(encodeURIComponent(JSON.stringify(st)))); }
  function pmDecode(s) { return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  function pmLink() { return location.origin + location.pathname + '?pm=' + encodeURIComponent(pmEncode(state)); }

  var mode = null, selected = null;
  function deselect() { if (selected) { selected.style.outline = ''; selected = null; } document.getElementById('pm-style').style.display = 'none'; }
  function clearEditable() { editableEls().forEach(function (el) { el.style.outline = ''; el.style.cursor = ''; el.contentEditable = 'false'; }); deselect(); }
  function bindText(el) {
    if (el.dataset.pmBound) return; el.dataset.pmBound = '1'; var t;
    // Snapshot the text as it was when first made editable, so each edit event
    // can report what it changed from -> to (truncated for analytics).
    if (el.dataset.pmOrig === undefined) el.dataset.pmOrig = (el.innerText || '').replace(/\s+/g, ' ').trim();
    el.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { var k = elPath(el); state.text[k] = el.innerHTML; autosave(); track('deck_field_edit', { field: fieldName(el), slide: slideIndex(el), title: slideTitle(el.closest('.slide')), before: (el.dataset.pmOrig || '').slice(0, 500), after: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 500) }); }, 500); });
    el.addEventListener('keydown', function (e) { e.stopPropagation(); });
  }
  function applyMode(m) {
    mode = m; clearEditable();
    if (m === 'text') editableEls().forEach(function (el) { el.contentEditable = 'true'; el.style.outline = '2px dashed rgba(15,167,226,.9)'; el.style.outlineOffset = '2px'; el.style.cursor = 'text'; bindText(el); });
  }

  function updateHideBtn() { var b = document.getElementById('pm-hide'); if (b) b.textContent = (selected && selected.style.display === 'none') ? 'Démasquer' : 'Masquer'; }
  function selectEl(el) {
    if (!el || el === document.body || el.closest('#pm-panel')) return;
    if (selected) selected.style.outline = '';
    selected = el; el.style.outline = '2px solid #0ab38c'; el.style.outlineOffset = '2px';
    document.getElementById('pm-style').style.display = 'block';
    document.getElementById('pm-selname').textContent = elName(el);
    var cur = Math.round((parseFloat(getComputedStyle(el).opacity) || 1) * 100);
    document.getElementById('pm-opacity').value = cur; document.getElementById('pm-opval').textContent = cur + '%';
    updateHideBtn();
  }
  function isRow(p) { var k = Array.prototype.filter.call(p.children, function (c) { return c.offsetWidth > 0 && c.offsetHeight > 0; }); if (k.length < 2) return false; var r0 = k[0].getBoundingClientRect(), r1 = k[1].getBoundingClientRect(); return Math.abs(r0.top - r1.top) < r0.height && r1.left > r0.left + 3; }
  function pickBlock(el) { var slide = el.closest('.slide'); if (!slide) return el; var n = el; while (n && n.parentElement && n !== slide) { var p = n.parentElement; if (p === slide || p.closest('#pm-panel')) break; if (isRow(p)) return n; n = p; } return el; }
  // Center remaining columns with minimal change: keep the grid, just narrow it to
  // the visible cards (at their original width) and center the group. Restore on un-hide.
  function recenterRow(row) {
    if (!row) return;
    var grid = getComputedStyle(row).display.indexOf('grid') >= 0;
    if (row.dataset.pmGTC === undefined) {
      row.dataset.pmGTC = row.style.gridTemplateColumns || '__none__';
      row.dataset.pmJC2 = row.style.justifyContent || '__none__';
      var c0 = Array.prototype.filter.call(row.children, function (c) { return c.offsetWidth > 0; })[0];
      row.dataset.pmCardW = c0 ? c0.offsetWidth : 0;
    }
    var n = Array.prototype.filter.call(row.children, function (c) { return getComputedStyle(c).display !== 'none'; }).length;
    if (grid && +row.dataset.pmCardW > 0) row.style.gridTemplateColumns = 'repeat(' + n + ', ' + row.dataset.pmCardW + 'px)';
    row.style.justifyContent = 'center';
  }
  function restoreRow(row) {
    if (!row) return;
    var anyMasked = Array.prototype.some.call(row.children, function (c) { return c.style.display === 'none'; });
    if (anyMasked || row.dataset.pmGTC === undefined) return;
    row.style.gridTemplateColumns = row.dataset.pmGTC === '__none__' ? '' : row.dataset.pmGTC;
    row.style.justifyContent = row.dataset.pmJC2 === '__none__' ? '' : row.dataset.pmJC2;
    delete row.dataset.pmGTC; delete row.dataset.pmJC2; delete row.dataset.pmCardW;
  }

  function maskEl(el) { var k = elPath(el); el.dataset.pmPrev = el.style.display; el.style.display = 'none'; recenterRow(el.parentElement); if (state.masked.indexOf(k) < 0) state.masked.push(k); }
  function unmaskKey(k) { var el = resolve(k); if (el) { el.style.display = el.dataset.pmPrev || ''; restoreRow(el.parentElement); } state.masked = state.masked.filter(function (x) { return x !== k; }); }

  document.addEventListener('click', function (e) {
    if (mode !== 'style' || e.target.closest('#pm-panel') || !e.target.closest('.slide')) return;
    e.preventDefault(); e.stopPropagation();
    var blk = pickBlock(e.target);
    if (selected === blk) { deselect(); return; }
    selectEl(blk);
  }, true);
  document.addEventListener('click', function (e) { var a = e.target.closest('a[href]'); if (a) track('deck_link_click', { href: a.href, slide: slideIndex(a) }); });
  // Dwell time per slide + deck-completed. When the active slide changes we log
  // how long the PREVIOUS slide was on screen (deck_slide_time), but only if it
  // was dwelt on >= 5s: below that is a glance, not a read, so it stays out of
  // the timeline. The exact seconds ride in the event for depth analysis.
  // Reaching the last slide fires deck_completed once.
  var _curSlide = null, _curEnter = 0, _curTitle = '', _completed = false;
  // Per-session read state, built up alongside the per-slide dwell events:
  // _readMap accumulates seconds per slide across re-visits, _maxSlide is the
  // furthest slide reached, _lastReadSent dedupes the deck_read summary below.
  var _readMap = {}, _maxSlide = 0, _lastReadSent = '';
  function flushSlideTime() {
    if (_curSlide === null) return;
    var secs = Math.round((Date.now() - _curEnter) / 1000);
    // Accumulate every visit's dwell into the read map regardless of the 5s
    // threshold below, the deck_read summary needs the true total even if no
    // single visit counts as a "read" on its own.
    if (secs > 0) _readMap[_curSlide] = (_readMap[_curSlide] || 0) + secs;
    // Only log slides the visitor actually read (>= 5s), so quick glances and
    // fly-through navigation don't flood the session timeline with events.
    if (secs >= 5 && secs < 3600) track('deck_slide_time', { slide: _curSlide + 1, title: _curTitle, seconds: secs });
  }
  // Session-level "how much of this deck did they actually read" summary, sent
  // once per meaningful change on tab-hide/close rather than per slide.
  function readSummary() {
    var slidesSeen = 0, total = 0, top = 0, topSecs = 0;
    for (var k in _readMap) {
      if (!_readMap.hasOwnProperty(k)) continue;
      var v = _readMap[k];
      if (v >= 2) slidesSeen++;
      total += v;
      if (v > topSecs) { topSecs = v; top = +k; }
    }
    if (total > 3600) total = 3600;
    return {
      max_slide: _maxSlide + 1,
      slides_seen: slidesSeen,
      total_slides: slides.length,
      pct_read: Math.round(100 * slidesSeen / slides.length),
      seconds_total: total,
      top_slide: top + 1,
      top_seconds: topSecs
    };
  }
  function sendReadSummary() {
    var summary = readSummary();
    // A sub-second visibility flip has nothing to say: skip empty summaries.
    if (!summary.seconds_total && !summary.slides_seen) return;
    var snap = JSON.stringify(summary);
    if (snap === _lastReadSent) return;
    _lastReadSent = snap;
    track('deck_read', summary);
  }
  function onSlideActive(s, i) {
    if (_curSlide === i) return;
    flushSlideTime();
    _curSlide = i; _curEnter = Date.now(); _curTitle = slideTitle(s);
    if (i > _maxSlide) _maxSlide = i;
    if (i === slides.length - 1 && !_completed) { _completed = true; track('deck_completed', { slides: slides.length }); }
  }
  slides.forEach(function (s, i) { new MutationObserver(function () { if (s.classList.contains('active')) onSlideActive(s, i); }).observe(s, { attributes: true, attributeFilter: ['class'] }); });
  // Seed the tracker with the slide already active at load: the observers only
  // fire on a class CHANGE, so without this the first slide's dwell is
  // invisible until the visitor navigates once (most client opens never do).
  function seedActiveSlide() { slides.forEach(function (s, i) { if (s.classList.contains('active') && _curSlide !== i) { _curSlide = i; _curEnter = Date.now(); _curTitle = slideTitle(s); if (i > _maxSlide) _maxSlide = i; } }); }
  seedActiveSlide();
  // Flush the final slide's time when the tab is hidden or closed, then send
  // the deck_read summary (Umami's tracker uses keepalive, so this is safe on
  // pagehide too). Coming back re-arms the dwell clock on the current slide,
  // otherwise the rest of the visit would go uncounted until a navigation.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { flushSlideTime(); _curSlide = null; sendReadSummary(); }
    else if (document.visibilityState === 'visible' && _curSlide === null) seedActiveSlide();
  });
  window.addEventListener('pagehide', function () { flushSlideTime(); sendReadSummary(); });

  function sec(id, icon, title, extra, body) { return '<div class="pm-acc" data-sec="' + id + '"><div class="pm-achead">' + icon + ' <span>' + title + '</span>' + (extra || '') + ICO('<path d="m6 9 6 6 6-6"/>', 16) + '</div><div class="pm-acbody">' + body + '</div></div>'; }
  var panel = document.createElement('div'); panel.id = 'pm-panel';
  panel.innerHTML =
    '<div class="pm-h" id="pm-drag">' + ICON.grip + ' Personnalisation</div><div class="pm-body">' +
    sec('text', ICON.type, 'Texte', '', '<div class="pm-hint">Cliquez un texte (titre, chiffre, description) et tapez.</div>') +
    sec('visual', ICON.contrast, 'Visuel', '',
      '<div class="pm-hint">Cliquez un bloc (colonne, carte, image).</div>' +
      '<div id="pm-style"><div class="pm-elname">Élément : <b id="pm-selname">—</b></div>' +
      '<div class="pm-row2"><button id="pm-hide" class="pm-mini">Masquer</button><button id="pm-deselect" class="pm-mini">Désélectionner</button></div>' +
      '<div class="pm-oprow"><span class="pm-oplab">Opacité</span><input type="range" id="pm-opacity" min="0" max="100" value="100"><span id="pm-opval">100%</span></div></div>' +
      '<div id="pm-maskedwrap"><div class="pm-modhd">Éléments masqués</div><div id="pm-masked"></div></div>') +
    sec('slides', ICON.layers, 'Slides', '<span id="pm-count" class="pm-count"></span>', '<div id="pm-slides"></div>') +
    sec('versions', ICON.save, 'Versions', '',
      '<div class="pm-hint">Sauvegardez vos modifications sous un nom. Vos retouches sont aussi gardées automatiquement après un refresh.</div>' +
      '<div class="pm-vrow"><input id="pm-vname" placeholder="Nom de la version" /><button id="pm-vsave" class="pm-mini">Enregistrer</button></div>' +
      '<div id="pm-saves"></div><button id="pm-vreset" class="pm-mini pm-reset">Réinitialiser le deck</button>') +
    sec('events', ICON.activity, 'Évènements (GA4)', '', '<div id="pm-log" class="pm-log"></div>') +
    '</div>';
  panel.style.display = 'none';
  document.body.appendChild(panel);
  // keystrokes inside the panel (e.g. typing a version name) must not reach the deck's nav
  panel.addEventListener('keydown', function (e) { e.stopPropagation(); });
  panel.addEventListener('keyup', function (e) { e.stopPropagation(); });

  var css = document.createElement('style');
  css.textContent =
    '#pm-panel{position:fixed;top:14px;right:14px;width:300px;max-height:92vh;flex-direction:column;z-index:99999;background:#fff;border-radius:16px;box-shadow:0 18px 50px rgba(2,30,60,.32);font-family:system-ui,Arial,sans-serif;font-size:13px;color:#13324d;border:1px solid rgba(0,61,121,.08);overflow:hidden}' +
    '.pm-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(10px);z-index:100000;background:#003d79;color:#fff;font-family:system-ui,Arial,sans-serif;font-size:13px;font-weight:600;padding:11px 20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.28);opacity:0;transition:opacity .25s,transform .25s;pointer-events:none}.pm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}' +
    '.pm-ovl{position:fixed;inset:0;z-index:100000;background:rgba(8,24,44,.45);display:flex;align-items:center;justify-content:center;font-family:system-ui,Arial,sans-serif}.pm-dlg{background:#fff;border-radius:16px;padding:22px;max-width:340px;box-shadow:0 24px 70px rgba(0,0,0,.32)}.pm-dlg-msg{font-size:14px;color:#13324d;margin-bottom:18px;line-height:1.5}.pm-dlg-btns{display:flex;gap:10px;justify-content:flex-end}.pm-dlg button{font-size:13px;font-weight:700;border-radius:9px;padding:9px 18px;cursor:pointer;border:0}.pm-dlg-cancel{background:#eef3f8;color:#34495c}.pm-dlg-ok{background:#c0392b;color:#fff}.pm-dlg-input{width:100%;box-sizing:border-box;border:1px solid #cfd9e3;border-radius:9px;padding:10px 12px;font-size:14px;margin-bottom:16px;font-family:inherit}.pm-dlg-input:focus{outline:none;border-color:#0fa7e2}.pm-dlg-go{background:#0fa7e2!important;color:#fff!important}.pm-share{max-width:400px;padding:26px;text-align:left}.pm-share-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#11a9e6,#0ab38c);color:#fff;margin-bottom:15px}.pm-dlg-title{font-size:17px;font-weight:800;color:#0e2438;margin-bottom:6px}.pm-dlg-sub{font-size:13px;color:#5b7085;line-height:1.5;margin-bottom:16px}.pm-dlg-go:hover{filter:brightness(1.06)}.pm-dlg-cancel:hover{background:#e3ebf2}' +
    '#pm-dlpop{position:fixed;bottom:58px;left:14px;z-index:100000;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(2,30,60,.3);display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(0,61,121,.08);font-family:system-ui,Arial,sans-serif}#pm-dlpop.show{display:flex}#pm-dlpop .pm-dlbtn{display:flex;align-items:center;gap:9px;padding:12px 18px;background:#fff;border:0;font-size:13px;font-weight:600;color:#003d79;cursor:pointer;white-space:nowrap}#pm-dlpop .pm-dlbtn:hover{background:#f2f6fa}#pm-dlpop .pm-dlbtn+.pm-dlbtn{border-top:1px solid #eef1f5}#pm-dlpop svg{vertical-align:-2px}' +
    '#pm-panel .pm-h{font-weight:800;font-size:14px;padding:13px 16px;display:flex;gap:8px;align-items:center;cursor:grab;background:linear-gradient(135deg,#003d79,#0ab38c);color:#fff;user-select:none}' +
    '#pm-panel .pm-tag{background:rgba(255,255,255,.25);font-size:10px;padding:2px 8px;border-radius:20px;font-weight:700;margin-left:auto}' +
    '#pm-panel .pm-body{overflow:auto}#pm-panel .pm-acc{border-top:1px solid #eef1f5}' +
    '#pm-panel .pm-achead{display:flex;align-items:center;gap:9px;padding:12px 16px;cursor:pointer;font-weight:700;font-size:13px;user-select:none}#pm-panel .pm-achead:hover{background:#f6f9fc}#pm-panel .pm-acc.open>.pm-achead{color:#0ab38c}' +
    '#pm-panel .pm-achead .pm-count{margin-left:6px;color:#0ab38c;font-weight:700;font-size:11px}#pm-panel .pm-achead>svg:last-of-type{margin-left:auto;transition:transform .2s;opacity:.5}#pm-panel .pm-acc.open .pm-achead>svg:last-of-type{transform:rotate(180deg)}' +
    '#pm-panel .pm-acbody{display:none;padding:2px 0 12px}#pm-panel .pm-acc.open .pm-acbody{display:block}' +
    '#pm-panel .pm-hint{font-size:11.5px;color:#7c8ea0;font-style:italic;padding:0 16px 6px}' +
    '#pm-panel #pm-style{display:none;padding:0 16px}#pm-panel .pm-elname{font-size:11px;color:#56697a;margin:6px 0}' +
    '#pm-panel .pm-row{display:flex;gap:8px;padding:0 16px}#pm-panel .pm-row2{display:flex;gap:8px;margin:2px 0 8px}' +
    '#pm-panel .pm-btn{flex:1;padding:10px;border:0;border-radius:10px;background:#0fa7e2;color:#fff;font-weight:700;cursor:pointer}' +
    '#pm-panel .pm-mini{font-size:11.5px;background:#fff;border:1px solid #cfd9e3;border-radius:8px;padding:7px 11px;cursor:pointer;color:#34495c;font-weight:600}#pm-panel .pm-mini:hover{border-color:#0fa7e2;color:#0fa7e2}' +
    '#pm-panel .pm-oprow{display:flex;align-items:center;gap:8px}#pm-panel .pm-oplab{font-size:11px;color:#56697a}#pm-panel #pm-opacity{flex:1}#pm-panel #pm-opval{width:42px;text-align:right;font-weight:700}' +
    '#pm-panel #pm-maskedwrap{display:none;padding:6px 16px 0}#pm-panel .pm-modhd{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:#7c8ea0;font-weight:700;margin-bottom:4px}#pm-panel .pm-modrow{display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:3px 0;gap:8px}#pm-panel .pm-modrow span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#pm-panel .pm-vrow{display:flex;gap:8px;padding:0 16px 8px}#pm-panel #pm-vname{flex:1;border:1px solid #cfd9e3;border-radius:8px;padding:7px 10px;font-size:12px}#pm-panel #pm-saves{padding:0 16px}#pm-panel .pm-reset{margin:8px 16px 0;color:#c0392b;border-color:#e8c4be}' +
    '#pm-panel #pm-slides{display:flex;flex-direction:column;gap:1px;max-height:200px;overflow:auto;padding:0 8px}#pm-panel .pm-srow{display:flex;gap:8px;align-items:center;font-size:12px;padding:4px 8px;border-radius:7px}#pm-panel .pm-srow:hover{background:#f2f6fa}#pm-panel .pm-srow.pm-hidden .pm-sname{opacity:.4;text-decoration:line-through}#pm-panel .pm-eye{cursor:pointer;display:inline-flex}' +
    '#pm-panel .pm-fixed{border-top:1px solid #eef1f5;padding:12px 16px;background:#fafcfe}#pm-panel .pm-fxhd{display:flex;align-items:center;gap:9px;font-weight:700;font-size:13px;margin-bottom:9px}#pm-panel .pm-fixed .pm-row{padding:0}' +
    '#pm-panel .pm-log{background:#0e1b2a;color:#cfe8ff;border-radius:10px;margin:0 16px;padding:9px;font-family:ui-monospace,monospace;font-size:11px;line-height:1.5;max-height:200px;overflow:auto}#pm-panel .pm-log-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid rgba(255,255,255,.06);padding:2px 0}' +
    '#pm-panel svg{vertical-align:-2px;flex:none}#pm-panel .pm-h svg{opacity:.85}#pm-panel .pm-modrow svg{margin-right:3px}#pm-panel .pm-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#0fa7e2;margin-right:7px;vertical-align:1px}';
  document.head.appendChild(css);

  function renderMasked() {
    var wrap = document.getElementById('pm-maskedwrap'), box = document.getElementById('pm-masked');
    box.innerHTML = ''; wrap.style.display = state.masked.length ? 'block' : 'none';
    state.masked.forEach(function (k) { var el = resolve(k); var r = document.createElement('div'); r.className = 'pm-modrow'; r.innerHTML = '<span>' + ICON.eyeOff + ' ' + elName(el, k) + '</span><button class="pm-mini" data-k="' + k + '">Démasquer</button>'; box.appendChild(r); });
  }
  var list = document.getElementById('pm-slides');
  function updateCount() { var v = Array.prototype.filter.call(slides, function (s) { return s.dataset.pmHidden !== '1'; }).length; document.getElementById('pm-count').textContent = v + '/' + slides.length; }
  function renderSlides() {
    list.innerHTML = '';
    slides.forEach(function (s, i) { var hidden = s.dataset.pmHidden === '1'; var r = document.createElement('div'); r.className = 'pm-srow' + (hidden ? ' pm-hidden' : ''); r.innerHTML = '<span class="pm-eye" data-i="' + i + '">' + (hidden ? ICON.eyeOff : ICON.eye) + '</span><span class="pm-sname">' + (i + 1) + '. ' + (s.dataset.chapter || 'slide') + '</span>'; list.appendChild(r); });
    updateCount();
  }
  function renderSaves() {
    var box = document.getElementById('pm-saves'), o = getSaves(); box.innerHTML = '';
    Object.keys(o).forEach(function (name) { var r = document.createElement('div'); r.className = 'pm-modrow'; r.innerHTML = '<span>' + ICON.save + ' ' + name + '</span><span><button class="pm-mini" data-load="' + name + '">Charger</button> <button class="pm-mini" data-del="' + name + '">✕</button></span>'; box.appendChild(r); });
  }

  function applyState(st) {
    state = Object.assign(blank(), st || {});
    Object.keys(state.text).forEach(function (k) { var el = resolve(k); if (el) { el.innerHTML = state.text[k]; bindText(el); } });
    Object.keys(state.opacity).forEach(function (k) { var el = resolve(k); if (el) { el.style.setProperty('animation', 'none', 'important'); el.style.setProperty('opacity', state.opacity[k] / 100, 'important'); } });
    state.masked.forEach(function (k) { var el = resolve(k); if (el && el.style.display !== 'none') { el.dataset.pmPrev = el.style.display; el.style.display = 'none'; recenterRow(el.parentElement); } });
    state.slidesHidden.forEach(function (i) { if (slides[i]) slides[i].dataset.pmHidden = '1'; });
    renderMasked(); renderSlides(); autosave();
  }

  // ---- notes (retours terrain saisis pendant un rendez-vous) ----
  // Gardées par deck à côté du brouillon de personnalisation, puis reprises
  // dans le journal de retours de l'offre. Volontairement anonymes : une note
  // porte la slide visée, jamais qui l'a écrite.
  function getNotes() { try { return JSON.parse(localStorage.getItem('pm:notes:' + deckKey) || '[]'); } catch (e) { return []; } }
  function setNotes(a) { try { localStorage.setItem('pm:notes:' + deckKey, JSON.stringify(a)); } catch (e) { } }
  function activeSlide() { return document.querySelector('.slide.active') || slides[0]; }
  // Une note n'est pas une retouche, elle ne vit donc pas dans le panneau de
  // personnalisation. Elle vit dans une fenetre separee, gardee sur l'ecran du
  // commercial pendant que le client voit l'onglet du deck : partager un onglet
  // ou une fenetre, plutot que tout l'ecran, suffit a la garder privee, meme
  // sans second ecran. Aucun apercu de slide ici, le deck du client garde donc
  // sa taille, et rien n'est reserve aux slides qui n'ont pas de note.
  var pmWin = null, pmTick = null;
  // Habillage repris du panneau de personnalisation : meme degrade d'en-tete,
  // memes boutons, memes cartes, pour que la fenetre de notes ne ressemble pas
  // a une page a part.
  var PRES_CSS = '*{box-sizing:border-box}'
    + 'body{margin:0;font-family:system-ui,Arial,sans-serif;font-size:13px;color:#13324d;background:#fff;display:flex;flex-direction:column;height:100vh;overflow:hidden}'
    + '.hd{background:linear-gradient(135deg,#003d79,#0ab38c);color:#fff;padding:13px 16px;display:flex;gap:9px;align-items:flex-start}'
    + '.hd svg{flex:none;margin-top:1px;opacity:.9}.hd b{font-weight:800;font-size:14px;display:block;line-height:1.2}'
    + '.hd span{font-size:11.5px;opacity:.88;display:block;margin-top:3px;line-height:1.35}'
    + '.bd{flex:1;overflow:auto;padding:14px 16px}'
    + 'textarea{width:100%;min-height:96px;border:1px solid #cfd9e3;border-radius:10px;padding:9px 11px;font:inherit;font-size:13px;line-height:1.45;resize:vertical;color:#13324d}'
    + 'textarea:focus{outline:none;border-color:#0fa7e2}'
    + '.gen{display:flex;align-items:center;gap:8px;margin:10px 0 11px;font-size:12px;color:#56697a;user-select:none;cursor:pointer}'
    + '.gen input{accent-color:#0fa7e2;width:15px;height:15px;cursor:pointer}'
    + '.go{width:100%;padding:11px;border:0;border-radius:10px;background:#0fa7e2;color:#fff;font-weight:700;font-size:13px;cursor:pointer}'
    + '.go:hover{background:#0d96cb}'
    + '.hint{font-size:11.5px;color:#7c8ea0;font-style:italic;margin:14px 0 6px}'
    + '.nrow{position:relative;background:#fff6d5;border-radius:3px;padding:10px 34px 12px 12px;margin-bottom:9px;box-shadow:0 2px 7px rgba(122,92,12,.16)}'
    + '.nrow::after{content:"";position:absolute;right:0;bottom:0;width:0;height:0;border-style:solid;border-width:0 0 15px 15px;border-color:transparent transparent #fff transparent}'
    + '.nmeta{font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:#a17c17;font-weight:700;margin-bottom:3px}'
    + '.ntxt{font-size:12.5px;white-space:pre-wrap;line-height:1.45;color:#4a3a10}'
    + '.ndel{position:absolute;top:6px;right:6px;background:rgba(122,92,12,.12);border:0;border-radius:6px;color:#7a5c0c;padding:2px 6px;line-height:1;cursor:pointer;font-size:11px}'
    + '.ndel:hover{background:rgba(192,57,43,.16);color:#c0392b}'
    + '.ft{border-top:1px solid #eef1f5;background:#fafcfe;padding:11px 16px;display:flex;gap:8px}'
    + '.ft button{flex:1;font-size:11.5px;background:#fff;border:1px solid #cfd9e3;border-radius:8px;padding:8px 6px;cursor:pointer;color:#34495c;font-weight:600;display:flex;align-items:center;justify-content:center;gap:5px}'
    + '.ft button:hover{border-color:#0fa7e2;color:#0fa7e2}.ft svg{flex:none}';
  function presBody() {
    return '<div class="hd">' + ICON.note + '<div><b id="p-slide">Slide</b><span id="p-title"></span></div></div>'
      + '<div class="bd"><textarea id="p-text" placeholder="' + "Ce que dit le client, ce qu'il faut changer..." + '"></textarea>'
      + '<label class="gen"><input type="checkbox" id="p-gen"> ' + "Note générale, sans slide" + '</label>'
      + '<button class="go" id="p-add">Noter</button>'
      + '<div class="hint" id="p-hint"></div><div id="p-list"></div></div>'
      + '<div class="ft"><button id="p-prev">' + ICO('<path d="m15 18-6-6 6-6"/>', 13) + 'Slide</button>'
      + '<button id="p-next">Slide' + ICO('<path d="m9 18 6-6-6-6"/>', 13) + '</button>'
      + '<button id="p-copy">' + ICO('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>', 13) + 'Copier</button>'
      + '<button id="p-dl">' + ICO('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>', 13) + 'Fichier</button></div>';
  }

  function notesMarkdown() {
    var a = getNotes(), nl = String.fromCharCode(10);
    var out = ['# Notes, ' + deckKey + ', ' + new Date().toISOString().slice(0, 10), ''];
    a.forEach(function (n) {
      out.push(n.slide ? ('## Slide ' + n.slide + ', ' + n.title) : '## Note générale');
      out.push(n.text, '');
    });
    return out.join(nl);
  }
  function presRender() {
    if (!pmWin || pmWin.closed) return;
    var d = pmWin.document, box = d.getElementById('p-list'), a = getNotes();
    var hint = d.getElementById('p-hint');
    hint.textContent = a.length ? (a.length + (a.length > 1 ? ' notes prises' : ' note prise')) : "Aucune note pour l'instant.";
    box.innerHTML = '';
    a.forEach(function (n, i) {
      var r = d.createElement('div'); r.className = 'nrow';
      r.innerHTML = '<div class="nmeta"></div><div class="ntxt"></div><button class="ndel" data-ndel="' + i + '">&#10005;</button>';
      r.querySelector('.nmeta').textContent = n.slide ? ('Slide ' + n.slide + ' · ' + n.title) : 'Note générale';
      r.querySelector('.ntxt').textContent = n.text;
      box.appendChild(r);
    });
  }
  function presSyncHead() {
    if (!pmWin || pmWin.closed) return;
    var sl = activeSlide(), idx = Array.prototype.indexOf.call(slides, sl) + 1;
    var t = pmWin.document.getElementById('p-slide');
    if (!t) return;
    t.textContent = 'Slide ' + idx;
    pmWin.document.getElementById('p-title').textContent = slideTitle(sl);
  }
  function presAdd() {
    var d = pmWin.document, ta = d.getElementById('p-text'), txt = (ta.value || '').trim();
    if (!txt) { ta.focus(); return; }
    var general = d.getElementById('p-gen').checked;
    var sl = activeSlide(), idx = general ? 0 : Array.prototype.indexOf.call(slides, sl) + 1;
    var ti = general ? 'Note générale' : slideTitle(sl);
    var a = getNotes(); a.push({ slide: idx, title: ti, text: txt, ts: new Date().toISOString() });
    setNotes(a); ta.value = ''; ta.focus(); presRender();
    track('deck_note', { slide: idx, title: ti, note: txt.slice(0, 500) });
  }
  function presMount(w) {
    pmWin = w;
    var d = w.document;
    d.head.innerHTML = '<meta charset="utf-8"><title>Notes</title><style>' + PRES_CSS + '</style>';
    d.body.innerHTML = presBody();
    d.getElementById('p-add').addEventListener('click', presAdd);
    d.getElementById('p-text').addEventListener('keydown', function (e) {
      // Entree envoie la note, Maj+Entree passe a la ligne.
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); presAdd(); }
    });
    d.getElementById('p-list').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ndel]'); if (!b) return;
      var a = getNotes(); a.splice(+b.dataset.ndel, 1); setNotes(a); presRender();
    });
    d.getElementById('p-prev').addEventListener('click', function () { prevSlide(); presSyncHead(); });
    d.getElementById('p-next').addEventListener('click', function () { nextSlide(); presSyncHead(); });
    d.getElementById('p-copy').addEventListener('click', function () {
      if (!getNotes().length) return;
      try { w.navigator.clipboard.writeText(notesMarkdown()); } catch (e) { }
    });
    d.getElementById('p-dl').addEventListener('click', function () {
      if (!getNotes().length) return;
      // Le telechargement part de la fenetre des notes, jamais de l'onglet
      // partage, pour qu'aucune barre de telechargement n'apparaisse chez le client.
      var blob = new w.Blob([notesMarkdown()], { type: 'text/markdown;charset=utf-8' });
      var url = w.URL.createObjectURL(blob), a = d.createElement('a');
      a.href = url; a.download = 'notes-' + deckKey + '-' + new Date().toISOString().slice(0, 10) + '.md';
      d.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { w.URL.revokeObjectURL(url); }, 2000);
    });
    w.addEventListener('pagehide', function () { pmWin = null; clearInterval(pmTick); pmTick = null; });
    presRender(); presSyncHead();
    d.getElementById('p-text').focus();
    // La fenetre suit la slide affichee sans que le commercial ait a y penser.
    clearInterval(pmTick);
    pmTick = setInterval(function () {
      if (!pmWin || pmWin.closed) { clearInterval(pmTick); pmTick = null; return; }
      presSyncHead();
    }, 400);
    track('deck_notes_open', { deck: deckKey });
  }
  function openPresenter() {
    if (pmWin && !pmWin.closed) { pmWin.focus(); return; }
    // Document Picture-in-Picture : fenetre sans barre d'adresse, toujours
    // au-dessus du deck. Le repli window.open reste pour les navigateurs qui ne
    // l'ont pas, au prix d'une barre affichant about:blank.
    var pip = window.documentPictureInPicture;
    if (pip && pip.requestWindow) {
      pip.requestWindow({ width: 420, height: 640 }).then(presMount).catch(function () {
        var w = window.open('', 'ay-notes-' + deckKey, 'width=460,height=760');
        if (w) presMount(w); else toast('Autorisez les fenêtres pop-up pour ouvrir les notes.');
      });
      return;
    }
    var w = window.open('', 'ay-notes-' + deckKey, 'width=460,height=760');
    if (!w) { toast('Autorisez les fenêtres pop-up pour ouvrir les notes.'); return; }
    presMount(w);
  }
  // N ouvre les notes. Comme E, la touche reste discrete et ne marche pas sur un
  // lien "?pm=" partage a un client.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'n' && e.key !== 'N') return;
    if (/[?&]pm=/.test(location.search)) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.stopPropagation(); openPresenter();
  }, true);

  // accordion
  panel.querySelectorAll('.pm-achead').forEach(function (h) {
    h.addEventListener('click', function () {
      var acc = h.parentElement, willOpen = !acc.classList.contains('open'), s = acc.dataset.sec;
      panel.querySelectorAll('.pm-acc').forEach(function (a) { a.classList.remove('open'); });
      if (willOpen) { acc.classList.add('open'); applyMode(s === 'text' ? 'text' : s === 'visual' ? 'style' : null); } else applyMode(null);
    });
  });

  document.getElementById('pm-deselect').addEventListener('click', deselect);
  document.getElementById('pm-hide').addEventListener('click', function () {
    if (!selected) return; var el = selected;
    if (el.style.display === 'none') { unmaskKey(elPath(el)); track('deck_element_show', { target: fieldName(el), slide: slideIndex(el), title: slideTitle(el.closest('.slide')) }); }
    else { maskEl(el); track('deck_element_hide', { target: fieldName(el), slide: slideIndex(el), title: slideTitle(el.closest('.slide')) }); }
    updateHideBtn(); renderMasked(); autosave();
  });
  document.getElementById('pm-masked').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; unmaskKey(b.dataset.k); if (selected && elPath(selected) === b.dataset.k) updateHideBtn(); renderMasked(); autosave(); });
  document.getElementById('pm-opacity').addEventListener('input', function (e) {
    if (!selected) return; var el = selected, v = e.target.value, k = elPath(el);
    el.style.setProperty('animation', 'none', 'important'); el.style.setProperty('opacity', v / 100, 'important');
    document.getElementById('pm-opval').textContent = v + '%';
    if (+v === 100) delete state.opacity[k]; else state.opacity[k] = +v;
    clearTimeout(window.__pmop); window.__pmop = setTimeout(function () { autosave(); track('deck_style_change', { target: fieldName(el), opacity: +v }); }, 400);
  });

  list.addEventListener('click', function (e) {
    var eye = e.target.closest('.pm-eye'); if (!eye) return;
    var i = +eye.dataset.i, hide = slides[i].dataset.pmHidden !== '1';
    slides[i].dataset.pmHidden = hide ? '1' : '';
    state.slidesHidden = Array.prototype.filter.call(slides, function (s) { return s.dataset.pmHidden === '1'; }).map(function (s) { return Array.prototype.indexOf.call(slides, s); });
    eye.innerHTML = hide ? ICON.eyeOff : ICON.eye; eye.closest('.pm-srow').classList.toggle('pm-hidden', hide);
    // Masquer la slide affichee doit la quitter tout de suite, sinon le client
    // continue de voir celle que le commercial vient de retirer.
    if (hide && slides[i].classList.contains('active')) { nextSlide(); if (slides[i].classList.contains('active')) prevSlide(); }
    else { updateSlide(); }
    track(hide ? 'deck_slide_hidden' : 'deck_slide_shown', { slide: i + 1, title: slideTitle(slides[i]), chapter: slides[i].dataset.chapter || '' }); updateCount(); autosave();
  });

  // versions
  document.getElementById('pm-vsave').addEventListener('click', function () {
    var name = (document.getElementById('pm-vname').value || '').trim(); if (!name) { toast('Donnez un nom à la version.'); return; }
    var o = getSaves(); var existed = !!o[name]; o[name] = state; setSaves(o); renderSaves();
    track('deck_version_save', { name: name, overwrite: existed }); toast(existed ? 'Version « ' + name + ' » écrasée.' : 'Version « ' + name + ' » enregistrée.');
  });
  document.getElementById('pm-saves').addEventListener('click', function (e) {
    var l = e.target.closest('[data-load]'), d = e.target.closest('[data-del]');
    if (l) { var o = getSaves(); if (o[l.dataset.load]) { applyState(JSON.parse(JSON.stringify(o[l.dataset.load]))); track('deck_version_load', { name: l.dataset.load }); } }
    else if (d) { var o2 = getSaves(); delete o2[d.dataset.del]; setSaves(o2); renderSaves(); }
  });
  document.getElementById('pm-vreset').addEventListener('click', function () { confirmDialog('Effacer toutes vos modifications sur ce deck ?', function () { localStorage.removeItem('pm:draft:' + deckKey); location.reload(); }); });

  // Self-service personalized export, generated entirely in the browser (no
  // server, zero cost). We snapshot each live (edited) slide with html-to-image
  // (real browser renderer -> gradients, fonts, alignment, masks, opacity all
  // faithful) and assemble an image-per-slide PPTX (PptxGenJS) and PDF (jsPDF),
  // dropping hidden slides and keeping links clickable. The file is an image of
  // exactly what the rep personalized on the web (text not editable in the file;
  // editing stays on the web). State also lives in "?pm=" for a shareable link.
  var ENGINE_BASE = (function () {
    try { var s = Array.prototype.slice.call(document.scripts).filter(function (x) { return /\/engine\/slides\.js/.test(x.src); })[0]; return s ? s.src.replace(/slides\.js.*$/, '') : 'https://ayming-france.github.io/assets/engine/'; }
    catch (e) { return 'https://ayming-france.github.io/assets/engine/'; }
  })();
  function pmLoadScript(src) { return new Promise(function (res, rej) { if (document.querySelector('script[data-pm="' + src + '"]')) return res(); var s = document.createElement('script'); s.src = src; s.dataset.pm = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function copyLink(link) { try { if (navigator.clipboard) navigator.clipboard.writeText(link); } catch (e) { } }
  var PM_W_IN = 13.333; // page width in inches; height derived from the capture aspect
  // Exclude editor chrome + the logo popover from the captured image. They stay
  // visible on screen (so the popover keeps showing progress) but aren't baked in.
  function pmFilter(node) {
    if (node && node.classList) {
      if (node.id === 'pm-panel') return false;
      var ex = ['pdf-popover', 'pm-toast', 'pm-ovl', 'chapter-nav', 'nav-toggle', 'banner-controls', 'deck-help', 'deck-ink', 'deck-tools'];
      for (var i = 0; i < ex.length; i++) if (node.classList.contains(ex[i])) return false;
    }
    return true;
  }
  async function pmCapture(progress) {
    var st = document.createElement('style');
    // freeze animations + kill pointer-events so no element stays in :hover
    // (html-to-image bakes the current computed style, incl. a hovered card's overlay).
    // Also flatten 3D flip cards (testimonials) to their FRONT face: html-to-image
    // can't do preserve-3d/backface-visibility, so the rotateY(180) back renders
    // mirrored. Force no rotation + hide the back so only the readable cover shows.
    st.textContent = '*,*::before,*::after{animation-duration:.001s!important;animation-delay:0s!important;transition-duration:.001s!important}'
      + '*{pointer-events:none!important}'
      + '.testimonial-card-inner{transform:none!important;transform-style:flat!important}'
      + '.testimonial-front{transform:none!important;backface-visibility:visible!important;-webkit-backface-visibility:visible!important}'
      + '.testimonial-back{display:none!important}';
    document.head.appendChild(st);
    var keep = currentSlide, out = [], visible = [], _ac = window.animateCounter;
    // Capture the ACTUAL viewport: fitSlide lays content out for the real window
    // (scaling up to 1.2x), so a hardcoded size would crop/misscale. This matches
    // exactly what's on screen. Page aspect is derived from vw/vh below.
    var vw = Math.round(window.innerWidth), vh = Math.round(window.innerHeight);
    // Stat counters (animateIntroCounters) re-run on each slide entry and count
    // 0->target over ~800ms; freeze them at their CURRENT value so an edited
    // number is preserved (not reset, not half-counted). Restored after capture.
    try { window.animateCounter = function (el, target, suffix) { el.textContent = (typeof target === 'number' ? target.toLocaleString('fr-FR') : target) + (suffix || ''); }; } catch (e) { }
    for (var k = 0; k < slides.length; k++) if (state.slidesHidden.indexOf(k) < 0) visible.push(k);
    try {
      for (var j = 0; j < visible.length; j++) {
        if (progress) progress(j + 1, visible.length);
        goToSlide(visible[j]);
        await new Promise(function (r) { setTimeout(r, 450); });
        var img = await htmlToImage.toJpeg(document.body, { quality: 0.92, pixelRatio: 2, width: vw, height: vh, backgroundColor: '#ffffff', cacheBust: true, filter: pmFilter });
        var links = [];
        document.querySelectorAll('.slide.active a[href]').forEach(function (a) {
          var href = a.href; if (!href || href.indexOf('javascript:') === 0) return;
          var el = a.closest('.testimonial-card') || a, r = el.getBoundingClientRect();
          if ((r.width < 5 || r.height < 5) && a.parentElement) r = a.parentElement.getBoundingClientRect();
          if (r.width < 5 || r.height < 5) return;
          links.push({ x: r.x, y: r.y, w: r.width, h: r.height, url: href });
        });
        out.push({ img: img, links: links });
      }
    } finally { goToSlide(keep); st.remove(); try { window.animateCounter = _ac; } catch (e) { } }
    return { caps: out, vw: vw, vh: vh };
  }
  function pmBtnBusy(btn, on, label) { if (!btn) return; btn.style.pointerEvents = on ? 'none' : ''; btn.style.opacity = on ? '.6' : ''; if (on) { btn.dataset.prev = btn.innerHTML; btn.textContent = label || 'Génération…'; } else { btn.innerHTML = btn.dataset.prev || btn.innerHTML; } }
  async function pmExportPptx(btn) {
    pmBtnBusy(btn, true); toast('Génération du PowerPoint…');
    try {
      await pmLoadScript(ENGINE_BASE + 'html-to-image.js'); await pmLoadScript(ENGINE_BASE + 'pptxgen.bundle.js');
      var res = await pmCapture(function (n, t) { if (btn) btn.textContent = 'Slide ' + n + '/' + t + '…'; });
      var s = PM_W_IN / res.vw, PH = PM_W_IN * res.vh / res.vw;
      var pptx = new PptxGenJS(); pptx.defineLayout({ name: 'AY', width: PM_W_IN, height: PH }); pptx.layout = 'AY';
      res.caps.forEach(function (c) {
        var sl = pptx.addSlide(); sl.addImage({ data: c.img, x: 0, y: 0, w: PM_W_IN, h: PH });
        c.links.forEach(function (l) { sl.addText(' ', { x: l.x * s, y: l.y * s, w: l.w * s, h: l.h * s, hyperlink: { url: l.url }, fill: { color: 'FFFFFF', transparency: 100 }, line: { type: 'none' }, margin: 0 }); });
      });
      await pptx.writeFile({ fileName: deckKey + '-personnalise.pptx' });
      track('deck_download', { format: 'pptx', hidden_count: state.slidesHidden.length }); toast('PowerPoint téléchargé.');
    } catch (err) { if (window.console) console.warn('[perso] pptx', err); toast('Export PowerPoint indisponible.'); }
    pmBtnBusy(btn, false);
  }
  async function pmExportPdf(btn) {
    pmBtnBusy(btn, true); toast('Génération du PDF…');
    try {
      await pmLoadScript(ENGINE_BASE + 'html-to-image.js'); await pmLoadScript(ENGINE_BASE + 'jspdf.umd.min.js');
      var res = await pmCapture(function (n, t) { if (btn) btn.textContent = 'Slide ' + n + '/' + t + '…'; });
      var s = PM_W_IN / res.vw, PH = PM_W_IN * res.vh / res.vw;
      var JsPDF = window.jspdf.jsPDF, pdf = new JsPDF({ orientation: 'landscape', unit: 'in', format: [PM_W_IN, PH] });
      res.caps.forEach(function (c, idx) {
        if (idx) pdf.addPage([PM_W_IN, PH], 'landscape');
        pdf.addImage(c.img, 'JPEG', 0, 0, PM_W_IN, PH);
        c.links.forEach(function (l) { pdf.link(l.x * s, l.y * s, l.w * s, l.h * s, { url: l.url }); });
      });
      pdf.save(deckKey + '-personnalise.pdf');
      track('deck_download', { format: 'pdf', hidden_count: state.slidesHidden.length }); toast('PDF téléchargé.');
    } catch (err) { if (window.console) console.warn('[perso] pdf', err); toast('Export PDF indisponible.'); }
    pmBtnBusy(btn, false);
  }
  // Single download/share entry = the Ayming-logo popover (engine). Expose the
  // generators + an "edited?" test so the popover serves the static deck when
  // unmodified (instant) and a browser-captured personalized file when edited.
  // Les IIFE voisines n'ont pas acces a track(), qui vit dans cette portee.
  window.pmTrack = track;
  window.pmNotesOpen = openPresenter;
  window.pmExportPptx = pmExportPptx;
  window.pmExportPdf = pmExportPdf;
  window.pmHasEdits = function () { return !!(Object.keys(state.text).length || state.masked.length || Object.keys(state.opacity).length || state.slidesHidden.length); };
  // The rep must be identified before a link goes out, so any client event on
  // it can be credited back to them. Chained (never stacked): the "who are
  // you" prompt closes before the share dialog opens.
  window.pmCopyLink = function () {
    if (!AY_REP) { askRep(openShareDialog); return; }
    openShareDialog();
  };
  function openShareDialog() {
    var ov = document.createElement('div'); ov.className = 'pm-ovl';
    ov.innerHTML = '<div class="pm-dlg pm-share">'
      + '<div class="pm-share-icon">' + ICO('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>', 20) + '</div>'
      + '<div class="pm-dlg-title">Partager ce deck</div>'
      + '<div class="pm-dlg-sub">Indiquez l’entreprise destinataire pour suivre la consultation. N’entrez jamais le nom d’une personne.</div>'
      + '<input class="pm-dlg-input" type="text" placeholder="Nom de l’entreprise">'
      + '<div class="pm-dlg-btns"><button class="pm-dlg-cancel">Annuler</button><button class="pm-dlg-go">Copier le lien</button></div>'
      + '</div>';
    var input = ov.querySelector('.pm-dlg-input');
    document.body.appendChild(ov);
    function close() { ov.remove(); }
    function go() {
      var name = input.value.trim();
      var link = pmLink();
      if (name) link += (link.indexOf('?') >= 0 ? '&' : '?') + 'to=' + encodeURIComponent(name);
      if (AY_REP) link += '&by=' + encodeURIComponent(AY_REP);
      copyLink(link);
      track('deck_link_share', { hidden_count: state.slidesHidden.length, recipient: name || '' });
      toast(name ? ('Lien pour « ' + name + ' » copié.') : 'Lien copié.');
      close();
    }
    ov.querySelector('.pm-dlg-cancel').addEventListener('click', close);
    ov.querySelector('.pm-dlg-go').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') go(); else if (e.key === 'Escape') close(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    setTimeout(function () { input.focus(); }, 50);
  }

  (function () { var h = document.getElementById('pm-drag'), down = false, ox = 0, oy = 0; h.addEventListener('mousedown', function (e) { down = true; var r = panel.getBoundingClientRect(); panel.style.right = 'auto'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; ox = e.clientX - r.left; oy = e.clientY - r.top; e.preventDefault(); }); document.addEventListener('mousemove', function (e) { if (!down) return; panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; }); document.addEventListener('mouseup', function () { down = false; }); })();

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'e' && e.key !== 'E') return;
    // A "?pm=" link is what a rep shares with a client: editing is disabled on it,
    // so the client can never alter the deck and every edit event is guaranteed to
    // originate from a rep editing their own working copy (the bare deck URL).
    if (/[?&]pm=/.test(location.search)) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.stopPropagation();
    var opening = panel.style.display === 'none';
    panel.style.display = opening ? 'flex' : 'none';
    // Opening the editor is a definitive Sales signal: lock this browser to "rep"
    // (corrects any earlier client tag from previewing a ?pm= link).
    if (opening) {
      try { localStorage.setItem('ay-role', 'rep'); AY_ROLE = 'rep'; } catch (ex) {}
      // Ouvrir l'éditeur ne demande plus de prénom : les retouches et les notes
      // restent anonymes. Le partage d'un lien continue de proposer le prénom,
      // qui sert l'attribution "?by=" côté analytics.
    } else {
      // Closing the editor must fully return to view mode. Collapse the
      // accordions and clear the active mode so no element stays editable or
      // selectable: otherwise clicks keep getting highlighted and links stop
      // opening while the panel is hidden.
      panel.querySelectorAll('.pm-acc').forEach(function (a) { a.classList.remove('open'); });
      applyMode(null);
    }
  }, true);

  // restore auto-draft from a previous session, then render lists
  renderSlides(); renderSaves();
  // A "?pm=" link (shared by a rep, or fed to the export pipeline) wins over the
  // local auto-draft, so the deck shows exactly the personalized state encoded.
  try {
    var pmParam = new URLSearchParams(location.search).get('pm');
    if (pmParam) { applyState(pmDecode(pmParam)); }
    else { var dr = localStorage.getItem('pm:draft:' + deckKey); if (dr) applyState(JSON.parse(dr)); }
  } catch (e) { }
  // No deck_open event: Umami's gated pageview already marks "opened this deck"
  // (one URL per deck), so deck_open was a duplicate at the same timestamp.
  } catch (e) { if (window.console) console.warn('[perso] editor disabled:', e); }
});

// ===== Outils de présentation : laser, surligneur, projecteur =====
// Trois gestes tenus, jamais des modes : la touche agit tant qu'elle est
// enfoncée et tout disparaît ensuite, donc un commercial ne peut pas rester
// coincé dans un outil ni laisser une trace sur une slide de marque.
//   L  laser        un point qui suit le curseur, traînée de 0,3 s, rien ne reste
//   H  surligneur   un trait translucide qui vit 5 s puis s'efface tout seul
//   S  projecteur   tout s'assombrit sauf le bloc survolé
// La couche est un canvas plein écran en coordonnées viewport : fitSlide met à
// l'échelle l'intérieur de la slide, pas la fenêtre, donc rien à recalculer.
(function () {
  try {
    var TRAIL_MS = 320;        // traînée vive sous le point du laser
    var INK_HOLD_MS = 3200;    // le surligneur tient le temps qu'on en parle
    var INK_FADE_MS = 1000;
    var LASER_HOLD_MS = 2000;  // un cercle au laser reste le temps d'être vu
    var LASER_FADE_MS = 800;
    var LASER = '#e8443a', INK = 'rgba(255,149,0,.40)', DIM = 'rgba(4,20,38,.55)';
    var BLOCKS = '.column-card,.value-detail,.feature-item,.option-card,.testimonial-card,.stat-card,.intro-stat-card,td,li';

    var cv = document.createElement('canvas');
    cv.className = 'deck-ink';
    cv.style.cssText = 'position:fixed;inset:0;z-index:99000;pointer-events:none;display:none';
    var ctx = null, active = null, raf = null;
    var pos = { x: -1, y: -1 }, trail = [], strokes = [], cur = null, spot = null;
    var sticky = null, drawing = false;

    function ready() {
      if (!cv.parentNode) document.body.appendChild(cv);
      var r = window.devicePixelRatio || 1;
      cv.width = Math.floor(window.innerWidth * r);
      cv.height = Math.floor(window.innerHeight * r);
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
      ctx = cv.getContext('2d');
      ctx.setTransform(r, 0, 0, r, 0, 0);
    }
    function slideNow() {
      var s = document.querySelector('.slide.active');
      var all = document.querySelectorAll('.slide');
      return { i: Array.prototype.indexOf.call(all, s) + 1, el: s };
    }
    // Le bloc sous le curseur, pour que le projecteur éclaire une carte entière
    // plutôt qu'un disque qui coupe le texte en deux.
    function blockAt(x, y) {
      var el = document.elementFromPoint(x, y);
      if (!el || !el.closest) return null;
      if (el.closest('#pm-panel')) return null;
      var b = el.closest(BLOCKS);
      if (!b) return null;
      var r = b.getBoundingClientRect();
      return (r.width > 40 && r.height > 24) ? r : null;
    }
    function draw() {
      raf = null;
      if (!ctx) return;
      var now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (active === 'spot' && pos.x >= 0) {
        ctx.fillStyle = DIM;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        // destination-out efface proportionnellement a l'alpha de la couleur de
        // remplissage. Sans cette ligne le trou herite du .55 de DIM et la zone
        // eclairee reste voilee au lieu de redevenir nette.
        ctx.fillStyle = '#000';
        ctx.beginPath();
        if (spot) {
          var pad = 10, rad = 16;
          var x = spot.left - pad, y = spot.top - pad;
          var w = spot.width + pad * 2, h = spot.height + pad * 2;
          if (ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h);
        } else {
          ctx.arc(pos.x, pos.y, 120, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }

      // Chaque trait vit sa vie, opaque puis efface. Le laser tient moins
      // longtemps que le surligneur : on entoure, on montre, ca part.
      strokes = strokes.filter(function (st) {
        if (!st.end) return true;
        var life = (st.kind === 'laser' ? LASER_HOLD_MS + LASER_FADE_MS : INK_HOLD_MS + INK_FADE_MS);
        return now - st.end < life;
      });
      strokes.concat(cur ? [cur] : []).forEach(function (st) {
        if (st.pts.length < 2) return;
        var laser = st.kind === 'laser';
        var hold = laser ? LASER_HOLD_MS : INK_HOLD_MS;
        var fade = laser ? LASER_FADE_MS : INK_FADE_MS;
        var a = 1;
        if (st.end) {
          var age = now - st.end;
          if (age > hold) a = 1 - (age - hold) / fade;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, a);
        ctx.strokeStyle = laser ? LASER : INK;
        ctx.lineWidth = laser ? 6 : 16;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (laser) { ctx.shadowColor = LASER; ctx.shadowBlur = 10; }
        smoothPath(ctx, st.pts);
        ctx.stroke(); ctx.restore();
      });

      if (active === 'laser' && pos.x >= 0) {
        trail = trail.filter(function (p) { return now - p.t < TRAIL_MS; });
        for (var j = 1; j < trail.length; j++) {
          var al = 1 - (now - trail[j].t) / TRAIL_MS;
          ctx.save(); ctx.globalAlpha = al * 0.5;
          ctx.strokeStyle = LASER; ctx.lineWidth = 5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(trail[j - 1].x, trail[j - 1].y); ctx.lineTo(trail[j].x, trail[j].y);
          ctx.stroke(); ctx.restore();
        }
        ctx.save();
        ctx.shadowColor = LASER; ctx.shadowBlur = 18;
        ctx.fillStyle = LASER; ctx.beginPath(); ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.85; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      if (active || sticky || cur || strokes.length) tick();
      else { cv.style.display = 'none'; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }
    function tick() { if (!raf) raf = requestAnimationFrame(draw); }
    // Un trait tire a la souris est une suite de segments, et ca se voit. En
    // passant par les milieux avec des quadratiques, la main redevient fluide.
    function smoothPath(c, pts) {
      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      if (pts.length === 2) { c.lineTo(pts[1].x, pts[1].y); return; }
      for (var i = 1; i < pts.length - 1; i++) {
        var mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
        c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      c.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
    // Les points trop rapproches ne portent que du tremblement.
    function addPoint(st, x, y) {
      var p = st.pts[st.pts.length - 1];
      if (p && Math.abs(p.x - x) + Math.abs(p.y - y) < 3) return;
      st.pts.push({ x: x, y: y });
    }

    document.addEventListener('mousemove', function (e) {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!active) return;
      var now = performance.now();
      if (active === 'laser') {
        trail.push({ x: pos.x, y: pos.y, t: now });
        if (drawing && cur) addPoint(cur, pos.x, pos.y);
      }
      else if (active === 'ink' && cur && (!sticky || drawing)) addPoint(cur, pos.x, pos.y);
      else if (active === 'spot') spot = blockAt(pos.x, pos.y);
      tick();
    }, true);

    function start(tool) {
      if (active === tool) return;
      active = tool;
      ready();
      cv.style.display = 'block';
      if (tool === 'laser') trail = [];
      if (tool === 'ink') cur = { pts: pos.x >= 0 ? [{ x: pos.x, y: pos.y }] : [] };
      if (tool === 'spot') spot = blockAt(pos.x, pos.y);
      tick();
    }
    function stop() {
      if (!active) return;
      var tool = active;
      if (sticky === tool) { cv.style.display = 'block'; }
      if (tool === 'ink' && cur) {
        // Le trait ne disparaît pas au relâchement : il tient le temps qu'on en
        // parle, puis s'efface seul.
        cur.end = performance.now();
        if (cur.pts.length > 1) strokes.push(cur);
        cur = null;
      }
      if (tool === 'laser') trail = [];
      if (tool === 'spot') spot = null;
      active = null;
      var sl = slideNow();
      try { if (window.pmTrack) window.pmTrack('deck_annotate', { tool: tool, slide: sl.i }); } catch (e) { }
      tick();
    }

    // L et H arment et desarment. Tenir une touche pendant qu'on parle et qu'on
    // deplace la souris ne tient pas la route en rendez-vous : on choisit un
    // outil, on s'en sert, on rappuie pour retrouver le curseur.
    var KEYS = { l: 'laser', h: 'ink', s: 'spot' };
    function editable(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
    document.addEventListener('keydown', function (e) {
      var t = KEYS[(e.key || '').toLowerCase()];
      if (!t || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (editable(e.target) || (e.target && e.target.closest && e.target.closest('#pm-panel'))) return;
      e.preventDefault(); e.stopPropagation();
      if (!bar) mountButtons();
      toggleSticky(t);
      if (sticky) showTools();
    }, true);

    // Palette flottante en bas a droite, au-dessus du bandeau. Repliee c'est un
    // seul bouton, pour qu'un deck simplement lu ne porte pas de mobilier en
    // plus ; ouverte c'est la rangee d'outils, l'outil arme reste rempli. Une
    // touche tenue ne se decouvre pas, un bouton visible si.
    var st = document.createElement('style');
    st.textContent = '.deck-tools{position:fixed;right:24px;bottom:calc(var(--banner-h, 56px) + 12px);z-index:99100;display:flex;align-items:flex-end;gap:2px;background:#fff;border-radius:18px;padding:0 8px;height:74px;overflow:hidden;box-shadow:0 12px 34px rgba(2,30,60,.24);font-family:system-ui,Arial,sans-serif}'
      + '.deck-tools .dt-tool{width:44px;height:74px;border:0;background:transparent;padding:0;cursor:pointer;display:flex;align-items:flex-end;justify-content:center}'
      // Les outils sont dessines comme des objets poses dans un plateau : ils
      // depassent par le bas, et celui qui est arme se souleve.
      // Le plateau fait 74px et rogne ce qui depasse : l'instrument mesure 76px
      // pour que la pointe reste entiere une fois souleve, et que seul le bas
      // du corps soit coupe.
      + '.deck-tools .dt-tool svg{width:30px;height:76px;display:block;transform:translateY(20px);transition:transform .22s cubic-bezier(.34,1.4,.5,1)}'
      + '.deck-tools .dt-tool:hover svg{transform:translateY(11px)}'
      + '.deck-tools .dt-tool.on svg{transform:translateY(2px)}'
      + '.deck-tools .dt-sep{width:1px;height:34px;background:#e9eff5;margin:0 5px 20px}'
      + '.deck-tools .dt-round{width:32px;height:32px;border:0;border-radius:50%;background:#f2f6fa;color:#5b7085;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin-bottom:21px;transition:background .18s,color .18s}'
      + '.deck-tools .dt-round:hover{background:#e4ecf4;color:#0fa7e2}'
      + '.deck-tools .dt-round svg{width:16px;height:16px}'
      // Rien ne stationne sur la slide : le plateau se montre quand la souris
      // vient le chercher dans son coin, quand un outil est arme, ou quand on
      // l'appelle avec T. Sinon il n'existe pas.
      + '.deck-tools{opacity:0;pointer-events:none;transition:opacity .18s ease}'
      + '.deck-tools.dt-show{opacity:1;pointer-events:auto}'
      + '.deck-tools{transform:translateY(8px);transition:opacity .18s ease,transform .18s ease}'
      + '.deck-tools.dt-show{transform:translateY(0)}'
      + 'canvas.deck-ink.ink-draw{pointer-events:auto;cursor:crosshair}';
    document.head.appendChild(st);

    function svgIco(inner) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"'
        + ' stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }
    var ICO_PEN = '<path d="m9 11-6 6v3h3l6-6"/><path d="m15 5 4 4"/><path d="M13 3.5 20.5 11l-5 5L8 8.5z"/>';
    // Deux instruments dessines de profil, corps blanc ombre a droite, pointe
    // coloree. Un pointeur laser et un surligneur biseaute au bleu de la marque.
    var TOOL_LASER =
      '<svg viewBox="0 0 38 96" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M19 4 27 28H11z" fill="#5b7085"/>'
      + '<circle cx="19" cy="10" r="4.4" fill="#e8443a"/>'
      + '<rect x="11" y="26" width="16" height="6" rx="1.5" fill="#cfd9e3"/>'
      + '<rect x="10" y="31" width="18" height="65" rx="4" fill="#22384c"/>'
      + '<rect x="10" y="52" width="18" height="7" fill="#e8443a"/>'
      + '</svg>';
    var TOOL_INK =
      '<svg viewBox="0 0 38 96" xmlns="http://www.w3.org/2000/svg">'
      // Pointe biseautee, epaulement, corps : un vrai feutre, pas un tube.
      + '<path d="M13 7 25 3v14H13z" fill="#ff9500"/>'
      + '<path d="M11 17h16l2 9H9z" fill="#e6edf4"/>'
      + '<rect x="9" y="25" width="20" height="71" rx="5" fill="#fbfdff" stroke="#c9d6e2" stroke-width="1.3"/>'
      + '<rect x="9.6" y="40" width="18.8" height="10" fill="#ff9500"/>'
      + '</svg>';
    // Un bloc de pense-betes, corner plie, pose a cote des feutres.
    var TOOL_NOTE =
      '<svg viewBox="0 0 38 96" xmlns="http://www.w3.org/2000/svg">'
      + '<rect x="7" y="30" width="24" height="66" rx="3" fill="#f6c445"/>'
      + '<rect x="7" y="22" width="24" height="66" rx="3" fill="#ffd968"/>'
      + '<path d="M7 25a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v6H7z" fill="#f0b429"/>'
      + '<rect x="12" y="40" width="14" height="2.6" rx="1.3" fill="#b98514"/>'
      + '<rect x="12" y="48" width="14" height="2.6" rx="1.3" fill="#b98514"/>'
      + '<rect x="12" y="56" width="9" height="2.6" rx="1.3" fill="#b98514"/>'
      + '</svg>';
    var bar = null;
    function mountButtons() {
      if (bar) return;
      bar = document.createElement('div');
      bar.className = 'deck-tools';
      bar.innerHTML =
        '<button class="dt-tool" data-act="laser" aria-label="Laser">' + TOOL_LASER + '</button>'
        + '<button class="dt-tool" data-act="ink" aria-label="Surligneur">' + TOOL_INK + '</button>'
        + '<button class="dt-tool" data-act="notes" aria-label="Notes">' + TOOL_NOTE + '</button>'
        + '<div class="dt-sep"></div>'
        + '<button class="dt-round" data-act="close" aria-label="Fermer les outils">' + svgIco('<path d="M18 6 6 18M6 6l12 12"/>') + '</button>';
      document.body.appendChild(bar);
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var act = b.dataset.act;
        if (act === 'close') { exitTools(); return; }
        if (act === 'notes') {
          // Le clic est un vrai geste utilisateur, donc la fenetre s'ouvre.
          if (window.pmNotesOpen) window.pmNotesOpen();
          return;
        }
        toggleSticky(act);
      });
    }
    var shown = false;
    function paintButtons() {
      if (!bar) return;
      ['laser', 'ink'].forEach(function (t) {
        var b = bar.querySelector('[data-act="' + t + '"]');
        if (b) b.classList.toggle('on', sticky === t);
      });
      bar.classList.toggle('dt-show', !!(shown || sticky));
      cv.classList.toggle('ink-draw', sticky === 'ink');
      // Le style inline du canvas bat la feuille de style, donc le curseur se
      // pose sur le body : c'est le seul retour visuel que le feutre est arme.
      document.body.style.cursor = (sticky === 'ink') ? 'crosshair' : '';
    }
    function toggleSticky(tool) {
      if (sticky === tool) { sticky = null; stop(); }
      else { sticky = tool; start(tool); }
      paintButtons();
    }
    function clearSticky() { if (sticky) { sticky = null; stop(); paintButtons(); } }

    // En mode colle, le surligneur ecrit au glisser seulement, comme un vrai
    // feutre : deplacer la souris sans appuyer ne doit rien tracer.
    // Appuyer trace, dans les deux outils : au laser on entoure ce dont on parle
    // et le cercle tient deux secondes, au surligneur on souligne une ligne.
    // Sans appuyer, le laser se contente de pointer.
    document.addEventListener('mousedown', function (e) {
      if (!sticky || e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('.deck-tools, #pm-panel')) return;
      e.preventDefault();
      drawing = true;
      cur = { kind: sticky === 'laser' ? 'laser' : 'ink', pts: [{ x: e.clientX, y: e.clientY }] };
      tick();
    }, true);
    document.addEventListener('mouseup', function () {
      if (!drawing) return;
      drawing = false;
      if (cur) { cur.end = performance.now(); if (cur.pts.length > 1) strokes.push(cur); cur = null; }
      try { if (window.pmTrack) window.pmTrack('deck_annotate', { tool: sticky || 'ink', slide: slideNow().i }); } catch (e) { }
      tick();
    }, true);
    // T arme et desarme le mode annotation. Une fois un outil choisi il reste en
    // main d'une slide a l'autre, et c'est T qui rend le curseur et nettoie.
    function exitTools() {
      shown = false;
      clearSticky();
      strokes = []; cur = null; drawing = false;
      paintButtons();
      tick();
    }
    function showTools() { if (!bar) mountButtons(); shown = true; paintButtons(); }
    // Le bandeau demande, la couche repond.
    document.addEventListener('ay-tools-toggle', function () {
      if (shown) exitTools(); else showTools();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { exitTools(); return; }
      if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (editable(e.target) || (e.target && e.target.closest && e.target.closest('#pm-panel'))) return;
        e.preventDefault(); e.stopPropagation();
        if (shown) exitTools(); else showTools();
      }
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mountButtons(); paintButtons(); });
    else { mountButtons(); paintButtons(); }
    // Quitter la fenêtre en gardant la touche enfoncée ne doit pas figer l'outil.
    window.addEventListener('blur', stop);
    window.addEventListener('resize', function () { if (cv.parentNode) ready(); });
    // Changer de slide efface l'encre de la précédente.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === ' ') { strokes = []; cur = null; drawing = false; tick(); }
    }, true);
  } catch (e) { if (window.console) console.warn('[ink] outils de présentation désactivés:', e); }
})();
