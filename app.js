'use strict';

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const PALETTES = {
  forest: {
    greens: ['#9ec18a', '#5a8a52', '#3d6b3a', '#2a4d2e'],
    bg: '#f6f1e4', bgDeep: '#efe7d3', ink: '#1b2a1c', inkSoft: '#3d4a3a',
    inkMute: 'rgba(27,42,28,.55)', gold: '#c9a96e', goldDeep: '#a8864a',
    paper: '#fbf7eb', rule: 'rgba(27,42,28,.14)',
  },
  meadow: {
    greens: ['#a8d5a2', '#6ba068', '#3f7a43', '#2d5a3d'],
    bg: '#eef3e8', bgDeep: '#e2ead7', ink: '#1f3528', inkSoft: '#3d4a3a',
    inkMute: 'rgba(31,53,40,.55)', gold: '#e8b86a', goldDeep: '#b08236',
    paper: '#f4f8ee', rule: 'rgba(31,53,40,.14)',
  },
  midnight: {
    greens: ['#9ec18a', '#6ba068', '#4a7c4a', '#2d5a3d'],
    bg: '#0f1a14', bgDeep: '#0a130e', ink: '#f1ebd6', inkSoft: '#cfc9b5',
    inkMute: 'rgba(241,235,214,.5)', gold: '#e6c46b', goldDeep: '#d4af37',
    paper: '#16241a', rule: 'rgba(241,235,214,.14)',
  },
};

const CORNER_CLOVERS = [
  { section: 'leaf1', leaves: 1, rot: -15, size: 90 },
  { section: 'leaf2', leaves: 2, rot: -15, size: 90 },
  { section: 'leaf3', leaves: 3, rot: -15, size: 90 },
  { section: 'leaf4', leaves: 4, rot: -15, size: 90 },
];

// ─── STATE ───────────────────────────────────────────────────────────────────

