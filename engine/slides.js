/* Ayming Slides - Unified JS */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navItems = document.querySelectorAll('.nav-item');
const counter = document.querySelector('.slide-counter');
const totalSlides = slides.length;

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
      || 'https://www.ayming.fr/wp-content/uploads/sites/3/2025/07/Ayming.png';
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
      +   '<button class="banner-btn" data-act="fs" aria-label="Plein écran">' + svg('<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>') + '</button>'
      + '</div>';
    document.body.appendChild(banner);
    brandBanner = banner;
    bannerCounter = banner.querySelector('.banner-counter');
    banner.querySelector('[data-act="prev"]').addEventListener('click', () => prevSlide());
    banner.querySelector('[data-act="next"]').addEventListener('click', () => nextSlide());
    banner.querySelector('[data-act="fs"]').addEventListener('click', () => toggleFullscreen());
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

  if (counter) counter.innerHTML = `<span class="current">${currentSlide + 1}</span>/${totalSlides}`;

  // Brand banner: update counter, hide on the full-bleed cover slide
  if (bannerCounter) bannerCounter.textContent = `${currentSlide + 1}/${totalSlides}`;
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

function nextSlide() { if (currentSlide < totalSlides - 1) { currentSlide++; updateSlide(); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; updateSlide(); } }
function goToSlide(i) { if (i >= 0 && i < totalSlides) { currentSlide = i; updateSlide(); } }
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
    case 'Home': goToSlide(0); break;
    case 'End': goToSlide(totalSlides - 1); break;
  }
});

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
  fitResizeTimer = setTimeout(fitSlide, 100);
});
window.addEventListener('load', fitSlide);

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
  function track(event, detail) {
    window.dataLayer.push(Object.assign({ event: event }, detail || {}));
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
    grip: ICO('<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>', 14)
  };

  var slides = document.querySelectorAll('.slide');
  var deckKey = location.pathname.replace(/\//g, '') || 'deck';
  function slideIndex(el) { var s = el.closest('.slide'); return s ? Array.prototype.indexOf.call(slides, s) + 1 : 0; }
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
    el.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { var k = elPath(el); state.text[k] = el.innerHTML; autosave(); track('deck_field_edit', { field: fieldName(el), slide: slideIndex(el) }); }, 500); });
    el.addEventListener('keydown', function (e) { e.stopPropagation(); });
  }
  function applyMode(m) {
    mode = m; clearEditable();
    if (m === 'text') editableEls().forEach(function (el) { el.contentEditable = 'true'; el.style.outline = '2px dashed rgba(15,167,226,.9)'; el.style.outlineOffset = '2px'; el.style.cursor = 'text'; bindText(el); });
    if (m) track('deck_edit_mode_toggle', { mode: m });
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
  slides.forEach(function (s, i) { new MutationObserver(function () { if (s.classList.contains('active')) track('deck_slide_view', { slide: i + 1, chapter: s.dataset.chapter || '' }); }).observe(s, { attributes: true, attributeFilter: ['class'] }); });

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
    '.pm-ovl{position:fixed;inset:0;z-index:100000;background:rgba(8,24,44,.45);display:flex;align-items:center;justify-content:center;font-family:system-ui,Arial,sans-serif}.pm-dlg{background:#fff;border-radius:16px;padding:22px;max-width:340px;box-shadow:0 24px 70px rgba(0,0,0,.32)}.pm-dlg-msg{font-size:14px;color:#13324d;margin-bottom:18px;line-height:1.5}.pm-dlg-btns{display:flex;gap:10px;justify-content:flex-end}.pm-dlg button{font-size:13px;font-weight:700;border-radius:9px;padding:9px 18px;cursor:pointer;border:0}.pm-dlg-cancel{background:#eef3f8;color:#34495c}.pm-dlg-ok{background:#c0392b;color:#fff}' +
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
    if (el.style.display === 'none') { unmaskKey(elPath(el)); track('deck_element_show', { target: fieldName(el), slide: slideIndex(el) }); }
    else { maskEl(el); track('deck_element_hide', { target: fieldName(el), slide: slideIndex(el) }); }
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
    track(hide ? 'deck_slide_hidden' : 'deck_slide_shown', { slide: i + 1, chapter: slides[i].dataset.chapter || '' }); updateCount(); autosave();
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
      var ex = ['pdf-popover', 'pm-toast', 'pm-ovl', 'chapter-nav', 'nav-toggle', 'banner-controls'];
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
  window.pmExportPptx = pmExportPptx;
  window.pmExportPdf = pmExportPdf;
  window.pmHasEdits = function () { return !!(Object.keys(state.text).length || state.masked.length || Object.keys(state.opacity).length || state.slidesHidden.length); };
  window.pmCopyLink = function () { copyLink(pmLink()); track('deck_link_share', { hidden_count: state.slidesHidden.length }); toast('Lien de votre version copié.'); };

  (function () { var h = document.getElementById('pm-drag'), down = false, ox = 0, oy = 0; h.addEventListener('mousedown', function (e) { down = true; var r = panel.getBoundingClientRect(); panel.style.right = 'auto'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; ox = e.clientX - r.left; oy = e.clientY - r.top; e.preventDefault(); }); document.addEventListener('mousemove', function (e) { if (!down) return; panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; }); document.addEventListener('mouseup', function () { down = false; }); })();

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'e' && e.key !== 'E') return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.stopPropagation(); panel.style.display = (panel.style.display === 'none') ? 'flex' : 'none';
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
  track('deck_open', { deck: deckKey });
  } catch (e) { if (window.console) console.warn('[perso] editor disabled:', e); }
});
