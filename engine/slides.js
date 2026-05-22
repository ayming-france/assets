/* Ayming Slides - Unified JS */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navItems = document.querySelectorAll('.nav-item');
const counter = document.querySelector('.slide-counter');
const totalSlides = slides.length;

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
    const VW = window.innerWidth, VH = window.innerHeight;
    // Largest scale before a given content edge (offset d from origin) crosses
    // the [lo, hi] safe band, both measured relative to the scaling origin
    const cap = (d, lo, hi) => d < 0 ? lo / d : d > 0 ? hi / d : Infinity;
    let scale = Math.min(
      designScale,
      cap(minL - ox, M - ox, VW - M - ox),
      cap(maxR - ox, M - ox, VW - M - ox),
      cap(minT - oy, M - oy, VH - M - oy),
      cap(maxB - oy, M - oy, VH - M - oy)
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