const st = {
  paletteKey:  'forest',
  density:     70,
  lensSize:    180,
  introActive: true,
  introFound:  false,
  carouselIdx: 0,
};

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function mulberry32(a) {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function applyPaletteVars(key) {
  const p = PALETTES[key] || PALETTES.forest;
  const s = document.documentElement.style;
  s.setProperty('--bg',         p.bg);
  s.setProperty('--bg-deep',    p.bgDeep);
  s.setProperty('--ink',        p.ink);
  s.setProperty('--ink-soft',   p.inkSoft);
  s.setProperty('--ink-mute',   p.inkMute);
  s.setProperty('--green-dark', p.greens[3]);
  s.setProperty('--green',      p.greens[1]);
  s.setProperty('--green-soft', p.greens[0]);
  s.setProperty('--gold',       p.gold);
  s.setProperty('--gold-deep',  p.goldDeep);
  s.setProperty('--paper',      p.paper);
  s.setProperty('--rule',       p.rule);
}

// ─── SVG HELPERS ─────────────────────────────────────────────────────────────

const PETAL_PATH = 'M0 0 C -8 -6 -14 -12 -14 -19 C -14 -25 -9 -28 -5 -28 C -1.5 -28 0 -25.5 0 -22 C 0 -25.5 1.5 -28 5 -28 C 9 -28 14 -25 14 -19 C 14 -12 8 -6 0 0 Z';
const ANGLE_MAP  = { 1: [0], 2: [-50, 50], 4: [-135, -45, 45, 135] };

// 인트로 클로버: 팔레트 색상을 직접 attribute로 받음
function cloverHTML({ size, color, colorDark, leaves = 3, lucky = false }) {
  const angles = ANGLE_MAP[leaves] || [-120, 0, 120];
  const petals = angles.map(a => `
    <g transform="rotate(${a})">
      <path d="${PETAL_PATH}" fill="${color}" stroke="${colorDark}" stroke-width="0.6" stroke-linejoin="round" opacity="0.95"/>
      <path d="M0 -2 L 0 -22" stroke="${colorDark}" stroke-width="0.5" opacity="0.4" fill="none"/>
    </g>`).join('');
  return `<svg viewBox="-40 -40 80 80" width="${size}" height="${size}" style="display:block">
    <g>
      <path d="M0 0 Q 1 12 -2 24" stroke="${colorDark}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.85"/>
      ${petals}
      <circle r="1.6" fill="${colorDark}" opacity="0.8"/>
      ${lucky ? '<circle r="0.9" cx="0.5" cy="-1" fill="#fff7d6"/>' : ''}
    </g>
</svg>`;
}

function luckyCloverImageHTML(size) {
  return `<img class="intro-lucky-clover-img" src="assets/lucky-four-clover.png" alt="" width="${size}" height="${size}">`;
}

// 코너 클로버: CSS 변수로 색상을 받아 팔레트 변경 시 자동 반영
function cloverCSSHTML({ size, leaves = 3, lucky = false }) {
  const angles = ANGLE_MAP[leaves] || [-120, 0, 120];
  const petals = angles.map(a => `
    <g transform="rotate(${a})">
      <path d="${PETAL_PATH}" class="clover-fill"/>
      <path d="M0 -2 L 0 -22" class="clover-vein"/>
    </g>`).join('');
  return `<svg viewBox="-40 -40 80 80" width="${size}" height="${size}" style="display:block">
    <g>
      <path d="M0 0 Q 1 12 -2 24" class="clover-stem"/>
      ${petals}
      <circle r="1.6" class="clover-center"/>
      ${lucky ? '<circle r="0.9" cx="0.5" cy="-1" fill="#fff7d6"/>' : ''}
    </g>
  </svg>`;
}

// ─── CORNER CLOVERS ──────────────────────────────────────────────────────────

function initCornerClovers() {
  CORNER_CLOVERS.forEach(({ section, leaves, rot, size }) => {
    const el = document.querySelector(`#${section} .deco-clover`);
    if (!el) return;
    el.style.transform = `rotate(${rot}deg)`;
    el.innerHTML = cloverCSSHTML({ size, leaves, lucky: leaves === 4 });
  });
}

// ─── INTRO ───────────────────────────────────────────────────────────────────

function generateIntroData(density) {
  const rng   = mulberry32(7);
  const count = density;
  const flX   = 56 + rng() * 12;
  const flY   = 48 + rng() * 18;
  const fl    = { x: flX, y: flY, size: 92, rot: -20 + rng() * 40 };
  const items = [];

  for (let i = 0; i < count; i++) {
    const cols = Math.ceil(Math.sqrt(count * 1.6));
    const rows = Math.ceil(count / cols);
    let x = ((i % cols) / (cols - 1)) * 100 + (rng() - 0.5) * 16;
    let y = (Math.floor(i / cols) / (rows - 1)) * 100 + (rng() - 0.5) * 16;
    x = Math.max(-3, Math.min(103, x));
    y = Math.max(-3, Math.min(103, y));
    const dx = x - flX, dy = y - flY;
    if (Math.sqrt(dx * dx + dy * dy) < 7) continue;
    items.push({ x, y, size: 22 + rng() * 22, rot: -40 + rng() * 80, hue: rng(), z: rng() });
  }

  const twinkles = [];
  for (let i = 0; i < 7; i++) {
    const angle  = rng() * Math.PI * 2;
    const radius = 3 + rng() * 7;
    twinkles.push({
      x: flX + Math.cos(angle) * radius,
      y: flY + Math.sin(angle) * radius * 0.8,
      size: 10 + rng() * 14,
      delay: rng() * 3,
      dur:   1.8 + rng() * 1.6,
    });
  }
  return { clovers: items, fourLeaf: fl, twinkles };
}

function buildCloverField(container, clovers, fourLeaf, greens) {
  clovers.forEach(c => {
    const color = c.hue < 0.5 ? greens[0] : (c.hue < 0.85 ? greens[1] : greens[2]);
    const wrap  = document.createElement('div');
    Object.assign(wrap.style, {
      position:  'absolute',
      left:      c.x + '%',
      top:       c.y + '%',
      transform: `translate(-50%,-50%) rotate(${c.rot}deg)`,
      opacity:   String(0.6 + c.z * 0.4),
      filter:    c.z < 0.4 ? 'blur(0.6px)' : 'none',
    });
    wrap.className = 'intro-generated-clover';
    wrap.innerHTML = cloverHTML({ size: c.size, color, colorDark: greens[3], leaves: 3 });
    container.appendChild(wrap);
  });

  return null;
}

let _introCleanup = null;

function initIntro() {
  if (_introCleanup) _introCleanup();

  const intro      = document.getElementById('intro');
  const fieldBw    = document.getElementById('field-bw');
  const fieldColor = document.getElementById('field-color');
  const sparkle    = document.getElementById('sparkle');
  const foundHint  = document.getElementById('found-hint');
  const lens       = document.getElementById('lens');

  function jumpToPageTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  }

  // 시각 상태 초기화
  intro.removeAttribute('hidden');
  intro.removeAttribute('aria-hidden');
  intro.style.cssText = '';
  intro.classList.remove('found-menu');
  intro.querySelectorAll('.hero-clover, .twinkle, .found-msg, .intro-lucky-target, .intro-section-choice').forEach(el => el.remove());
  lens.classList.remove('found');
  lens.style.display = '';
  fieldBw.classList.remove('blurred');
  fieldColor.classList.remove('blurred');
  fieldBw.innerHTML    = '';
  fieldColor.innerHTML = '';
  sparkle.style.cssText   = '';
  foundHint.style.display = '';
  foundHint.classList.remove('show');
  st.introActive = true;
  st.introFound = false;
  jumpToPageTop();

  const greens = (PALETTES[st.paletteKey] || PALETTES.forest).greens;
  const lensR  = st.lensSize / 2;
  const { clovers, fourLeaf, twinkles } = generateIntroData(st.density);

  buildCloverField(fieldBw,    clovers, fourLeaf, greens);
  buildCloverField(fieldColor, clovers, fourLeaf, greens);

  const luckyTarget = document.createElement('div');
  luckyTarget.className = 'intro-lucky-target';
  Object.assign(luckyTarget.style, {
    left:      fourLeaf.x + '%',
    top:       fourLeaf.y + '%',
    width:     (fourLeaf.size * 1.85) + 'px',
    height:    (fourLeaf.size * 1.85) + 'px',
    transform: `translate(-50%,-50%) rotate(${fourLeaf.rot}deg) scale(0.9)`,
    opacity:   '0',
  });
  luckyTarget.innerHTML = luckyCloverImageHTML(fourLeaf.size * 1.85);
  intro.appendChild(luckyTarget);

  Object.assign(sparkle.style, {
    left:      fourLeaf.x + '%',
    top:       fourLeaf.y + '%',
    background: '#ffe066',
    boxShadow: '0 0 18px 5px rgba(255,224,102,.9), 0 0 36px 10px rgba(255,224,102,.55)',
  });

  lens.style.width  = st.lensSize + 'px';
  lens.style.height = st.lensSize + 'px';
  intro.style.setProperty('--lens-r', (lensR - 12) + 'px');

  const twinkleEls = twinkles.map(t => {
    const el = document.createElement('div');
    el.className = 'twinkle';
    Object.assign(el.style, {
      left:      t.x + '%',
      top:       t.y + '%',
      animation: `twinkle ${t.dur}s ease-in-out ${t.delay}s infinite`,
    });
    el.innerHTML = `<svg width="${t.size}" height="${t.size}" viewBox="-12 -12 24 24"><path d="M 0 -10 L 2 -2 L 10 0 L 2 2 L 0 10 L -2 2 L -10 0 L -2 -2 Z"/></svg>`;
    intro.appendChild(el);
    return el;
  });

  let found  = false;
  let cursor = { x: -500, y: -500 };

  function getFl4Pos() {
    const r = intro.getBoundingClientRect();
    return {
      x: (fourLeaf.x / 100) * r.width,
      y: (fourLeaf.y / 100) * r.height,
    };
  }

  function update(cx, cy) {
    if (found) return;

    const r = intro.getBoundingClientRect();
    const localX = cx - r.left;
    const localY = cy - r.top;

    cursor.x = localX; cursor.y = localY;
    intro.style.setProperty('--mx', localX + 'px');
    intro.style.setProperty('--my', localY + 'px');
    lens.style.left = localX + 'px';
    lens.style.top  = localY + 'px';

    const { x: fx, y: fy } = getFl4Pos();
    const dist   = Math.hypot(localX - fx, localY - fy);
    const inLens = dist < lensR + 18;
    const scale  = inLens ? 1.15 : 0.9;
    const flOp   = inLens ? '1' : '0';

    luckyTarget.style.transform = `translate(-50%,-50%) rotate(${fourLeaf.rot}deg) scale(${scale})`;
    luckyTarget.style.opacity = flOp;

    sparkle.style.opacity = dist > lensR ? '1' : '0';
    foundHint.classList.toggle('show', inLens && !found);
    if (inLens && !found) {
      foundHint.style.left = (localX + 20) + 'px';
      foundHint.style.top  = (localY + lensR - 6) + 'px';
    }
    twinkleEls.forEach(el => { el.style.opacity = inLens ? '0' : '1'; });
  }

  function onFound() {
    if (found) return;

    found = true;
    st.introFound = true;
    intro.classList.add('found-menu');
    lens.classList.add('found');
    lens.style.display = 'none';
    fieldBw.classList.add('blurred');
    fieldColor.classList.add('blurred');
    sparkle.style.display   = 'none';
    foundHint.style.display = 'none';
    twinkleEls.forEach(el => { el.style.display = 'none'; });

    const r = intro.getBoundingClientRect();
    const currentLeft = parseFloat(luckyTarget.style.left) / 100 * r.width;
    const currentTop = parseFloat(luckyTarget.style.top) / 100 * r.height;
    luckyTarget.classList.add('zooming');
    Object.assign(luckyTarget.style, {
      left: currentLeft + 'px',
      top: currentTop + 'px',
      opacity: '1',
      transform: `translate(-50%,-50%) rotate(${fourLeaf.rot}deg) scale(1.15)`,
    });

    requestAnimationFrame(() => {
      Object.assign(luckyTarget.style, {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%) rotate(0deg) scale(4.8)',
      });
    });

    function enterSection(targetId) {
      const target = document.getElementById(targetId);
      const top = target ? target.offsetTop : 0;
      intro.classList.add('passed-through');
      intro.setAttribute('aria-hidden', 'true');
      st.introActive = false;
      window.scrollTo({ top, left: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      if (intro.querySelector('.intro-section-choice')) return;

      const nav = document.createElement('nav');
      nav.className = 'intro-section-choice';
      nav.setAttribute('aria-label', '섹션 선택');
      nav.innerHTML = `
        <img class="intro-menu-clover" src="assets/lucky-four-clover.png" alt="">
        <a class="leaf-choice leaf-choice-hope" href="#leaf1" data-target="leaf1"><span>HOPE</span>나를 알아가기</a>
        <a class="leaf-choice leaf-choice-faith" href="#leaf2" data-target="leaf2"><span>FAITH</span>경험 둘러보기</a>
        <a class="leaf-choice leaf-choice-happiness" href="#leaf3" data-target="leaf3"><span>HAPPINESS</span>일상 들여다보기</a>
        <a class="leaf-choice leaf-choice-luck" href="#leaf4" data-target="leaf4"><span>LUCK</span>제안하기</a>`;
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', event => {
          event.preventDefault();
          enterSection(link.dataset.target);
        });
      });
      intro.appendChild(nav);
      luckyTarget.style.display = 'none';
    }, 760);
  }

  function onMouseMove(e) { update(e.clientX, e.clientY); }
  function onIntroClick() {
    if (found) return;
    const { x: fx, y: fy } = getFl4Pos();
    if (Math.hypot(cursor.x - fx, cursor.y - fy) >= lensR + 18) return;
    onFound();
  }

  window.addEventListener('mousemove', onMouseMove);
  intro.addEventListener('click', onIntroClick);

  _introCleanup = () => {
    window.removeEventListener('mousemove', onMouseMove);
    intro.removeEventListener('click', onIntroClick);
  };
}

// ─── PROJECT SCROLL ──────────────────────────────────────────────────────────

function initTopNavAutoHide() {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;

  let lastY = window.scrollY;
  const minDelta = 6;
  const topBuffer = 24;
  const revealDistance = 48;
  let upwardDistance = 0;

  function reveal() {
    nav.classList.remove('nav-hidden');
  }

  function onScroll() {
    const currentY = window.scrollY;
    const delta = currentY - lastY;

    if (currentY <= topBuffer) {
      reveal();
      lastY = currentY;
      upwardDistance = 0;
      return;
    }

    if (Math.abs(delta) < minDelta) return;

    if (delta > 0) {
      upwardDistance = 0;
      nav.classList.add('nav-hidden');
    } else {
      upwardDistance += Math.abs(delta);
      if (upwardDistance >= revealDistance) reveal();
    }

    lastY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  nav.addEventListener('focusin', reveal);
  nav.addEventListener('mouseenter', reveal);
}

function initProjectScroller() {
  const section = document.getElementById('leaf2');
  const track = document.getElementById('project-track');
  if (!section || !track) return;

  const slides = Array.from(track.querySelectorAll('.project-slide'));
  const maxIndex = Math.max(slides.length - 1, 0);
  let snapTimer = null;
  let isSnapping = false;

  function getProjectProgress() {
    const sectionTop = section.offsetTop;
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    const raw = (window.scrollY - sectionTop) / scrollable;

    return {
      progress: Math.min(1, Math.max(0, raw)),
      scrollable,
      sectionTop,
      isInside: raw >= 0 && raw <= 1,
    };
  }

  function render() {
    const { progress } = getProjectProgress();
    const slideProgress = progress * maxIndex;
    const currentIndex = Math.floor(slideProgress);
    const nextIndex = Math.min(currentIndex + 1, maxIndex);
    const t = slideProgress - currentIndex;
    const viewportCenter = track.clientWidth / 2;
    const centers = slides.map(slide => slide.offsetLeft + slide.offsetWidth / 2 - viewportCenter);
    const start = centers[currentIndex] || 0;
    const end = centers[nextIndex] || start;
    const x = start + (end - start) * t;
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  }

  function snapToNearestSlide() {
    if (maxIndex === 0 || isSnapping) return;

    const { progress, scrollable, sectionTop, isInside } = getProjectProgress();
    if (!isInside) return;

    const nearestIndex = Math.round(progress * maxIndex);
    const targetY = sectionTop + (nearestIndex / maxIndex) * scrollable;
    if (Math.abs(window.scrollY - targetY) < 2) return;

    isSnapping = true;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    window.setTimeout(() => {
      isSnapping = false;
      render();
    }, 520);
  }

  function queueSnap() {
    if (isSnapping) return;
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(snapToNearestSlide, 150);
  }

  render();
  window.addEventListener('scroll', () => {
    render();
    queueSnap();
  }, { passive: true });
  window.addEventListener('resize', render);
}

// ─── POLAROID CAROUSEL ───────────────────────────────────────────────────────

function initPolaroid() {
  const track = document.getElementById('polaroid-track');
  if (!track) return;
  const section = track.closest('.leaf');
  const cards   = Array.from(track.querySelectorAll('.polaroid'));
  const dots    = Array.from(document.querySelectorAll('.pd-dot'));
  const counter = document.querySelector('.pd-count .serif');
  const total   = cards.length;
  const TILTS   = cards.map((_, i) => i * 37 % 11 - 5);

  function goTo(index) {
    const nextIndex = Math.max(0, Math.min(total - 1, index));
    if (nextIndex === st.carouselIdx) return false;

    st.carouselIdx = nextIndex;
    render();
    return true;
  }

  function canStep(direction) {
    return direction < 0 ? st.carouselIdx > 0 : st.carouselIdx < total - 1;
  }

  function getScrollState() {
    if (!section || total <= 1) {
      return { progress: 0, scrollable: 1, sectionTop: 0 };
    }

    const sectionTop = section.offsetTop;
    const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
    const raw = (window.scrollY - sectionTop) / scrollable;
    const progress = Math.min(1, Math.max(0, raw));

    return { progress, scrollable, sectionTop };
  }

  function syncWithScroll() {
    const { progress } = getScrollState();
    const nextIndex = Math.round(progress * Math.max(total - 1, 0));
    goTo(nextIndex);
  }

  function scrollToIndex(index) {
    const nextIndex = Math.max(0, Math.min(total - 1, index));
    const { scrollable, sectionTop } = getScrollState();
    const targetY = sectionTop + (nextIndex / Math.max(total - 1, 1)) * scrollable;
    window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
  }

  function render() {
    cards.forEach((card, i) => {
      const offset   = i - st.carouselIdx;
      const isCenter = offset === 0;
      const centerScale = window.innerWidth <= 720 ? 1.18 : 1.5;
      const sideGap = window.innerWidth <= 720 ? 300 : 470;
      const x   = offset * sideGap;
      const rot = TILTS[i] + (isCenter ? 0 : offset < 0 ? -6 : 6);
      card.style.transform  = `translate(-50%, -50%) translateX(${x}px) rotate(${rot}deg) scale(${isCenter ? centerScale : 0.78})`;
      card.style.zIndex     = String(isCenter ? 5 : Math.abs(offset) === 1 ? 3 : 1);
      card.style.opacity    = String(Math.abs(offset) > 2 ? 0 : isCenter ? 1 : 0.55);
      card.style.transition = 'transform .55s cubic-bezier(.2,.9,.3,1.05), opacity .35s ease';
      card.classList.toggle('active', isCenter);
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === st.carouselIdx));
    if (counter) counter.textContent = String(st.carouselIdx + 1).padStart(2, '0');
    document.querySelector('.polaroid-arrow.left').disabled  = st.carouselIdx === 0;
    document.querySelector('.polaroid-arrow.right').disabled = st.carouselIdx === total - 1;
  }

  document.querySelector('.polaroid-arrow.left')
    ?.addEventListener('click', () => { if (canStep(-1)) scrollToIndex(st.carouselIdx - 1); });
  document.querySelector('.polaroid-arrow.right')
    ?.addEventListener('click', () => { if (canStep(1)) scrollToIndex(st.carouselIdx + 1); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { scrollToIndex(i); }));

  render();
  syncWithScroll();
  window.addEventListener('scroll', syncWithScroll, { passive: true });
  window.addEventListener('resize', () => {
    syncWithScroll();
    render();
  });
}

function initProjectLinks() {
  document.addEventListener('click', event => {
    const link = event.target.closest('.project-links a');
    if (!link) return;

    const href = link.getAttribute('href');
    event.preventDefault();
    event.stopPropagation();

    if (!href || href === '#' || link.getAttribute('aria-disabled') === 'true') return;

    const opened = window.open(link.href, '_blank', 'noopener,noreferrer');
    if (!opened) window.location.assign(link.href);
  }, true);
}

// ─── BOOT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  applyPaletteVars(st.paletteKey);
  initCornerClovers();
  initIntro();
  initTopNavAutoHide();
  initProjectScroller();
  initProjectLinks();
  initPolaroid();
});
